# Operation Evaluation

30分ごとに作業の評価を自動収集し、Notionに記録するタイムトラッキング・評価システム

## 概要

定期的にSlackへ評価リクエストを送信し、ユーザーがボタンをクリックするだけで作業評価をNotionデータベースに自動記録します。作業の中断を最小限に抑えながら、継続的な自己評価とデータ蓄積を実現します。

### 主な機能

- **30分間隔の自動通知**: cronスケジューラーで定期的にSlackへ評価リクエストを送信
- **4段階評価システム**: Best / Better / Needs Improvement / Worst から選択
- **Notion自動記録**: 評価結果を日時・コメントと共にNotionデータベースへ保存
- **ngrokトンネル**: ローカル環境でもSlackからのコールバックを受信可能

## 技術スタック

- **Backend**: TypeScript, Express.js
- **外部連携**: Notion API, Slack Webhook, ngrok
- **スケジューリング**: node-cron
- **テンプレート**: EJS
- **インフラ**: Docker, Docker Compose

## セットアップ

### 必要な準備

1. **Notionデータベース**
   - 以下のプロパティを持つデータベースを作成:
     - `名前` (タイトル型)
     - `日時` (日付型)
     - `単位` (セレクト型) - オプション: `30分`
     - `評価` (セレクト型) - オプション: `Best`, `Better`, `Needs Improvement`, `Worst`
     - `コメント` (テキスト型)
   - Notion APIキーを取得し、データベースへのアクセス権限を付与

2. **Slack Webhook**
   - Slack AppでIncoming Webhookを有効化
   - Webhook URLを取得

3. **ngrok**
   - [ngrok](https://ngrok.com/)でアカウント登録
   - 認証トークンを取得

### 環境変数設定

`.env`ファイルを作成（`.env.sample`を参考）:

```env
NOTION_API_KEY=your_notion_api_key
NOTION_DATABASE_ID=your_database_id
SLACK_WEBHOOK_URL=your_slack_webhook_url
NGROK_AUTHTOKEN=your_ngrok_authtoken
DATABASE_URL=file:local.db
```

### 起動方法

#### Docker（推奨）

```bash
make up
# または
docker compose up --build
```

#### ローカル実行

```bash
npm install
npm start
```

## 使い方

1. サーバーを起動すると、初回のSlackメッセージが送信されます
2. 30分ごとに「30分間の評価を入力してください」というメッセージがSlackに届きます
3. 評価ボタン（Best / Better / Needs Improvement / Worst）をクリック
4. 評価が自動的にNotionデータベースに記録されます
5. 完了画面が表示されます

## アーキテクチャ

### 起動フロー

```
起動
 ↓
ngrokトンネル確立（公開URL取得）
 ↓
初回Slackメッセージ送信
 ↓
Expressサーバー起動（ポート3003）
 ↓
cronスケジューラー開始（30分間隔）
```

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
[完了画面表示]
```

## ディレクトリ構造

```
src/
├── config/         # 環境変数の読み込み
├── handlers/       # ビジネスロジック
├── scheduler/      # cron定期実行
├── server/         # Expressルーティング
├── services/       # 外部API連携（Notion/Slack）
├── types/          # TypeScript型定義
├── utils/          # ngrok管理ユーティリティ
├── views/          # EJSテンプレート
└── index.ts        # エントリーポイント
```

## 注意事項

### ngrok制約
- 無料プランでは同時接続数が3つまで
- 本プロジェクトではngrok URLをキャッシュすることで、セッション切断を防止
- Dockerコンテナを再起動すると新しいngrok URLが生成されるため、Slackボタンが一時的に動作しなくなる可能性あり

### 開発時のポイント
- サーバー再起動時は初回Slackメッセージで新しい公開URLが送信される
- コンソールログに詳細なデバッグ情報が出力される
- Notionデータベースのプロパティ名は日本語で定義されている

## トラブルシューティング

**ngrok接続エラー**
- `NGROK_AUTHTOKEN`が正しく設定されているか確認
- ngrokの同時接続数制限に達していないか確認

**Slackメッセージが届かない**
- `SLACK_WEBHOOK_URL`が正しいか確認
- Incoming Webhookが有効になっているか確認

**Notionへの記録が失敗する**
- `NOTION_API_KEY`とデータベースの権限を確認
- データベースのプロパティ名と型が一致しているか確認

## ライセンス

このプロジェクトは個人利用を想定しています。
