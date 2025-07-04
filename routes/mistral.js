import express from "express";
import { MistralController } from "../controllers/mistral.js";

const router = express.Router();

class MistralRoutes {
  constructor() {
    this.mistralController = new MistralController();
  }

  routes() {
    // POST Method
    router.post(
      "/refineConfession",
      this.mistralController.useRefineConfession.bind(this.mistralController)
    );

    router.post(
      "/generateComment",
      this.mistralController.useGenerateComment.bind(this.mistralController)
    );
    return router;
  }
}

export default new MistralRoutes();
