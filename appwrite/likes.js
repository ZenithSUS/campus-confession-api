import { database, appwriteDatabases } from "./index.js";
import { Permission, ID, Role, Query } from "node-appwrite";

export class Like {
  // create like
  async create(data) {
    try {
      return await database.createDocument(
        appwriteDatabases.database,
        appwriteDatabases.likes,
        ID.unique(),
        data,
        [Permission.read(Role.any()), Permission.write(Role.user(data.userId))]
      );
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  // get likes by confession
  async getLikes() {
    try {
      let allLikes = [];
      let offset = 0;
      const limit = 100;

      while (true) {
        const { documents } = await database.listDocuments(
          appwriteDatabases.database,
          appwriteDatabases.likes,
          [Query.limit(limit), Query.offset(offset)]
        );

        if (documents.length === 0) {
          break;
        }

        allLikes = [...allLikes, ...documents];
        offset += limit;
      }

      return allLikes;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  // get confession like by id
  async getConfessionLikeById(confessionId) {
    try {
      if (!confessionId) {
        throw new Error("Confession ID is required");
      }

      const { documents } = await database.listDocuments(
        appwriteDatabases.database,
        appwriteDatabases.likes,
        [Query.equal("confessionId", confessionId)]
      );
      return documents;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  // get comment like by Id
  async getCommentLikeById(commentId) {
    try {
      if (!commentId) {
        throw new Error("Comment ID is required");
      }

      const { documents } = await database.listDocuments(
        appwriteDatabases.database,
        appwriteDatabases.likes,
        [Query.equal("commentId", commentId)]
      );

      return documents;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async getChildrenCommentLikeById(commentId) {
    try {
      const { documents } = await database.listDocuments(
        appwriteDatabases.database,
        appwriteDatabases.likes,
        [Query.equal("childrenCommentId", commentId)]
      );

      return documents;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  // delete like
  async delete(id) {
    try {
      return await database.deleteDocument(
        appwriteDatabases.database,
        appwriteDatabases.likes,
        id
      );
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  // update like
  async update(id) {
    try {
      if (!id) {
        throw new Error("Like ID is required");
      }

      return await database.updateDocument(
        appwriteDatabases.database,
        appwriteDatabases.likes,
        id
      );
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}
