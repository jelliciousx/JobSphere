import { Outlet } from "react-router-dom";
import Sidebar from "../../components/admin/Sidebar.jsx";

const AdminDashboard = () => (
  <div className="min-h-screen bg-[#eff7ff]">
    <Sidebar />
    <main className="ml-64 p-8 min-h-screen">
      <Outlet />
    </main>
  </div>
);

export default AdminDashboard;
