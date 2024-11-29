import { addRecordToNotion } from "../services/notionService";
import { Evaluation, EVALUATIONS } from "../types/evaluation";

export async function handleSlackResponse(evaluation: string, comment: string = "") {
  if (EVALUATIONS.includes(evaluation as Evaluation)) {
    await addRecordToNotion(evaluation as Evaluation, comment);
  } else {
    console.error("Invalid evaluation received:", evaluation);
  }
}
