import { ID, OAuthProvider, Query } from "appwrite";
import { account, appwriteConfig, databases } from "./client";
import { redirect } from "react-router";

export const getGoogleProfilePhoto = async (accessToken: string) => {
  try {
    const res = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    const data = await res.json();
    console.log("Google Profile:", data);
    return data.picture || null;
  } catch (e) {
    console.log("getGoogleProfilePhoto:", e);
    return null;
  }
};

export const storeUserData = async () => {
  try {
    const user = await account.get();
    if (!user) redirect("/sign-in");

    // check if user data already exists in the database
    const { documents } = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.userId,
      [Query.equal("accountId", user.$id)],
    );
    if (documents.length > 0) return documents[0];

    // If user data does not exist, create a new document

    //Get google photo
    const accessToken = await account
      .getSession("current")
      .then((session) => session.providerAccessToken);
    const imageUrl = accessToken
      ? await getGoogleProfilePhoto(accessToken)
      : null;

    //create new document
    const newUser = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.userId,
      ID.unique(),
      {
        name: user.name,
        email: user.email,
        accountId: user.$id,
        imageUrl: imageUrl,
        joinedAt: new Date().toISOString(),
      },
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
      [Query.equal("accountId", user.$id)],
    );
    if (documents.length === 0) await storeUserData();
    return documents.length > 0 ? documents[0] : redirect("/sign-in");
  } catch (e) {
    console.log("getUserData:", e);
  }
};

export const loginWithGoogle = async () => {
  try {
    account.createOAuth2Session(
      OAuthProvider.Google,
      "http://localhost:5173/dashboard",
      "http://localhost:5173/sign-in",
    );
    console.log("loginWithGoogle: success");
  } catch (e) {
    console.log("loginWithGoogle:", e);
  }
};

export const logOutUser = () => {
  try {
    account.deleteSession("current");
    console.log("User logged out successfully");
  } catch (e) {
    console.log("logOutUser:", e);
  }
};

export const getAllUsers = async (limit: number, offset: number) => {
  try {
    const { documents: users, total } = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.userId,
      [Query.limit(limit), Query.offset(offset)],
    );
    if (total === 0) return { users: [], total };
    return { users, total };
  } catch (e) {
    console.log("Error fetching all users:", e);
    return { users: [], total: 0 };
  }
};
