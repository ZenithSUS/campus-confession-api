import { Client, Databases, Users } from "node-appwrite";
import dotenv from "dotenv";

dotenv.config();

const appwriteConfig = {
  endpoint: process.env.APPWRITE_ENDPOINT,
  projectId: process.env.APPWRITE_PROJECT_ID,
  apiKey: process.env.APPWRITE_API_KEY,
};

const appwriteDatabases = {
  database: process.env.APPWRITE_DATABASE_ID,
  users: process.env.APPWRITE_USERS_COLLECTION_ID,
  confessions: process.env.APPWRITE_CONFESSIONS_COLLECTION_ID,
  comments: process.env.APPWRITE_COMMENTS_COLLECTION_ID,
  likes: process.env.APPWRITE_LIKES_COLLECTION_ID,
  "children-comments": process.env.APPWRITE_CHILDREN_COMMENTS_COLLECTION_ID,
};

const client = new Client();

client
  .setEndpoint(appwriteConfig.endpoint)
  .setProject(appwriteConfig.projectId)
  .setKey(appwriteConfig.apiKey);

export const database = new Databases(client);
export const user = new Users(client);

export { appwriteDatabases };
