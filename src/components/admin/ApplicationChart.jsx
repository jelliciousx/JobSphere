import { useEffect, useState } from "react";
import api from "../../services/api.js";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  Calendar,
  ChevronDown,
  TrendingUp,
  Users,
  CheckCircle,
  Clock,
} from "lucide-react";

const ApplicationChart = () => {
  const [period, setPeriod] = useState("yearly"); // yearly | monthly | weekly
  const [chartData, setChartData] = useState([]);
  const [stats, setStats] = useState({
    totalReceived: 0,
    totalApproved: 0,
    totalPending: 0,
    totalRejected: 0,
  });
  const [loading, setLoading] = useState(true);
  const [showDropdown, setShowDropdown] = useState(false);

  const periods = [
    { key: "yearly", label: "Yearly" },
    { key: "monthly", label: "Monthly" },
    { key: "weekly", label: "Weekly" },
  ];

  useEffect(() => {
    fetchAnalytics();
  }, [period]);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const { data } = await api.get(
        `/applications/analytics?period=${period}`,
      );
      setChartData(data.chartData || []);
      setStats(
        data.stats || {
          totalReceived: 0,
          totalApproved: 0,
          totalPending: 0,
          totalRejected: 0,
        },
      );
    } catch (err) {
      console.error("Failed to load analytics", err);
      setChartData([]);
    } finally {
      setLoading(false);
    }
  };

  const handlePeriodChange = (p) => {
    setPeriod(p.key);
    setShowDropdown(false);
  };

  // Fallback colors for bars based on period
  const receivedColor = "#0085ff";
  const approvedColor = "#000000";

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-[1.5rem] p-5 shadow-sm border border-white/60 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-[#0085ff]/10 flex items-center justify-center">
            <Users className="w-6 h-6 text-[#0085ff]" />
          </div>
          <div>
            <p className="text-2xl font-black text-[#000000]">
              {stats.totalReceived}
            </p>
            <p className="text-xs font-bold text-[#000000]/40 uppercase tracking-wider">
              Total Received
            </p>
          </div>
        </div>
        <div className="bg-white rounded-[1.5rem] p-5 shadow-sm border border-white/60 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center">
            <CheckCircle className="w-6 h-6 text-emerald-600" />
          </div>
          <div>
            <p className="text-2xl font-black text-[#000000]">
              {stats.totalApproved}
            </p>
            <p className="text-xs font-bold text-[#000000]/40 uppercase tracking-wider">
              Approved
            </p>
          </div>
        </div>
        <div className="bg-white rounded-[1.5rem] p-5 shadow-sm border border-white/60 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center">
            <Clock className="w-6 h-6 text-amber-600" />
          </div>
          <div>
            <p className="text-2xl font-black text-[#000000]">
              {stats.totalPending}
            </p>
            <p className="text-xs font-bold text-[#000000]/40 uppercase tracking-wider">
              Pending
            </p>
          </div>
        </div>
        <div className="bg-white rounded-[1.5rem] p-5 shadow-sm border border-white/60 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-red-50 flex items-center justify-center">
            <TrendingUp className="w-6 h-6 text-red-500" />
          </div>
          <div>
            <p className="text-2xl font-black text-[#000000]">
              {stats.totalRejected}
            </p>
            <p className="text-xs font-bold text-[#000000]/40 uppercase tracking-wider">
              Rejected
            </p>
          </div>
        </div>
      </div>

      {/* Chart Card */}
      <div className="bg-white rounded-[2rem] sm:rounded-[2.5rem] p-6 sm:p-8 shadow-xl shadow-[#0085ff]/5 border border-white/60 overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
          <div>
            <h3 className="text-xl sm:text-2xl font-black text-[#000000]">
              Application <span className="text-[#0085ff]">Analytics</span>
            </h3>
            <p className="text-xs font-bold text-[#000000]/40 uppercase tracking-wider mt-1">
              {period === "yearly" && "Yearly Application Overview"}
              {period === "monthly" && "Monthly Application Overview"}
              {period === "weekly" && "Weekly Application Overview"}
            </p>
          </div>

          {/* Period Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#0085ff] text-white text-sm font-bold rounded-xl hover:bg-[#006fd6] transition shadow-lg shadow-[#0085ff]/20"
            >
              <Calendar className="w-4 h-4" />
              {periods.find((p) => p.key === period)?.label}
              <ChevronDown
                className={`w-4 h-4 transition-transform ${showDropdown ? "rotate-180" : ""}`}
              />
            </button>

            {showDropdown && (
              <div className="absolute right-0 top-full mt-2 bg-white rounded-xl shadow-xl shadow-[#0085ff]/10 border border-gray-100 overflow-hidden z-50 min-w-[140px]">
                {periods.map((p) => (
                  <button
                    key={p.key}
                    onClick={() => handlePeriodChange(p)}
                    className={`w-full text-left px-4 py-3 text-sm font-semibold transition-all ${
                      period === p.key
                        ? "bg-[#0085ff] text-white"
                        : "text-[#000000]/60 hover:bg-[#eff7ff] hover:text-[#0085ff]"
                    }`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-12 h-12 border-4 border-[#eff7ff] border-t-[#0085ff] rounded-full animate-spin mb-4"></div>
            <p className="text-sm font-bold text-[#000000]/40 uppercase tracking-widest">
              Loading analytics...
            </p>
          </div>
        ) : chartData.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-20 h-20 bg-[#eff7ff] rounded-full flex items-center justify-center mx-auto mb-6">
              <TrendingUp className="w-10 h-10 text-[#0085ff]" />
            </div>
            <h3 className="text-xl font-black text-[#000000]">
              No Data Available
            </h3>
            <p className="text-sm font-semibold text-[#000000]/40 mt-2">
              No applications found for the selected period.
            </p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={320}>
            <BarChart
              data={chartData}
              barGap={6}
              margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="#f0f4f8"
              />
              <XAxis
                dataKey="name"
                axisLine={false}
                tickLine={false}
                tick={{
                  fill: "#000000",
                  fontSize: 12,
                  fontWeight: 600,
                  opacity: 0.4,
                }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{
                  fill: "#000000",
                  fontSize: 12,
                  fontWeight: 600,
                  opacity: 0.4,
                }}
              />
              <Tooltip
                cursor={{ fill: "#eff7ff" }}
                contentStyle={{
                  backgroundColor: "#fff",
                  border: "1px solid #e5e7eb",
                  borderRadius: "12px",
                  boxShadow: "0 4px 20px rgba(0,133,255,0.1)",
                  fontSize: "12px",
                  fontWeight: 600,
                }}
              />
              <Legend
                iconType="circle"
                wrapperStyle={{
                  paddingBottom: 16,
                  fontSize: "12px",
                  fontWeight: 700,
                }}
              />
              <Bar
                dataKey="received"
                fill={receivedColor}
                radius={[6, 6, 0, 0]}
                barSize={18}
                name="Received"
              />
              <Bar
                dataKey="approved"
                fill={approvedColor}
                radius={[6, 6, 0, 0]}
                barSize={18}
                name="Approved"
              />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};

export default ApplicationChart;
