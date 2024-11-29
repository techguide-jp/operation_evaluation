import { Client } from "@notionhq/client";
import { NOTION_API_KEY, NOTION_DATABASE_ID } from "../config/env";
import { Evaluation } from "../types/evaluation";

const notion = new Client({ auth: NOTION_API_KEY });

export async function addRecordToNotion(evaluation: Evaluation, userName: string, timeUnit: string, comment: string = "") {
  console.log("Notion Record Data:", {
    名前: userName,
    日時: new Date().toISOString(),
    単位: timeUnit,
    評価: evaluation,
    コメント: comment,
  });
  try {
    const response = await notion.pages.create({
      parent: { database_id: NOTION_DATABASE_ID },
      properties: {
        名前: {
          type: "title",
          title: [{ text: { content: userName || "匿名" } }],
        },
        日時: {
          type: "date",
          date: { start: new Date().toISOString() },
        },
        単位: {
          type: "select",
          select: { name: timeUnit },
        },
        評価: {
          type: "select",
          select: { name: evaluation },
        },
        コメント: {
          type: "rich_text",
          rich_text: [{ text: { content: comment } }],
        },
      },
    });
    console.log("Record added to Notion:", response);
  } catch (error) {
    console.error("Failed to add record to Notion:", error);
  }
}
