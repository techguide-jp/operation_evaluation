# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## プロジェクト概要

30分ごとにSlackに評価ボタン（Best/Better/Needs Improvement/Worst）を送信し、クリックされた評価をNotionデータベースに自動記録するシステム。

**技術スタック**
- TypeScript + Express.js
- Notion API (@notionhq/client)
- Slack Webhook
- ngrok（外部公開用トンネル）
- node-cron（スケジューラー）
- EJS（テンプレートエンジン）
- Docker

## 開発コマンド

```bash
# 開発環境起動（Docker使用）
make up
# または
docker compose up --build

# ローカル実行（nodemon使用）
npm start

# TypeScriptから直接実行
npx ts-node src/index.ts
```

## 環境変数設定

`.env`ファイルに以下を設定（`.env.sample`参照）:
- `NOTION_API_KEY`: Notion API認証キー
- `NOTION_DATABASE_ID`: 記録先NotionデータベースID
- `SLACK_WEBHOOK_URL`: Slack Incoming Webhook URL
- `NGROK_AUTHTOKEN`: ngrok認証トークン
- `DATABASE_URL`: （未使用だが設定されている）

## アーキテクチャ

### 起動フロー（src/index.ts）
1. ngrokトンネルを確立し公開URLを取得（`getNgrokPublicUrl()`）
2. 公開URLを含むSlackメッセージを送信（初回送信）
3. Express サーバーを起動（PORT: 3003）
4. 30分ごとの定期実行を開始（cronScheduler）

### データフロー
```
[Cron Scheduler] --30分ごと--> [Slack Webhook]
    ↓
[ユーザーボタンクリック]
    ↓
[GET /slack/actions?evaluation={評価}]
    ↓
[slackHandler] --> [notionService] --> [Notion Database]
    ↓
[EJSレンダリング] --> [ユーザーに完了画面表示]
```

### ngrok URL管理の重要性

**ngrokの制約**: 無料プランでは同時接続数が3つまで。新しいトンネルを作成するとセッションが切断される。

**実装の対策**:
- `src/utils/ngrokUtils.ts`で`cachedUrl`にngrok URLをキャッシュ
- 初回起動時のみngrokトンネルを確立し、以降はキャッシュされたURLを再利用
- これにより複数回の実行でもセッション切断を防ぐ

### Notionデータベース構造

`addRecordToNotion()`が以下のプロパティを作成:
- **名前** (title): 日時の文字列（例: `2025-01-09 10:30:45`）
- **日時** (date): ISO 8601形式のタイムスタンプ
- **単位** (select): 固定値 `'30分'`
- **評価** (select): `Best` | `Better` | `Needs Improvement` | `Worst`
- **コメント** (rich_text): オプショナルなコメント文字列

### ルーティング（src/server/slackRoutes.ts）

- `GET /slack/actions?evaluation={評価}&comment={コメント}`
  - Slackボタンから呼び出されるエンドポイント
  - クエリパラメータで評価とコメントを受け取る
  - `slackResponse.ejs`をレンダリングして完了画面を返す

## ディレクトリ構造の意図

```
src/
├── config/         # 環境変数の読み込みと設定
├── handlers/       # ビジネスロジック（評価の検証とNotionへの委譲）
├── scheduler/      # cron定期実行の管理
├── server/         # Express ルーティング定義
├── services/       # 外部API連携（Notion/Slack）
├── types/          # TypeScript型定義（Evaluation型）
├── utils/          # ngrok公開URL管理ユーティリティ
├── views/          # EJSテンプレート
└── index.ts        # エントリーポイント
```

**関心の分離**:
- `handlers/`: リクエストの検証とサービス層への委譲
- `services/`: 外部APIとの通信ロジック
- `server/`: HTTPルーティングとレスポンス処理
- `scheduler/`: 時間ベースのトリガー管理

## 開発時の注意点

### ngrokの取り扱い
- `getNgrokPublicUrl()`は初回呼び出し時のみトンネルを確立し、以降はキャッシュを返す
- 開発中に何度もサーバーを再起動する場合、ngrokセッションが切れる可能性あり
- Dockerコンテナを再起動すると新しいngrok URLが生成されるため、Slackボタンが動作しなくなる
  - 対策: Slackに送信される初回メッセージの公開URLを確認し、必要に応じて手動で再送信

### Notion API
- Notionデータベースには事前に以下のプロパティを作成する必要がある:
  - 名前（タイトル）、日時（日付）、単位（セレクト）、評価（セレクト）、コメント（テキスト）
- プロパティ名は日本語で定義されている（`名前`、`日時`など）

### TypeScript設定
- `tsconfig.json`で`CommonJS`モジュールシステムを使用
- `strict: true`で厳格な型チェックが有効
- ビルド出力先は`./dist`だが、通常は`ts-node`で直接実行

## トラブルシューティング

### ngrok接続エラー
- `NGROK_AUTHTOKEN`が正しく設定されているか確認
- ngrokの同時接続数制限（3つまで）に達していないか確認
- `cachedUrl`のキャッシュ機構により、通常は再接続を防ぐ

### Slackメッセージが届かない
- `SLACK_WEBHOOK_URL`が正しいか確認
- Slack Appの設定でIncoming Webhookが有効になっているか確認

### Notionへの記録が失敗する
- `NOTION_API_KEY`とデータベースの権限を確認
- Notionデータベースのプロパティ名と型が一致しているか確認
- コンソールログに詳細なエラー情報が出力される
