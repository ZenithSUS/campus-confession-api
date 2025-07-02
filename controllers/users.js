import { User } from "../appwrite/users.js";

export class UserController extends User {
  // Create user
  async useCreateUser(req, res) {
    try {
      const data = req.body;

      if (!data && typeof data !== "object") {
        return res.status(400).json({ message: "Unprocessable entity" });
      }

      await this.create(data);

      return res.status(201).json({ message: "User created successfully" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  // Get all users
  async useGetUsers(req, res) {
    try {
      const users = await this.getAllUsers();
      return res.status(200).json(users);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  // Delete user
  async useDeleteUser(req, res) {
    try {
      const id = req.params.id;

      if (!id) {
        return res.status(400).json({ message: "Unprocessable Entity" });
      }

      await this.delete(id);
      return res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
}
