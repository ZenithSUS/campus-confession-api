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
        [Permission.read(Role.any()), Permission.write(Role.user(data.user))]
      );
    } catch (error) {
      console.log(error);
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
    }
  }

  // get like by id
  async getLikeById(id) {
    try {
      return await database.getDocument(
        appwriteDatabases.database,
        appwriteDatabases.likes,
        id
      );
    } catch (error) {
      console.log(error);
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
    }
  }

  // update like
  async update(id) {
    try {
      return await database.updateDocument(
        appwriteDatabases.database,
        appwriteDatabases.likes,
        id
      );
    } catch (error) {
      console.log(error);
    }
  }
}
