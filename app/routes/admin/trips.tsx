import { Header } from "components";

const trips = () => {
  return (
    <main className="dashboard wrapper">
      <Header
        title="Trips ✈️"
        description="View and edit AI generated travel itineraries"
        ctaText="Create New Trip"
        ctaUrl="/trips/create"
      />
    </main>
  );
};

export default trips;
