import express from "express";
const router = express.Router();

import { ChildrenCommentController } from "../controllers/children-comments.js";

class ChildrenCommentRouter {
  constructor() {
    this.childrenCommentController = new ChildrenCommentController();
  }

  routes() {
    // POST Method
    router.post(
      "/",
      this.childrenCommentController.useCreateChildrenComment.bind(
        this.childrenCommentController
      )
    );

    // GET Method
    router.get(
      "/:id",
      this.childrenCommentController.useGetChildrenComments.bind(
        this.childrenCommentController
      )
    );

    return router;
  }
}

export default new ChildrenCommentRouter();