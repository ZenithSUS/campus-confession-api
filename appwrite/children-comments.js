import { ID, Query } from "node-appwrite";
import { database, appwriteDatabases } from "./index.js";

export class ChildrenComments {
  // Get All Children comments base on commentId
  async getAllChildrenComments(commentId) {
    try {
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
