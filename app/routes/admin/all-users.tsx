import { Header } from "components";
import { GridComponent } from "@syncfusion/ej2-react-grids";
// import { usersData } from "~/constants";
import { ColumnDirective, ColumnsDirective } from "@syncfusion/ej2-react-grids";
import { cn, formatDate } from "~/lib/utils";
import { getAllUsers } from "~/appwrite/auth";
import { useLoaderData } from "react-router";

export const clientLoader = async () => {
  const { users, total } = await getAllUsers(10, 0);
  console.log("usersData:", users);
  return { users, total };
};

const AllUsers = () => {
  const { users, total } = useLoaderData();

  return (
    <main className="dashboard wrapper">
      <Header
        title="Manage Users👥"
        description="Filter, sort, and access detailed user profiles"
      />

      <GridComponent dataSource={users} gridLines="None">
        <ColumnsDirective>
          <ColumnDirective
            field="name"
            headerText="Name"
            width="200"
            textAlign="Left"
            template={(Props: UserData) => (
              <div className="flex items-center gap-3">
                <img
                  src={Props.imageUrl}
                  alt="UserImage"
                  className="aspect-square size-12 rounded-full"
                />
                <span>{Props.name}</span>
              </div>
            )}
          />

          {/* Email Column */}
          <ColumnDirective
            field="email"
            headerText="Email"
            width="150"
            textAlign="Left"
          />

          {/* Date Joined Column */}
          <ColumnDirective
            field="joinedAt"
            headerText="Date Joined"
            width="150"
            textAlign="Left"
            template={({ joinedAt }: { joinedAt: string }) =>
              formatDate(joinedAt)
            }
          />

          {/* Trips Created Column */}
          {/* <ColumnDirective
            field="itineraryCreated"
            headerText="Trips Created"
            width="100"
            textAlign="Center"
          /> */}

          {/* Status Column */}
          <ColumnDirective
            field="status"
            headerText="Status"
            width="100"
            textAlign="Left"
            template={({ status }: UserData) => (
              <article
                className={cn(
                  "status-column",
                  status === "admin" ? "bg-light-300" : "bg-success-50",
                )}
              >
                <div
                  className={cn(
                    "size-1.5 rounded-full",
                    status === "admin" ? "bg-red-400" : "bg-green-400",
                  )}
                />
                <h3
                  className={cn(
                    "font-inter text-xs font-medium",
                    status === "admin" ? "text-gray-500" : "text-success-700",
                  )}
                >
                  {status}
                </h3>
              </article>
            )}
          />
        </ColumnsDirective>
      </GridComponent>
    </main>
  );
};

export default AllUsers;
