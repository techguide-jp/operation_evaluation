import express from "express";
import { handleSlackResponse } from "../handlers/slackHandler";

const router = express.Router();

// Slackのアクションを受信するエンドポイント
router.post("/slack/actions", async (req, res) => {
  try {
    const payload = JSON.parse(req.body);
    //console.log("Received Slack payload:", payload);

    const userName = payload.user.name; // Extract userName from payload
    const timeUnit = payload.actions[0].value; // Extract timeUnit from payload
    const comment = payload.actions[1]?.value || ""; // Extract comment from payload if available

    await handleSlackResponse(payload.evaluation, userName, timeUnit, comment);

    res.status(200).send("評価が記録されました。ありがとうございます！");
  } catch (error) {
    console.error("Error in /slack/actions:", error);
    res.status(500).send("エラーが発生しました。もう一度お試しください。");
  }
});

export default router;

