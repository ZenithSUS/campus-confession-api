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

      allConfession.map((confession) => {
        confession.likesData = allLikes.filter(
          (like) => like.confessionId.$id === confession.$id
        );
        confession.commentsData = allComments.filter(
          (comment) => comment.confession.$id === confession.$id
        );
        confession.likesLength =
          allLikes.filter((like) => like.confessionId.$id === confession.$id)
            .length || 0;
        confession.commentsLength =
          allComments.filter(
            (comment) => comment.confession.$id === confession.$id
          ).length || 0;
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

      const allLikes = await likes.getLikes();
      const allComments = await comments.getComments();

      confession.likesData = allLikes.filter(
        (like) => like.confessionId.$id === confession.$id
      );
      confession.commentsData = allComments.filter(
        (comment) => comment.confession.$id === confession.$id
      );
      confession.likesLength =
        allLikes.filter((like) => like.confessionId.$id === confession.$id)
          .length || 0;
      confession.commentsLength =
        allComments.filter(
          (comment) => comment.confession.$id === confession.$id
        ).length || 0;

      return confession;
    } catch (error) {
      console.log(error);
    }
  }
}
