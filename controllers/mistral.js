import { MistralAI } from "../mistral/index.js";

export class MistralController extends MistralAI {
  async useRefineConfession(req, res) {
    try {
      const { confession, context } = req.body;
      const refinedConfession = await this.refineConfession(
        confession,
        context
      );
      return res.status(200).json(refinedConfession);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async useGenerateComment(req, res) {
    try {
      const { input } = req.body;
      const generatedComment = await this.generateComment(input);
      return res.status(200).json(generatedComment);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
}
