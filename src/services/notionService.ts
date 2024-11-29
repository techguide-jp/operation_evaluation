import { Client } from "@notionhq/client";
import { NOTION_API_KEY, NOTION_DATABASE_ID } from "../config/env";
import { Evaluation } from "../types/evaluation";

const notion = new Client({ auth: NOTION_API_KEY });

export async function addRecordToNotion(
  evaluation: Evaluation,
  recordName: string = new Date().toLocaleString('ja-JP', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' }).replace(/\//g, '-'),
  timeUnit: string = new Date().toISOString(),
  comment: string = ""
): Promise<void> {
  console.log("Notion Record Data:", {
    名前: recordName,
    日時: recordName,
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
          title: [{
            type: "text",
            text: { content: recordName }
          }],
        },
        日時: {
          type: "date",
          date: { start: new Date().toISOString() },
        },
        単位: {
          type: "select",
          select: { name: '30分' },
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
    throw error;
  }
}
