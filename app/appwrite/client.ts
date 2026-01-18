import { Account, Client, Databases, Storage } from "appwrite";

// get access to all appwrite variables from constants file and export them so that they can be used in other files
export const appwriteConfig = {
  endpointUrl: import.meta.env.VITE_APPWRITE_API_ENDPOINT,
  projectId: import.meta.env.VITE_APPWRITE_PROJECT_ID,
  apiKey: import.meta.env.VITE_APPWRITE_API_KEY,
  databaseId: import.meta.env.VITE_APPWRITE_DATABASE_ID,
  userId: import.meta.env.VITE_APPWRITE_USERS_ID,
  tripsId: import.meta.env.VITE_APPWRITE_TRIPS_ID,
};

const client = new Client()
  .setEndpoint(appwriteConfig.endpointUrl)
  .setProject(appwriteConfig.projectId);

const account = new Account(client);
const databases = new Databases(client);
const storage = new Storage(client);

export { client, account, database, storage };
