import { database, appwriteDatabases } from "./index.js";
import { Permission, Query, Role } from "node-appwrite";

export class User {
  // create user
  async create(data) {
    try {
      if (!data && typeof data !== "object") {
        throw new Error("User data is required");
      }

      return await database.createDocument(
        appwriteDatabases.database,
        appwriteDatabases.users,
        data.$id,
        data,
        [Permission.read(Role.any()), Permission.write(Role.user(data.$id))]
      );
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  // delete user
  async delete(id) {
    try {
      if (!id) {
        throw new Error("User ID is required");
      }
      return await database.deleteDocument(
        appwriteDatabases.database,
        appwriteDatabases.users,
        id
      );
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  // get all users
  async getAllUsers() {
    try {
      let allUsers = [];
      let offset = 0;
      const limit = 100;

      while (true) {
        const { documents } = await database.listDocuments(
          appwriteDatabases.database,
          appwriteDatabases.users,
          [Query.limit(limit), Query.offset(offset)]
        );

        if (documents.length === 0) {
          break;
        }

        allUsers = [...allUsers, ...documents];
        offset += limit;
      }

      return allUsers;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}
