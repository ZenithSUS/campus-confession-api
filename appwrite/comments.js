import { database, appwriteDatabases } from "./index.js";
import { ID, Permission, Query, Role } from "node-appwrite";
import { Like } from "./likes.js";
import { ChildrenComments } from "./children-comments.js";

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

      const likes = new Like();
      const allLikes = await likes.getLikes();

      const childrenComments = new ChildrenComments();
      const allChildrenComments = await childrenComments.getAllChildrenComments(
        id
      );

      allComments.map((comment) => {
        comment.likes =
          allLikes.filter((like) => like.commentId === comment.$id).length || 0;
        comment.childComments =
          allChildrenComments.filter(
            (childrenComment) => childrenComment.comment === comment.$id
          ).length || 0;
      });
      return allComments;
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
