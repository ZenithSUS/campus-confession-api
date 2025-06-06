import { database, appwriteDatabases } from "./index.js";
import { ID, Permission, Query, Role } from "node-appwrite";
import { Like } from "./likes.js";

export class Confession extends Like {

  // create confession
  async create(data) {
    try {
      return await database.createDocument(
        appwriteDatabases.database,
        appwriteDatabases.confessions,
        ID.unique(),
        data,
        [Permission.read(Role.any()), Permission.write(Role.user(data.user))]
      );
    } catch (error) {
      console.log(error);
    }
  }

  // get confession
  async getConfessions() {

    try {
      let allConfession = [];
      let offset = 0;
      const limit = 100;

      
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

      const likes = await this.getLikes();
      allConfession.map((confession) => {
        confession.likes = likes.filter((like) => like.confessionId === confession.$id).length;
      });

      return allConfession;
    } catch (error) {
      console.log(error);
    }
  }

  // get confession by id
  async getConfessionById(id) {
    try {
      return await database.getDocument(
        appwriteDatabases.database,
        appwriteDatabases.confessions,
        id
      );
    } catch (error) {
      console.log(error);
    }
  }
}
