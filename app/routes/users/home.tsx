import { Link } from "react-router";

const Home = () => {
  return (
    <main className="flex flex-col items-center ">
      <h1>Welcome to the Travel Agency Home Page</h1>
      <Link to="/sign-in">
        <button className="cursor-pointer py-2 px-4 bg-pink-400 text-white font-semibold rounded-2xl">
          Sign In
        </button>
      </Link>
    </main>
  );
};

export default Home;
