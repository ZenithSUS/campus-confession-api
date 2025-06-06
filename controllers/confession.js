import { Confession } from "../appwrite/confessions";

export const confession = new Confession();

export class ConfessionController extends Confession {
  async createConfession(req, res) {
    try {
      if (!req.body) {
        return res.status(400).json({ message: "Body is required" });
      }

      await confession.create(req.body);
      return res.status(201).json({
        message: "Confession created successfully",
      });

    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async getConfessions(req, res) {
    try {
        const confessions = await confession.getConfessions();
        return res.status(200).json(confessions);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
}
