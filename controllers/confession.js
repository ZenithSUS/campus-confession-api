import { Confession } from "../appwrite/confessions.js";

export class ConfessionController extends Confession {
  // Confession Routes
  async useCreateConfession(req, res) {
    try {
      if (!req.body) {
        return res.status(400).json({ message: "Unprocessable entity" });
      }

      await this.create(req.body);
      return res.status(201).json({
        message: "Confession created successfully",
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async useGetConfessions(req, res) {
    try {
      const filter = req.query.filter;
      if (filter) {
        const confession = await this.getConfessions(filter);
        return res.status(200).json(confession);
      }

      const confessions = await this.getConfessions();
      return res.status(200).json(confessions);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async useGetConfessionById(req, res) {
    try {
      const id = req.params.id;

      if (!id) return res.status(400).json({ message: "Unprocessable entity" });

      const confession = await this.getConfessionById(id);
      return res.status(200).json(confession);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async useDeleteConfession(req, res) {
    try {
      const id = req.params.id;

      if (!id) {
        return res.status(400).json({ message: "Unprocessable entity" });
      }

      await this.deleteConfession(id);
      return res
        .status(200)
        .json({ message: "Confession deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
}
