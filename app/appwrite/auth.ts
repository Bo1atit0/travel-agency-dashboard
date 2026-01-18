import { ID, OAuthProvider, Query } from "appwrite";
import { account, appwriteConfig, databases } from "./client";
import { redirect } from "react-router";

export const storeUserData = async () => {
  try {
    const user = await account.get();
    if (!user) redirect("/sign-in");

    // check if user data already exists in the database
    const { documents } = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.userId,
      [Query.equal("accountId", user.$id)]
    );
    if (documents.length > 0) return documents[0];

    // If user data does not exist, create a new document

    //Get google photo

    //create new document
    const newUser = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.userId,
      ID.unique(),
      {
        name: user.name,
        email: user.email,
        accountId: user.$id,
        // imageUrl:
        joinedAt: new Date().toISOString(),
      }
    );
    return newUser;
  } catch (e) {
    console.log("storeUserData:", e);
  }
};

export const getUserData = async () => {
  try {
    const user = await account.get();
    if (!user) redirect("/sign-in");

    const { documents } = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.userId,
      [
        Query.equal("accountId", user.$id),
        Query.select(["name", "email", "accountId", "imageUrl", "joinedAt"]),
      ]
    );
    if (documents.length === 0) await storeUserData();
    return documents.length > 0 ? documents[0] : redirect("/sign-in");
  } catch (e) {
    console.log("getNewUser:", e);
  }
};

export const loginWithGoogle = async () => {
  try {
    account.createOAuth2Session(
      OAuthProvider.Google,
      "http://localhost:5173/dashboard",
      "http://localhost:5173/sign-in"
    );
    console.log("loginWithGoogle: success");
  } catch (e) {
    console.log("loginWithGoogle:", e);
  }
};
