import { Mistral } from "@mistralai/mistralai";
import { MISTRAL_PROMPT_REFINE } from "../utils/refine-ai.js";
import { MISTRAL_PROMPT_REPLY } from "../utils/reply-suggestion.js";
import { MISTRAL_PROMPT_TAG_SUGGESTION } from "../utils/tag-suggestion.js";
import dotenv from "dotenv";

dotenv.config();

const apiKey = process.env.MISTRAL_API_KEY;
const mistral = new Mistral({ apiKey: apiKey });

export class MistralAI {
  // Refine Confession AI Based on Context
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

  // Generate Comment Based on Confession, Comment or Reply
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

      if (!chatResponse) {
        throw new Error("Failed to generate comment.");
      }

      const parsedChatResponse = JSON.parse(
        chatResponse.choices[0].message.content
      );
      return parsedChatResponse;
    } catch (error) {
      console.error("Error in generateComment:", error);
      throw error;
    }
  }

  // Generate Tags Based on Confession
  async generateTags(confession) {
    try {
      const prompt = `Confession:\n${confession}`;
      const chatResponse = await mistral.chat.complete({
        model: "mistral-large-latest",
        temperature: 0.7,
        max_tokens: 5000,
        messages: [
          {
            role: "system",
            content: MISTRAL_PROMPT_TAG_SUGGESTION,
          },
          {
            role: "user",
            content: prompt,
          },
        ],
      });

      if (!chatResponse) {
        throw new Error("Failed to generate tags.");
      }

      const parsedChatResponse = JSON.parse(
        chatResponse.choices[0].message.content
      );
      return parsedChatResponse;
    } catch (error) {
      console.error("Error in generateTags:", error);
      throw error;
    }
  }
}
