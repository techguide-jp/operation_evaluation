import axios from "axios";

export async function sendSlackMessage(publicUrl: string) {
  try {
    const message = {
      text: "30分間の評価を入力してください",
      attachments: [
        {
          text: "評価を選択してください",
          fallback: "評価を選択してください",
          callback_id: "evaluation_action",
          actions: [
            { name: "evaluation", text: "Best", type: "button", value: `${publicUrl}/slack/actions?evaluation=Best` },
            { name: "evaluation", text: "Better", type: "button", value: `${publicUrl}/slack/actions?evaluation=Better` },
            { name: "evaluation", text: "Needs Improvement", type: "button", value: `${publicUrl}/slack/actions?evaluation=Needs Improvement` },
            { name: "evaluation", text: "Worst", type: "button", value: `${publicUrl}/slack/actions?evaluation=Worst` },
          ],
        },
      ],
    };
    console.log("Sending Slack message:", {
      ...message,
      actions: message.attachments[0].actions
    });
    const webhookUrl = process.env.SLACK_WEBHOOK_URL;
    if (!webhookUrl) {
      throw new Error("SLACK_WEBHOOK_URL is not defined");
    }
    await axios.post(webhookUrl, message);
    console.log("Slack message sent");
  } catch (error) {
    console.error("Failed to send Slack message:", error);
  }
}
