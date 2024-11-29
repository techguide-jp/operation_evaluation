import express from "express";
import bodyParser from "body-parser";
import slackRoutes from "./server/slackRoutes";
import { startCronScheduler } from "./scheduler/cronScheduler";
import { sendSlackMessage } from "./services/slackService";
import { getNgrokPublicUrl } from "./utils/ngrokUtils";

const app = express();
export const PORT = process.env.PORT || 3003;

// ミドルウェア設定
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// ルート設定
app.use(slackRoutes);

// サーバー起動とngrok設定
(async () => {
  try {
    const publicUrl = await getNgrokPublicUrl(); // ngrokのpublicUrlを取得
    // Slackボタンに設定するURLを公開URLに反映
    await sendSlackMessage(publicUrl);

    // サーバー起動
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });

    // スケジューラー開始
    startCronScheduler();
  } catch (error) {
    console.error("Failed to start server or ngrok:", error);
  }
})();
