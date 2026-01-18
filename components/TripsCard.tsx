import { Link } from "react-router";
import {
  ChipsDirective,
  ChipDirective,
  ChipListComponent,
} from "@syncfusion/ej2-react-buttons";
import { cn, getFirstWord } from "~/lib/utils";

const TripsCard = ({
  id,
  name,
  imageUrl,
  location,
  tags,
  price,
}: TripCardProps) => {
  return (
    <Link to="/" className="trip-card">
      <img src={imageUrl} alt={name} />

      <article>
        <h2>{name}</h2>

        <figure>
          <img
            src="assets/icons/location-mark.svg"
            alt="location"
            className="size-7"
          />
          <figcaption>{location}</figcaption>
        </figure>
      </article>

      <div className="p-4">
        <ChipListComponent id="travel-chip">
          <ChipsDirective>
            {tags.map((tag, index) => (
              <ChipDirective
                key={index}
                text={getFirstWord(tag)}
                cssClass={cn(
                  index === 1
                    ? "!bg-pink-50 !text-pink-500"
                    : "!bg-success-50 !text-success-700"
                )}
              />
            ))}
          </ChipsDirective>
        </ChipListComponent>
      </div>
      <article className="tripCard-pill">{price}</article>
    </Link>
  );
};

export default TripsCard;
