import { Mistral } from "@mistralai/mistralai";
import { MISTRAL_PROMPT_REFINE } from "../utils/refine-ai.js";
import dotenv from "dotenv";
import { MISTRAL_PROMPT_REPLY } from "../utils/reply-suggestion.js";

dotenv.config();

const apiKey = process.env.MISTRAL_API_KEY;
const mistral = new Mistral({ apiKey: apiKey });

export class MistralAI {
  async refineConfession(confession, context) {
    try {
      if (
        !confession ||
        !context ||
        typeof confession !== "string" ||
        typeof context !== "string"
      ) {
        throw new Error("Confession and context are required.");
      }

      const prompt = `Confession:\n${confession}\n\nContext:\n${context}`;
      const chatResponse = await mistral.chat.complete({
        model: "mistral-large-latest",
        temperature: 0.7,
        max_tokens: 5000,
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

      const parsedChatResponse = JSON.parse(
        chatResponse.choices[0].message.content
      );
      return parsedChatResponse;
    } catch (error) {
      console.error("Error in useRefineConfession:", error);
      throw error;
    }
  }

  async generateComment(input) {
    try {
      if (!input && typeof input !== "string") {
        throw new Error("Input is required.");
      }
      const prompt = `Input:\n${input}`;
      const chatResponse = await mistral.chat.complete({
        model: "mistral-large-latest",
        temperature: 0.7,
        max_tokens: 5000,
        messages: [
          {
            role: "system",
            content: MISTRAL_PROMPT_REPLY,
          },
          {
            role: "user",
            content: prompt,
          },
        ],
      });

      const parsedChatResponse = JSON.parse(
        chatResponse.choices[0].message.content
      );
      return parsedChatResponse;
    } catch (error) {
      console.error("Error in generateComment:", error);
      throw error;
    }
  }
}
