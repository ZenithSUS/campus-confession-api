import { database, appwriteDatabases } from "./index.js";
import { ID, Permission, Query, Role } from "node-appwrite";
import { Like } from "./likes.js";
import { Comment } from "./comments.js";

export class Confession {
  // create confession
  async create(data) {
    try {
      return await database.createDocument(
        appwriteDatabases.database,
        appwriteDatabases.confessions,
        ID.unique(),
        data,
        [Permission.read(Role.any()), Permission.write(Role.user(data.userId))]
      );
    } catch (error) {
      console.log(error);
    }
  }

  // get confession
  async getConfessions(filter = null) {
    try {
      let allConfession = [];
      let offset = 0;
      const limit = 100;

      if (filter) {
        while (true) {
          const { documents } = await database.listDocuments(
            appwriteDatabases.database,
            appwriteDatabases.confessions,
            [
              Query.limit(limit),
              Query.offset(offset),
              Query.contains("campus", filter),
            ]
          );

          if (documents.length === 0) {
            break;
          }

          allConfession = [...allConfession, ...documents];
          offset += limit;
        }
      } else {
        while (true) {
          const { documents } = await database.listDocuments(
            appwriteDatabases.database,
            appwriteDatabases.confessions,
            [Query.limit(limit), Query.offset(offset)]
          );

          if (documents.length === 0) {
            break;
          }

          allConfession = [...allConfession, ...documents];
          offset += limit;
        }
      }

      const likes = new Like();
      const allLikes = await likes.getLikes();

      const comments = new Comment();
      const allComments = await comments.getComments();

      const processedConfessions = allConfession.map((confession) => {
        if (!confession?.$id) return confession;

        const { likes, comments } = allLikes.concat(allComments).reduce(
          (acc, item) => {
            if (item.confessionId?.$id === confession.$id) {
              acc.likes.push(item);
            } else if (item.confession?.$id === confession.$id) {
              acc.comments.push(item);
            }
            return acc;
          },
          { likes: [], comments: [] }
        );

        return {
          ...confession,
          likesData: likes,
          commentsData: comments,
          commentsLength: comments.length,
        };
      });

      return processedConfessions;
    } catch (error) {
      console.log(error);
    }
  }

  // get confession by id
  async getConfessionById(id) {
    try {
      // Validate input
      if (!id) {
        throw new Error("Confession ID is required");
      }

      const confession = await database.getDocument(
        appwriteDatabases.database,
        appwriteDatabases.confessions,
        id
      );

      if (!confession) {
        throw new Error("Confession not found");
      }

      const likes = new Like();
      const comments = new Comment();

      // Get data with error handling
      const [allLikes, allComments] = await Promise.all([
        likes.getLikes().catch((err) => {
          console.warn("Failed to get likes:", err);
          return []; 
        }),
        comments.getComments().catch((err) => {
          console.warn("Failed to get comments:", err);
          return []; 
        }),
      ]);

      const { likes: likesData, comments: commentsData } = allLikes
        .concat(allComments)
        .reduce(
          (acc, item) => {
            try {
              if (item?.confessionId?.$id === confession.$id) {
                acc.likes.push(item);
              } else if (item?.confession?.$id === confession.$id) {
                acc.comments.push(item);
              }
            } catch (itemError) {
              console.warn("Error processing item:", item, itemError);
            }
            return acc;
          },
          { likes: [], comments: [] }
        );

      return {
        ...confession,
        likesData,
        commentsData,
        likesLength: likesData.length,
        commentsLength: commentsData.length,
      };
    } catch (error) {
      console.error("Error in getConfessionById:", error);
      throw error;
    }
  }
}
