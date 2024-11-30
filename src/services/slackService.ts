import axios from "axios";

interface SlackAction {
  name: string;
  text: string;
  type: string;
  url: string;
}

function createSlackAction(name: string, evaluation: string, publicUrl: string): SlackAction {
  return {
    name: name,
    text: evaluation,
    type: "button",
    url: `${publicUrl}/slack/actions?evaluation=${encodeURIComponent(evaluation)}`,
  };
}

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
            createSlackAction("evaluation", "Best", publicUrl),
            createSlackAction("evaluation", "Better", publicUrl),
            createSlackAction("evaluation", "Needs Improvement", publicUrl),
            createSlackAction("evaluation", "Worst", publicUrl),
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
