import { Comment } from "../appwrite/comments.js";

export class CommentController extends Comment {
  async useCreateComment(req, res) {
    try {
      if (!req.body)
        return res.status(400).json({ message: "Unprocessable entity" });

      await this.create(req.body);
      return res.status(201).json({ message: "Comment created successfully" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async useGetComments(req, res) {
    try {
      const comments = await this.getComments();
      return res.status(200).json(comments);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async useGetCommentById(req, res) {
    try {
      const id = req.params.id;

      if (!id) return res.status(400).json({ message: "Unprocessable entity" });

      const comment = await this.getCommentById(id);
      return res.status(200).json(comment);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async useGetCommentsByIdPagination(req, res) {
    try {
      const { id, page } = req.params;

      if (!id || !page || isNaN(page))
        return res.status(400).json({ message: "Unprocessable Entity" });

      const comments = await this.getCommentsByIdPagination(id, page);
      return res.status(200).json(comments);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async useGetCommentPagination(req, res) {
    try {
      const { page } = req.params;
      if (!page || isNaN(page))
        return res.status(400).json({ message: "Unprocessable entity" });

      const comment = await this.getCommentPagination(page);
      return res.status(200).json(comment);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async useDeleteComment(req, res) {
    try {
      const id = req.params.id;
      if (!id) return res.status(400).json({ message: "Unprocessable entity" });

      await this.delete(id);
      return res.status(200).json({ message: "Comment deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
}
