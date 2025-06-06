import express from "express";
const router = express.Router();

import { ConfessionController } from "../controllers/confession.js";
const confessionController = new ConfessionController();

// POST Method
router.post(
  "/",
  confessionController.useCreateConfession.bind(confessionController)
);

// GET Method
router.get(
  "/",
  confessionController.useGetConfessions.bind(confessionController)
);

// DELETE Method
router.delete(
  "/",
  confessionController.useDeleteConfession.bind(confessionController)
);

export default router;
