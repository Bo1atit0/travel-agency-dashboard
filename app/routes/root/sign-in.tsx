import { ButtonComponent } from "@syncfusion/ej2-react-buttons";
import React from "react";
import { Link, redirect } from "react-router";
import { getUserData, loginWithGoogle, storeUserData } from "~/appwrite/auth";
import { account } from "~/appwrite/client";

export async function clientLoader() {
  try {
    const user = await account.get();
    // if user is logged in
    if (user.$id) {
      const userData = await getUserData();
      return userData?.status === "admin"
        ? redirect("/dashboard")
        : redirect("/");
    }
    return null;
  } catch (e) {
    console.log("Error in clientLoader:", e);
    return null;
  }
}

const SignIn = () => {
  return (
    <main className="auth">
      <section className="glassmorphism flex-center size-full px-6">
        <div className="sign-in-card">
          <header className="header ">
            <Link to="/">
              <img src="assets/icons/logo.svg" alt="logo" />
            </Link>
            <h1 className="p-28-bold text-dark-100">Travel Agency</h1>
          </header>
          <article className="flex-center mt-8">
            <h2 className="p-28-semibold text-center text-dark-100">
              Start Your Travel Journey
            </h2>
            <p className="text-center text-gray-100 leading-7 p-18-regular mt-1">
              Sign in with Google to manage destinations, itineraries, and user
              activity with ease
            </p>
          </article>

          <div className="flex items-center justify-center">
            <ButtonComponent
              type="button"
              iconCss="e-search-button"
              cssClass="h-11 w-full  button-class"
              onClick={loginWithGoogle}
            >
              <img
                src="assets/icons/google.svg"
                alt="google"
                className="size-5"
              />
              <span className="p-18-bold text-white">Sign In With Google</span>
            </ButtonComponent>
          </div>
        </div>
      </section>
    </main>
  );
};

export default SignIn;
