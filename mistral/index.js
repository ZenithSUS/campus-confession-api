import { Mistral } from "@mistralai/mistralai";
import { MISTRAL_PROMPT_REFINE } from "../utils/refine-ai.js";
import dotenv from "dotenv";

dotenv.config();

const apiKey = process.env.MISTRAL_API_KEY;
const mistral = new Mistral({ apiKey: apiKey });

export class MistralAI {
  async refineConfession(confession, context) {
    try {
      const prompt = `Confession:\n${confession}\n\nContext:\n${context}`;
      const chatResponse = await mistral.chat.complete({
        model: "mistral-large-latest",
        temperature: 0.7,
        max_tokens: 2000,
        messages: [
          {
            role: "system",
            content: MISTRAL_PROMPT_REFINE,
          },
          {
            role: "user",
            content: prompt,
          },
        ],
      });

      const parsedChatResponse = JSON.parse(chatResponse.choices[0].message.content);
      return parsedChatResponse;
    } catch (error) {
      console.error("Error in useRefineConfession:", error);
      throw error;
    }
  }
}
