import ngrok from 'ngrok';
import { PORT } from '..';

export async function getNgrokPublicUrl(): Promise<string> {
  try {
    // ngrokのトンネルを開始し、公開URLを取得
    const url = await ngrok.connect(Number(PORT));
    console.log("ngrok public URL:", url);
    return url;
  } catch (error) {
    console.error("Error getting ngrok public URL:", error);
    throw error;
  }
}
