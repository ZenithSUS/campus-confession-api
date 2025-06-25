import { ID, Query } from "node-appwrite";
import { database, appwriteDatabases } from "./index.js";
import { Like } from "./likes.js";

export class ChildrenComments {
  // Get All Children comments base on commentId
  async getAllChildrenComments(commentId = null) {
    try {
      let allChildrenComments = [];
      let offset = 0;
      const limit = 100;

      while (true) {
        if (commentId) {
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
        } else {
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
      }
      const likes = new Like();
      const allLikes = await likes.getLikes();

      const processedChildrenComments = allChildrenComments.map((comment) => {
        if (!comment.$id) return comment;

        const { likes: likesData } = allLikes.reduce(
          (acc, item) => {
            if (item?.childrenCommentId?.$id === comment.$id) {
              acc.likes.push(item);
            }
            return acc;
          },
          { likes: [] }
        );

        return {
          ...comment,
          likesData: likesData,
          likesLength: likesData.length,
        };
      });

      return processedChildrenComments;
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
