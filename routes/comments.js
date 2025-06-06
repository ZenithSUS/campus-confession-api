import express from "express";
const router = express.Router();

import { CommentController } from "../controllers/comment.js";
const commentController = new CommentController();

// POST Method
router.post("/", commentController.useCreateComment.bind(commentController));

// GET Method
router.get("/", commentController.useGetComments.bind(commentController));
router.get("/:id", commentController.useGetCommentById.bind(commentController));

// DELETE Method
router.delete(
  "/:id",
  commentController.useDeleteComment.bind(commentController)
);

export default router;
