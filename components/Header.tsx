import { useLocation } from "react-router";
import { cn } from "../app/lib/utils";

interface props {
  title: string;
  description: string;
}

const Header = ({ title, description }: props) => {
  const location = useLocation();

  return (
    <header className="header">
      <article>
        <h1
          className={cn(
            "font-dark-100 font-semibold text-xl md:text-2xl",
            location.pathname === "/dashboard" && "text-blue-600"
          )}
        >
          {title}
        </h1>
        <p
          className={cn(
            "font-normal text-gray-100 text-sm md:text-lg",
            location.pathname === "/all-users" && "text-blue-600"
          )}
        >
          {description}
        </p>
      </article>
    </header>
  );
};

export default Header;
