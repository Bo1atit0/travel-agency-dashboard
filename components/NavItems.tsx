import React from "react";
import { Link, NavLink, useLoaderData, useNavigate } from "react-router";
import { logOutUser } from "~/appwrite/auth";
import { sidebarItems } from "~/constants";
import { cn } from "~/lib/utils";

const NavItems = ({ handleClick }: { handleClick?: () => void }) => {
  const user = useLoaderData<User>();
  const navigate = useNavigate();

  return (
    <section className="nav-items">
      <Link to="/" className="link-logo">
        <img src="/assets/icons/logo.svg" alt="logo" className="size-7.5" />
        <h1>Travel Agency</h1>
      </Link>

      <div className="container">
        <nav>
          {sidebarItems.map((item) => (
            <NavLink to={item.href} key={item.id}>
              {({ isActive }: { isActive: boolean }) => (
                <div
                  className={cn("group nav-item", {
                    "bg-primary-100 text-white!": isActive,
                  })}
                  onClick={handleClick}
                >
                  {item.label}
                  <img
                    src={item.icon}
                    alt={item.label}
                    className={`size-5 group-hover:brightness-0 group-hover:invert
                      ${isActive ? "invert brightness-0" : "text-dark-200"}`}
                  />
                </div>
              )}
            </NavLink>
          ))}
        </nav>

        <footer className="nav-footer">
          <img
            src={user?.imageUrl || "/assets/images/david.webp"}
            alt={user?.name || "John Doe"}
          />

          <article>
            <h2>{user?.name}</h2>
            <p>{user?.email}</p>
          </article>

          <button
            className="cursor-pointer"
            onClick={() => {
              logOutUser();
              navigate("/sign-in");
            }}
          >
            <img
              src="assets/icons/logout.svg"
              alt="LogOut"
              className="size-6"
            />
          </button>
        </footer>
      </div>
    </section>
  );
};

export default NavItems;
