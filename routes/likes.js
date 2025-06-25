import express from "express";
const router = express.Router();
import { LikeController } from "../controllers/likes.js";

class LikeRouter {
  constructor() {
    this.likeController = new LikeController();
  }

  routes() {
    // POST Method
    router.post(
      "/",
      this.likeController.useCreateLike.bind(this.likeController)
    );

    // GET Method
    router.get(
      "/",
      this.likeController.useGetAllLikes.bind(this.likeController)
    );
    router.get(
      "/confession/:id",
      this.likeController.useGetConfessionLikeById.bind(this.likeController)
    );

    router.get(
      "/comments/:id",
      this.likeController.useGetCommentLikeById.bind(this.likeController)
    );

    router.get(
      "/child-comments/:id",
      this.likeController.useGetChildrenCommentLikeById.bind(
        this.likeController
      )
    );

    // DELETE Method
    router.delete(
      "/:id",
      this.likeController.useDeleteLike.bind(this.likeController)
    );

    // UPDATE Method
    router.put(
      "/:id",
      this.likeController.useUpdateLike.bind(this.likeController)
    );

    return router;
  }
}

export default new LikeRouter();
