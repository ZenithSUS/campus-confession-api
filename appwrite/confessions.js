import { database, appwriteDatabases } from "./index.js";
import { ID, Permission, Query, Role } from "node-appwrite";

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

      return confession;
    } catch (error) {
      console.error("Error in getConfessionById:", error);
      throw error;
    }
  }
}
