import express from "express";
import { handleSlackResponse } from "../handlers/slackHandler";

const router = express.Router();

// Slackのアクションを受信するエンドポイント
router.get("/slack/actions", async (req, res) => {
  try {
    console.log("Query params:", req.query);
    const evaluation = req.query.evaluation as string;
    const comment = req.query.comment ? req.query.comment as string : "";
    //console.log("Received Slack payload:", payload);

    await handleSlackResponse(evaluation, comment);

    res.render("slackResponse", { evaluation, comment });
  } catch (error) {
    console.error("Error in /slack/actions:", error);
    res.status(500).send("エラーが発生しました。もう一度お試しください。");
  }
});

export default router;

