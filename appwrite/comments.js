import { database, appwriteDatabases } from "./index.js";
import { ID, Permission, Query, Role } from "node-appwrite";

export class Comment {
  async create(data) {
    try {
      return await database.createDocument(
        appwriteDatabases.database,
        appwriteDatabases.comments,
        ID.unique(),
        data,
        [Permission.read(Role.any()), Permission.write(Role.user(data.user))]
      );
    } catch (error) {
      console.log(error);
    }
  }

  async getComments() {
    try {
      let allComments = [];
      let offset = 0;
      const limit = 100;

      while (true) {
        const { documents } = await database.listDocuments(
          appwriteDatabases.database,
          appwriteDatabases.comments,
          [Query.limit(limit), Query.offset(offset), Query.orderDesc("$createdAt")]
        );

        if (documents.length === 0) {
          break;
        }

        allComments = [...allComments, ...documents];
        offset += limit;
      }

      return allComments;
    } catch (error) {
      console.log(error);
    }
  }

  async getCommentById(id) {
    try {
      return await database.getDocument(
        appwriteDatabases.database,
        appwriteDatabases.comments,
        id
      );
    } catch (error) {
      console.log(error);
    }
  }

  async delete(id) {
    try {
      return await database.deleteDocument(
        appwriteDatabases.database,
        appwriteDatabases.comments,
        id
      );
    } catch (error) {
      console.log(error);
    }
  }
}
