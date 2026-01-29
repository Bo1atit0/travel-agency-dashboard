import { Outlet, redirect } from "react-router";
import { SidebarComponent } from "@syncfusion/ej2-react-navigations";
import { MobileSidebar, NavItems } from "components";
import { account } from "~/appwrite/client";
import { getUserData, storeUserData } from "~/appwrite/auth";

export async function clientLoader() {
  try {
    const user = await account.get();
    if (!user.$id) {
      return redirect("/sign-in");
    }

    const userData = await getUserData();
    if (userData?.status !== "admin") {
      return redirect("/");
    }
    if (!userData) {
      const newUser = await storeUserData();
      return newUser;
    }

    return userData;
  } catch (e) {
    console.log("Error in admin-layout clientLoader:", e);
    return redirect("/sign-in");
  }
}

const AdminLayout = () => {
  return (
    <div className="admin-layout">
      <MobileSidebar />
      <aside className="max-w-60 w-full hidden lg:block ">
        <SidebarComponent enableGestures={false} width={250}>
          <NavItems />
        </SidebarComponent>
      </aside>
      <aside className="children">
        <Outlet />
      </aside>
    </div>
  );
};

export default AdminLayout;
