import ngrok from 'ngrok';
import { PORT } from '..';

let cachedUrl: string | null = null;

export async function getNgrokPublicUrl(): Promise<string> {
  if (cachedUrl) {
    // すでにキャッシュされている場合は再利用
    console.log("Using cached ngrok public URL:", cachedUrl);
    return cachedUrl;
  }
  if (!process.env.NGROK_AUTHTOKEN) {
    throw new Error("NGROK_AUTHTOKEN is not set in environment variables.");
  }

  try {
    // 環境変数からngrokの認証トークンを設定
    await ngrok.authtoken(process.env.NGROK_AUTHTOKEN);

    // ngrokのトンネルを開始し、公開URLを取得
    cachedUrl = await ngrok.connect(Number(PORT));
    console.log("ngrok public URL obtained:", cachedUrl);
    return cachedUrl;
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error getting ngrok public URL:", error.message);
      throw new Error(`Failed to get ngrok public URL: ${error.message}`);
    } else {
      console.error("Unknown error occurred while getting ngrok public URL:", error);
      throw new Error("An unknown error occurred while getting ngrok public URL.");
    }
  }
}
