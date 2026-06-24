import { useEffect, useState } from "react";
import { Users, UserCheck, Clock } from "lucide-react";
import { useAuth } from "../../context/AuthContext.jsx";
import StatsCard from "../../components/admin/StatsCard.jsx";
import ApplicationChart from "../../components/admin/ApplicationChart.jsx";
import RecentApplications from "../../components/admin/RecentApplications.jsx";
import api from "../../services/api.js";

const DashboardHome = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    total: 0,
    shortlisted: 0,
    pending: 0,
    approved: 0,
  });

  useEffect(() => {
    api
      .get("/applications/stats")
      .then((res) => setStats(res.data))
      .catch(console.error);
  }, []);

  // ─── Greeting based on Pakistan (Islamabad) time ───
  const getGreeting = () => {
    const hour = parseInt(
      new Date().toLocaleString("en-US", {
        timeZone: "Asia/Karachi",
        hour: "numeric",
        hour12: false,
      }),
      10,
    );
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-bold text-[#000000]/40 uppercase tracking-wider">
            Hello {user?.name || "Admin"}, {getGreeting()}
          </p>
          <h1 className="text-2xl sm:text-3xl font-black text-[#000000] mt-1">
            Your <span className="text-[#0085ff]">Dashboard</span> is Updated
          </h1>
        </div>
        <div className="flex items-center gap-4">
          {/* ─── ADMIN AVATAR ─── */}
          <div className="w-12 h-12 rounded-full bg-gray-200 overflow-hidden border-2 border-[#0085ff]/20 shadow-md">
            <img
              src={
                user?.avatar ||
                user?.picture ||
                `https://ui-avatars.com/api/?name=${user?.name || "Admin"}&background=0085ff&color=fff`
              }
              alt={user?.name || "Admin"}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.src = `https://ui-avatars.com/api/?name=${user?.name || "Admin"}&background=0085ff&color=fff`;
              }}
            />
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatsCard
          title="Total Applications"
          value={stats.total.toLocaleString()}
          trend="8.5% Up from yesterday"
          trendUp={true}
          icon={Users}
          color="bg-[#0085ff]"
        />
        <StatsCard
          title="Shortlisted"
          value={stats.shortlisted.toLocaleString()}
          trend="1.3% Up from past week"
          trendUp={true}
          icon={UserCheck}
          color="bg-purple-500"
        />
        <StatsCard
          title="Pending Applications"
          value={stats.pending.toLocaleString()}
          trend="4.3% Down from yesterday"
          trendUp={false}
          icon={Clock}
          color="bg-amber-500"
        />
      </div>

      <ApplicationChart />
      <RecentApplications />
    </div>
  );
};

export default DashboardHome;
