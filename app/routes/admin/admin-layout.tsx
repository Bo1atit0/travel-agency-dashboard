import { Outlet } from "react-router";

const AdminLayout = () => {
  return (
    <div className="p-10">
      <h1 className="admin-layout border">Admin Layout</h1>
      <div className="children border p-4 mt-4">
        <Outlet />
      </div>
    </div>
  );
};

export default AdminLayout;
