import { ChildrenComments } from "../appwrite/children-comments.js";

export class ChildrenCommentController extends ChildrenComments {

  async useGetChildrenComments(req, res) {
    try {
      const childrenComments = await this.getAllChildrenComments();
      return res.status(200).json(childrenComments);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }


  async useGetChildrenCommentsById(req, res) {
    try {
      const childrenComments = await this.getAllChildrenCommentsById(
        req.params.id
      );
      return res.status(200).json(childrenComments);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async useGetChildrenCommentsByIdPagination(req, res) {
    try {
      const { id, offset, limit } = req.params;

      if (!id || !offset || !limit || isNaN(offset) || isNaN(limit))
        return res.status(400).json({ message: "Unprocessable Entity" });

      const childrenComments = await this.getAllChildrenCommentsByIdPagination(
        id,
        offset,
        limit
      );
      return res.status(200).json(childrenComments);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async useCreateChildrenComment(req, res) {
    try {
      if (!req.body)
        return res.status(400).json({
          message: "Unprocessable Entity",
        });

      await this.createChildrenComment(req.body);
      return res.status(200).json({
        message: "Children Comment Created!",
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
}
