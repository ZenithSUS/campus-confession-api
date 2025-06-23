import { ChildrenComments } from "../appwrite/children-comments.js";

export class ChildrenCommentController extends ChildrenComments {
  async useGetChildrenComments(req, res) {
    try {
      const childrenComments = await this.getAllChildrenComments(
        req.params.id
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
