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

      const likes = new Like();
      const allLikes = await likes.getLikes();

      const comments = new Comment();
      const allComments = await comments.getComments();

      allConfession.map((confession) => {
        confession.likes =
          allLikes.filter((like) => like.confessionId === confession.$id)
            .length || 0;
        confession.comments =
          allComments.filter((comment) => comment.confession === confession.$id)
            .length || 0;
      });

      return allConfession;
    } catch (error) {
      console.log(error);
    }
  }

  // get confession by id
  async getConfessionById(id) {
    try {
      const confession = await database.getDocument(
        appwriteDatabases.database,
        appwriteDatabases.confessions,
        id
      );

      const likes = new Like();
      const comments = new Comment();

      confession.likes =
        (await likes.getLikes()).filter(
          (like) => like.confessionId === confession.$id
        ).length || 0;
      confession.comments =
        (await comments.getComments()).filter(
          (comment) => comment.confession === confession.$id
        ).length || 0;

      return confession;
    } catch (error) {
      console.log(error);
    }
  }
}
