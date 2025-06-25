import express from "express";
const router = express.Router();

import { CommentController } from "../controllers/comment.js";

class CommentRouter {
  constructor() {
    this.commentController = new CommentController();
  }

  routes() {
    // POST Method
    router.post(
      "/",
      this.commentController.useCreateComment.bind(this.commentController)
    );

    // GET Method
    router.get(
      "/",
      this.commentController.useGetComments.bind(this.commentController)
    );
    router.get(
      "/:id",
      this.commentController.useGetCommentById.bind(this.commentController)
    );

    // DELETE Method
    router.delete(
      "/:id",
      this.commentController.useDeleteComment.bind(this.commentController)
    );

    return router;
  }
}

export default new CommentRouter();
