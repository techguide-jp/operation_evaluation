FROM node:20

WORKDIR /app

# ngrokをインストール
RUN curl -sSL https://ngrok-agent.s3.amazonaws.com/ngrok.asc \
    | tee /etc/apt/trusted.gpg.d/ngrok.asc >/dev/null \
    && echo "deb https://ngrok-agent.s3.amazonaws.com buster main" \
    | tee /etc/apt/sources.list.d/ngrok.list \
    && apt update \
    && apt install -y ngrok

# 必要な依存関係をインストール
COPY package*.json ./
RUN npm install

# プロジェクトファイルをコピー
COPY . .

# nodemonをグローバルにインストール
RUN npm install -g nodemon ts-node

# 修正：ngrokの設定をアップグレードし、起動コマンドを調整
CMD ["sh", "-c", "ngrok config upgrade && ngrok authtoken ${NGROK_AUTHTOKEN} && ngrok http 3003 & npx ts-node src/index.ts"]
