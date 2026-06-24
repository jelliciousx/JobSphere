import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
import {
  LayoutDashboard,
  Briefcase,
  List,
  Users,
  MessageSquare,
  LogOut,
} from "lucide-react";
import logo from "../../assets/Logo.png"; // ← Your company logo

const Sidebar = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const menuItems = [
    { path: "/admin", label: "Dashboard", icon: LayoutDashboard },
    { path: "/admin/post-job", label: "Post Job", icon: Briefcase },
    { path: "/admin/jobs", label: "Job Listings", icon: List },
    { path: "/admin/applicants", label: "Applicants", icon: Users },
    { path: "/admin/messages", label: "Admin Messages", icon: MessageSquare },
  ];

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <aside className="w-64 bg-white h-screen fixed left-0 top-0 border-r border-gray-100 flex flex-col shadow-sm z-50">
      {/* Logo Header */}
      <div className="p-6 border-b border-gray-50 flex items-center justify-center">
        <img
          src={logo}
          alt="JobsPher International Recruitment Agency"
          className="h-10 w-auto object-contain"
        />
      </div>

      <nav className="flex-1 px-4 py-6 space-y-1">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === "/admin"}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                isActive
                  ? "bg-blue-600 text-white shadow-md shadow-blue-200"
                  : "text-gray-600 hover:bg-blue-50 hover:text-blue-600"
              }`
            }
          >
            <item.icon size={18} />
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-gray-100">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 transition-colors"
        >
          <LogOut size={18} />
          Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
