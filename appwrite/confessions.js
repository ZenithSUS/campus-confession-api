import { database, appwriteDatabases } from "./index.js";
import { ID, Permission, Query, Role } from "node-appwrite";
import { Like } from "./likes.js";

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
            [
              Query.limit(limit),
              Query.offset(offset),
              Query.orderDesc("$createdAt"),
            ]
          );

          if (documents.length === 0) {
            break;
          }

          allConfession = [...allConfession, ...documents];
          offset += limit;
        }
      }

      return allConfession;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  // get confession by id
  async getConfessionById(id) {
    try {
      // Validate input
      if (!id && typeof id !== "string") {
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

      const comments = await database.listDocuments(
        appwriteDatabases.database,
        appwriteDatabases.comments,
        [Query.equal("confession", confession.$id)]
      );

      const likes = await database.listDocuments(
        appwriteDatabases.database,
        appwriteDatabases.likes,
        [Query.equal("confessionId", confession.$id)]
      );

      // Add comments and likes to confession
      confession.commentsData = comments.documents;
      confession.commentsLength = comments.total;
      confession.likesData = likes.documents;
      confession.likesLength = likes.total;

      return confession;
    } catch (error) {
      console.error("Error in getConfessionById:", error);
      throw error;
    }
  }

  // Get Confessions Pagination
  async getConfessionPagination(page, limit = 5) {
    try {
      if ((!page, !limit)) {
        throw new Error("Page and limit are required");
      }

      const offset = (page - 1) * limit;

      const { documents: confessions } = await database.listDocuments(
        appwriteDatabases.database,
        appwriteDatabases.confessions,
        [
          Query.offset(offset),
          Query.limit(limit),
          Query.orderDesc("$createdAt"),
        ]
      );

      const processedConfessions = Promise.all(
        confessions.map(async (confession) => {
          const comments = await database.listDocuments(
            appwriteDatabases.database,
            appwriteDatabases.comments,
            [Query.equal("confession", confession.$id)]
          );

          const likes = await database.listDocuments(
            appwriteDatabases.database,
            appwriteDatabases.likes,
            [Query.equal("confessionId", confession.$id)]
          );

          return {
            ...confession,
            commentsData: comments.documents,
            likesData: likes.documents,
            likesLength: likes.total,
            commentsLength: comments.total,
          };
        })
      );

      return processedConfessions;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async getTop10ConfessionsByLikes() {
    try {
      const likes = new Like();
      const likesData = await likes.getLikes();

      // Count likes in confession
      const countLikesInConfession = {};

      // Loop through likes
      likesData.forEach((like) => {
        // If confessionId exists
        const id = like.confessionId?.$id;
        if (id) {
          countLikesInConfession[id] = (countLikesInConfession[id] || 0) + 1;
        }
      });

      // Get top 10 by sorting it by the value of the object
      const top10 = Object.entries(countLikesInConfession)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10)
        .map(([confessionId, likesLength]) => ({ confessionId, likesLength }));

      // Loop through top 10 and get confession
      const confessionPromises = top10.map(async (item) => {
        const confession = await database.getDocument(
          appwriteDatabases.database,
          appwriteDatabases.confessions,
          item.confessionId
        );

        const comments = await database.listDocuments(
          appwriteDatabases.database,
          appwriteDatabases.comments,
          [Query.equal("confession", confession.$id)]
        );

        const likes = await database.listDocuments(
          appwriteDatabases.database,
          appwriteDatabases.likes,
          [Query.equal("confessionId", confession.$id)]
        );

        return {
          ...item,
          confession,
          likesData: likes.documents,
          commentsData: comments.documents,
          commentsLength: comments.total,
        };
      });

      // Wait for all confessionPromises to resolve
      const top10WithConfessions = await Promise.all(confessionPromises);

      // Flatten the top10WithConfessions array
      const flattenedTop10WithConfessions = top10WithConfessions.map(
        (item) => ({
          confessionId: item.confessionId,
          likesLength: item.likesLength,
          likesData: item.likesData,
          commentsLength: item.commentsLength,
          commentsData: item.commentsData,
          ...item.confession,
        })
      );

      return flattenedTop10WithConfessions;
    } catch (error) {
      console.error("Error getting top confessions with content:", error);
    }
  }
}
