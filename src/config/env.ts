import dotenv from "dotenv";
dotenv.config();

export const NOTION_API_KEY = process.env.NOTION_API_KEY!;
export const NOTION_DATABASE_ID = process.env.NOTION_DATABASE_ID!;
export const SLACK_WEBHOOK_URL = process.env.SLACK_WEBHOOK_URL!;

