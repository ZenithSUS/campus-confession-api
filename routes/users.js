import express from "express";
import { UserController } from "../controllers/users.js";
const router = express.Router();

class UserRoutes {
  constructor() {
    this.userController = new UserController();
  }

  routes() {
    // POST Method
    router.post(
      "/",
      this.userController.useCreateUser.bind(this.userController)
    );

    // GET Method
    router.get("/", this.userController.useGetUsers.bind(this.userController));

    // DELETE Method
    router.delete(
      "/:id",
      this.userController.useDeleteUser.bind(this.userController)
    );

    return router;
  }
}

export default new UserRoutes();
