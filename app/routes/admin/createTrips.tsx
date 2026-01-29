import { ButtonComponent } from "@syncfusion/ej2-react-buttons";
import { ComboBoxComponent } from "@syncfusion/ej2-react-dropdowns";
import {
  LayerDirective,
  LayersDirective,
  MapsComponent,
} from "@syncfusion/ej2-react-maps";
import { Header } from "components";
import { useState } from "react";
import { useLoaderData } from "react-router";
import { account } from "~/appwrite/client";
import { comboBoxItems, selectItems } from "~/constants";
import { world_map } from "~/constants/world_map";
import { cn, formatKey } from "~/lib/utils";

export const loader = async () => {
  const response = await fetch(
    "https://restcountries.com/v3.1/all?fields=name,flags,latlng,maps",
  );
  const data = await response.json();

  return data.map((country: any) => ({
    name: country.name.common,
    flags: country.flags.svg,
    coordinates: country.latlng,
    maps: country.maps.openStreetMaps,
  }));
};

const itemTemplate = (data: any) => {
  return (
    <div className="flex items-center pl-5">
      <img src={data.flags} alt="Flag" className="size-5" />
      <span className="font-semibold text-lg object-cover ">{data.name}</span>
    </div>
  );
};

const createTrips = () => {
  const countries = useLoaderData() as any;

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState<TripFormData>({
    country: countries[0]?.name || "",
    duration: 0,
    groupType: "",
    travelStyle: "",
    interest: "",
    budget: "",
  });

  const handleChange = (key: keyof TripFormData, value: string | number) => {
    setFormData({ ...formData, [key]: value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // submit form data
    setLoading(true);
    if (
      !formData.country ||
      !formData.duration ||
      !formData.groupType ||
      !formData.travelStyle ||
      !formData.interest ||
      !formData.budget
    ) {
      // show error
      setLoading(false);
      setError("Please provide values for all fields");
      return;
    }
    if (formData.duration <= 0 || formData.duration > 10) {
      setLoading(false);
      setError("Duration must be between 1 and 10 days");
      return;
    }
    const user = await account.get();
    if (!user.$id) {
      console.error("User not authenticated");
      setLoading(false);
      return;
    }
    setError("");
    try {
      console.log("User:", user);
      console.log("Submitting Form Data:", formData);
    } catch (e) {
      console.error("Error creating trip", e);
    } finally {
      setLoading(false);
    }
  };

  const mapData = [
    {
      country: formData.country,
      color: "#EA382E",
      coordinates:
        countries.find((c: Country) => c.name === formData.country)
          ?.coordinates || [],
    },
  ];

  return (
    <main className="wrapper flex flex-col px-10">
      <Header
        title="Create New Trip ✈️"
        description="View and edit AI Generated travel plans"
      />

      <section className="wrapper-md my-10">
        <form className="trip-form" onSubmit={handleSubmit}>
          {/* countries */}
          <div>
            <label htmlFor="countries">Countries</label>
            <ComboBoxComponent
              id="country"
              dataSource={countries}
              itemTemplate={itemTemplate}
              className="combo-box"
              fields={{ text: "name", value: "name" }}
              placeholder="Select A Country"
              change={(e) => {
                if (e.value) {
                  handleChange("country", e.value);
                }
              }}
              allowFiltering
            />
          </div>
          {/* <div>
            <label htmlFor="country">Country</label>
            <ComboBoxComponent
              id="country"
              dataSource={countries}
              itemTemplate={itemTemplate}
              fields={{ value: "name", text: "name" }}
              className="combo-box"
              placeholder="Select a Country"
              change={(e) => {
                if (e.value) {
                  handleChange("country", e.value);
                }
              }}
              allowFiltering
              filtering={(e) => {
                const query = e.text.toLowerCase();

                e.updateData(
                  countries.filter((country: any) =>
                    country.name.toLowerCase().includes(query),
                  ),
                  // .map((country: any) => ({
                  //   value: country.name,
                  //   text: country.name,
                  // })),
                );
              }}
            />
          </div> */}

          {/* duration */}
          <div>
            <label htmlFor="duration">Duration</label>
            <input
              id="duration"
              type="number"
              placeholder="Enter a number of Days"
              onChange={(e) => {
                if (e.target.value) {
                  handleChange("duration", Number(e.target.value));
                }
              }}
              className="form-input placeholder:italic placeholder:text-gray-100"
            />
          </div>
          {/* <div>
            <label htmlFor="duration">Duration</label>
            <input
              type="number"
              id="duration"
              className="form-input placeholder:italic placeholder:text-gray-100"
              placeholder="Enter a Number of Days"
              onChange={(e) => handleChange("duration", Number(e.target.value))}
            />
          </div> */}

          {/* selected Items */}
          {selectItems.map((key) => (
            <div key={key}>
              <label htmlFor={key}>{formatKey(key)}</label>
              <ComboBoxComponent
                className="combo-box"
                id={key}
                dataSource={comboBoxItems[key]}
                // fields={{ text: "key", value: "key" }}
                allowFiltering
                placeholder={`Select your ${formatKey(key)}`}
                change={(e) => {
                  if (e.value) {
                    handleChange(key, e.value);
                  }
                }}
              />
            </div>
          ))}
          {/* {selectItems.map((items) => (
            <div key={items} className="flex flex-col gap-2">
              <label htmlFor={items}>{formatKey(items)}</label>
              <ComboBoxComponent
                className="combo-box"
                id={items}
                dataSource={comboBoxItems[items].map((item) => ({
                  value: item,
                  text: item,
                }))}
                placeholder={`Select ${formatKey(items)}`}
                change={(e) => {
                  if (e.value) {
                    handleChange(items, e.value as string);
                  }
                }}
                allowFiltering
                filtering={(e) => {
                  const query = e.text.toLowerCase();

                  e.updateData(
                    comboBoxItems[items].filter((item) =>
                      item.toLowerCase().includes(query),
                    ),
                    // .map((item: string) => ({
                    //   text: item,
                    //   value: item,
                    // })),
                  );
                }}
              />
            </div>
          ))} */}

          {/* Map */}
          <div>
            <label htmlFor="location">Location on the Map</label>
            <MapsComponent>
              <LayersDirective>
                <LayerDirective
                  shapeData={world_map}
                  dataSource={mapData}
                  shapePropertyPath="name"
                  shapeDataPath="country"
                  shapeSettings={{
                    colorValuePath: "color",
                    fill: "#e5e5e5",
                  }}
                  tooltipSettings={{
                    visible: true,
                    valuePath: "name",
                  }}
                />
              </LayersDirective>
            </MapsComponent>
          </div>

          <div className="bg-gray-300 h-px w-[95%] mx-auto my-2" />
          {/* Error */}
          {error && (
            <div className="error">
              <p>{error}</p>
            </div>
          )}

          <footer className="px-6 w-full">
            <ButtonComponent
              type="submit"
              cssClass="!bg-blue-700 !h-13 !w-full !flex !justify-center !items-center  !px-8 !gap-2"
            >
              <img
                src={
                  loading
                    ? "/assets/icons/loader.svg"
                    : "/assets/icons/magic-star.svg"
                }
                alt={loading ? "Loading-icon" : "Generate Icon"}
                className={cn("size-5", loading && "animate-spin")}
              />
              <span className="p-16-semibold text-white">
                {loading ? "Generating..." : "Generate"}
              </span>
            </ButtonComponent>
          </footer>
        </form>
      </section>
    </main>
  );
};

export default createTrips;
