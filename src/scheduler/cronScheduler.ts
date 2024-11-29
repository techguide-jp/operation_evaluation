import cron from "node-cron";
import { sendSlackMessage } from "../services/slackService";
import { getNgrokPublicUrl } from "../utils/ngrokUtils";

export function startCronScheduler() {
  cron.schedule("*/30 * * * *", async () => {
    console.log("Sending Slack notification...");
    const publicUrl = await getNgrokPublicUrl(); // ngrokのpublicUrlを取得
    sendSlackMessage(publicUrl); // publicUrlを引数として渡す
  });
}
