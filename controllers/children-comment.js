import { ChildrenComments } from "../appwrite/children-comments.js";

export class ChildrenCommentController extends ChildrenComments {
  async useGetChildrenComments(req, res) {
    try {
      const childrenComments = await this.getAllChildrenComments(
        req.params.commentId
      );
      return res.status(200).json(childrenComments);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async getChildrenComments(req, res) {
    try {
      const commentId = req.params.commentId;
      const childrenComments = await this.getAllChildrenComments(commentId);

      return res.status(200).json(childrenComments);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
}
