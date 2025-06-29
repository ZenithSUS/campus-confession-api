import { ID, Query } from "node-appwrite";
import { database, appwriteDatabases } from "./index.js";

export class ChildrenComments {
  // Get All Children comments
  async getAllChildrenComments() {
    try {
      let allChildrenComments = [];
      let offset = 0;
      const limit = 100;

      while (true) {
        const { documents } = await database.listDocuments(
          appwriteDatabases.database,
          appwriteDatabases["children-comments"],
          [Query.limit(limit), Query.offset(offset)]
        );
        if (documents.length === 0) {
          break;
        }

        allChildrenComments = [...allChildrenComments, ...documents];
        offset += limit;
      }

      return allChildrenComments;
    } catch (error) {
      console.log(error);
    }
  }

  // Get All Children comments base on commentId
  async getAllChildrenCommentsById(commentId) {
    try {
      if (!commentId) {
        throw new Error("Comment ID is required");
      }
      let allChildrenComments = [];
      let offset = 0;
      const limit = 100;

      while (true) {
        const { documents } = await database.listDocuments(
          appwriteDatabases.database,
          appwriteDatabases["children-comments"],
          [
            Query.limit(limit),
            Query.offset(offset),
            Query.equal("comment", commentId),
          ]
        );
        if (documents.length === 0) {
          break;
        }

        allChildrenComments = [...allChildrenComments, ...documents];
        offset += limit;
      }

      return allChildrenComments;
    } catch (error) {
      console.log(error);
    }
  }

  // Create Children Comment
  async createChildrenComment(data) {
    try {
      return await database.createDocument(
        appwriteDatabases.database,
        appwriteDatabases["children-comments"],
        ID.unique(),
        data
      );
    } catch (error) {
      console.log(error);
    }
  }
}
