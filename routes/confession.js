import express from "express";
const router = express.Router();

import { ConfessionController } from "../controllers/confession.js";
class ConfessionRouter {
  constructor() {
    this.confessionController = new ConfessionController();
  }

  routes() {
    // POST Method
    router.post(
      "/",
      this.confessionController.useCreateConfession.bind(
        this.confessionController
      )
    );

    // GET Method
    router.get(
      "/",
      this.confessionController.useGetConfessions.bind(
        this.confessionController
      )
    );
    router.get(
      "/top",
      this.confessionController.useGetTop10Confessions.bind(
        this.confessionController
      )
    );
    router.get(
      "/:id",
      this.confessionController.useGetConfessionById.bind(
        this.confessionController
      )
    );
    router.get(
      "/pagination/:page",
      this.confessionController.useGetConfessionPagination.bind(
        this.confessionController
      )
    );

    // DELETE Method
    router.delete(
      "/:id",
      this.confessionController.useDeleteConfession.bind(
        this.confessionController
      )
    );

    return router;
  }
}

export default new ConfessionRouter();
