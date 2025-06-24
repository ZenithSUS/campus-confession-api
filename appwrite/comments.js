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
      const childrenComments = new ChildrenComments();

      const [allLikes, allChildrenComments] = await Promise.all([
        likes.getLikes().catch((err) => {
          console.warn("Failed to get likes:", err);
          return [];
        }),

        childrenComments.getAllChildrenComments().catch((err) => {
          console, warn("Failed to get replies:", err);
          return [];
        }),
      ]);

      const processedComments = allComments.map((comments) => {
        if (!comments.$id) return comments;

        const { likes: likesData, replies: repliesData } = allLikes
          .concat(allChildrenComments)
          .reduce(
            (acc, item) => {
              if (item?.commentId?.$id === comments.$id) {
                acc.likes.push(item);
              } else if (item?.comment?.$id === comments.$id) {
                acc.replies.push(item);
              }
              return acc;
            },
            { likes: [], replies: [] }
          );

        return {
          ...comments,
          likesData: likesData,
          repliesData: repliesData,
          likesLength: likesData.length,
          repliesLength: repliesData.length,
        };
      });
      return processedComments;
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
