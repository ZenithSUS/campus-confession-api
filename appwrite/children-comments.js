import { ID, Permission, Query, Role } from "node-appwrite";
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
      throw error;
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
      throw error;
    }
  }

  async getAllChildrenCommentsByIdPagination(commentId, page) {
    try {
      if (!commentId) {
        throw new Error("Comment ID is required");
      }
      const limit = 5;
      const offset = (page - 1) * limit;

      const { documents: childrenComments } = await database.listDocuments(
        appwriteDatabases.database,
        appwriteDatabases["children-comments"],
        [
          Query.limit(limit),
          Query.offset(offset),
          Query.equal("comment", commentId),
        ]
      );

      if (childrenComments.length === 0) return [];

      const processedChildrenComments = Promise.all(
        childrenComments.map(async (childrenComment) => {
          const likes = await database.listDocuments(
            appwriteDatabases.database,
            appwriteDatabases.likes,
            [Query.equal("childrenCommentId", childrenComment.$id)]
          );

          return {
            ...childrenComment,
            likesData: likes.documents,
            likesLength: likes.total,
          };
        })
      );

      return processedChildrenComments;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  // Create Children Comment
  async createChildrenComment(data) {
    try {
      return await database.createDocument(
        appwriteDatabases.database,
        appwriteDatabases["children-comments"],
        ID.unique(),
        data,
        [Permission.read(Role.any()), Permission.write(Role.user(data.userId))]
      );
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}
