import { Link, Links, useLocation } from "react-router";
import { cn } from "../app/lib/utils";
import { ButtonComponent } from "@syncfusion/ej2-react-buttons";

interface props {
  title: string;
  description: string;
  ctaText?: string;
  ctaUrl?: string;
}

const Header = ({ title, description, ctaText, ctaUrl }: props) => {
  const location = useLocation();

  return (
    <header className="header">
      <article>
        <h1
          className={cn(
            "font-dark-100 font-semibold text-xl md:text-2xl",
            location.pathname === "/dashboard" && "text-blue-600",
          )}
        >
          {title}
        </h1>
        <p
          className={cn(
            "font-normal text-gray-100 text-sm md:text-lg",
            location.pathname === "/all-users" && "text-blue-600",
          )}
        >
          {description}
        </p>
      </article>

      {ctaText && ctaUrl && (
        <Link to={ctaUrl}>
          <ButtonComponent
            type="button"
            cssClass="!bg-blue-700 !h-13 !w-full !flex !justify-center !items-center  !px-8 !gap-2"
          >
            <img
              src="assets/icons/plus.svg"
              alt="plus sign"
              className="size-5"
            />
            <span className="p-16-semibold text-white">{ctaText}</span>
          </ButtonComponent>
        </Link>
      )}
    </header>
  );
};

export default Header;
