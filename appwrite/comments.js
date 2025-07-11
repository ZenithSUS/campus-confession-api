import { database, appwriteDatabases } from "./index.js";
import { ID, Permission, Query, Role } from "node-appwrite";

export class Comment {
  async create(data) {
    try {
      if (!data && typeof data !== "object") {
        throw new Error("Data is required!");
      }

      // Delete the userId from the data
      const finaldata = { ...data };
      delete finaldata.userId;

      return await database.createDocument(
        appwriteDatabases.database,
        appwriteDatabases.comments,
        ID.unique(),
        finaldata,
        [Permission.read(Role.any()), Permission.write(Role.user(data.userId))]
      );
    } catch (error) {
      console.log(error);
      throw error;
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
          [
            Query.limit(limit),
            Query.offset(offset),
            Query.orderDesc("$createdAt"),
          ]
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
      throw error;
    }
  }

  async getCommentById(id) {
    try {
      let allComments = [];
      let offset = 0;
      const limit = 100;

      while (true) {
        const { documents } = await database.listDocuments(
          appwriteDatabases.database,
          appwriteDatabases.comments,
          [
            Query.limit(limit),
            Query.offset(offset),
            Query.orderDesc("$createdAt"),
            Query.equal("confession", id),
          ]
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
      throw error;
    }
  }

  async getCommentPagination(page, limit = 10) {
    try {
      if ((!page, !limit)) {
        throw new Error("Page and limit are required");
      }

      const offset = (page - 1) * 10;

      const { documents: comments } = await database.listDocuments(
        appwriteDatabases.database,
        appwriteDatabases.comments,
        [
          Query.offset(offset),
          Query.limit(limit),
          Query.orderDesc("$createdAt"),
        ]
      );

      const processedComments = Promise.all(
        comments.map(async (comment) => {
          const likes = await database.listDocuments(
            appwriteDatabases.database,
            appwriteDatabases.likes,
            [Query.equal("commentId", comment.$id)]
          );

          const replies = await database.listDocuments(
            appwriteDatabases.database,
            appwriteDatabases["children-comments"],
            [Query.equal("comment", comment.$id)]
          );

          return {
            ...comment,
            likesData: likes.documents,
            repliesData: replies.documents,
            likesLength: likes.total,
            repliesLength: replies.total,
          };
        })
      );

      return processedComments;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async getCommentsByIdPagination(id, page, limit = 5) {
    try {
      if ((!id, !page, !limit)) {
        throw new Error("Id, Page and limit are required");
      }

      const offset = (page - 1) * limit;

      const { documents: comments } = await database.listDocuments(
        appwriteDatabases.database,
        appwriteDatabases.comments,
        [
          Query.offset(offset),
          Query.limit(limit),
          Query.orderDesc("$createdAt"),
          Query.equal("confession", id),
        ]
      );

      if (comments.length === 0) {
        return [];
      }

      const processedComments = Promise.all(
        comments.map(async (comment) => {
          const likes = await database.listDocuments(
            appwriteDatabases.database,
            appwriteDatabases.likes,
            [Query.equal("commentId", comment.$id)]
          );

          const replies = await database.listDocuments(
            appwriteDatabases.database,
            appwriteDatabases["children-comments"],
            [Query.equal("comment", comment.$id)]
          );

          return {
            ...comment,
            likesData: likes.documents,
            repliesData: replies.documents,
            likesLength: likes.total,
            repliesLength: replies.total,
          };
        })
      );

      return processedComments;
    } catch (error) {
      console.log(error);
      throw error;
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
      throw error;
    }
  }
}
