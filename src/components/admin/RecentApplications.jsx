import { useEffect, useState } from "react";
import api from "../../services/api.js";
import { Calendar, MapPin, Briefcase, Mail } from "lucide-react";

const statusStyles = {
  Pending: "bg-[#eff7ff] text-[#0085ff]",
  "In Review": "bg-[#0085ff]/10 text-[#0085ff]",
  Shortlisted: "bg-purple-50 text-purple-600",
  Approved: "bg-emerald-50 text-emerald-600",
  Rejected: "bg-red-50 text-red-500",
  "Pending Docs": "bg-amber-50 text-amber-600",
};

const statusOptions = [
  "Pending",
  "In Review",
  "Shortlisted",
  "Approved",
  "Rejected",
  "Pending Docs",
];

const RecentApplications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/applications");
      const sorted = (data || []).sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
      );
      setApplications(sorted);
    } catch (err) {
      console.error("Failed to load applications", err);
      setApplications([]);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await api.put(`/applications/${id}/status`, { status });
      setApplications((prev) =>
        prev.map((app) => (app._id === id ? { ...app, status } : app)),
      );
    } catch (err) {
      alert("Failed to update status");
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleString("en-US", {
      month: "numeric",
      day: "numeric",
      year: "2-digit",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  return (
    <div className="bg-white rounded-[2rem] sm:rounded-[2.5rem] p-6 sm:p-8 shadow-xl shadow-[#0085ff]/5 border border-white/60 overflow-hidden">
      {/* Header */}
      <div className="mb-6">
        <h3 className="text-xl sm:text-2xl font-black text-[#000000]">
          Recent <span className="text-[#0085ff]">Applications</span>
        </h3>
        <p className="text-xs font-bold text-[#000000]/40 uppercase tracking-wider mt-1">
          {applications.length}{" "}
          {applications.length === 1 ? "application" : "applications"} received
        </p>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="w-12 h-12 border-4 border-[#eff7ff] border-t-[#0085ff] rounded-full animate-spin mb-4"></div>
          <p className="text-sm font-bold text-[#000000]/40 uppercase tracking-widest">
            Loading applications...
          </p>
        </div>
      ) : applications.length === 0 ? (
        <div className="text-center py-20">
          <div className="w-20 h-20 bg-[#eff7ff] rounded-full flex items-center justify-center mx-auto mb-6">
            <Briefcase className="w-10 h-10 text-[#0085ff]" />
          </div>
          <h3 className="text-xl font-black text-[#000000]">
            No Applications Yet
          </h3>
          <p className="text-sm font-semibold text-[#000000]/40 mt-2">
            Applications will appear here once candidates start applying.
          </p>
        </div>
      ) : (
        <div className="overflow-x-hidden">
          <table className="w-full text-sm table-fixed">
            <thead>
              <tr className="bg-[#0085ff] text-white text-left">
                <th className="px-4 py-4 rounded-tl-xl text-[11px] font-black uppercase tracking-widest w-[22%]">
                  Applicant
                </th>
                <th className="px-4 py-4 text-[11px] font-black uppercase tracking-widest w-[18%]">
                  Email
                </th>
                <th className="px-4 py-4 text-[11px] font-black uppercase tracking-widest w-[18%]">
                  Job
                </th>
                <th className="px-4 py-4 text-[11px] font-black uppercase tracking-widest w-[14%]">
                  Region
                </th>
                <th className="px-4 py-4 text-[11px] font-black uppercase tracking-widest w-[16%]">
                  Date & Time
                </th>
                <th className="px-4 py-4 rounded-tr-xl text-[11px] font-black uppercase tracking-widest w-[12%]">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {applications.map((app) => (
                <tr
                  key={app._id}
                  className="hover:bg-[#eff7ff]/30 transition-colors"
                >
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-9 h-9 rounded-full bg-gray-200 overflow-hidden shrink-0">
                        <img
                          src={
                            app.applicant?.avatar ||
                            `https://ui-avatars.com/api/?name=${app.fullName || app.applicant?.name || "User"}&background=0D8ABC&color=fff`
                          }
                          alt=""
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="min-w-0">
                        <p className="font-bold text-[#000000] text-sm truncate">
                          {app.fullName || app.applicant?.name || "Unknown"}
                        </p>
                        {app.phone && (
                          <p className="text-[11px] text-[#000000]/40 font-medium truncate">
                            {app.phone}
                          </p>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-2 text-xs text-[#000000]/60 font-semibold min-w-0">
                      <Mail className="w-3.5 h-3.5 text-[#0085ff] shrink-0" />
                      <span className="truncate">
                        {app.email || app.applicant?.email || "N/A"}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-2 min-w-0">
                      <Briefcase className="w-3.5 h-3.5 text-[#0085ff] shrink-0" />
                      <span className="font-bold text-[#000000] text-sm truncate">
                        {app.job?.title || "N/A"}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-2 text-xs text-[#000000]/50 font-semibold min-w-0">
                      <MapPin className="w-3.5 h-3.5 text-[#0085ff] shrink-0" />
                      <span className="truncate">
                        {app.job?.location || app.region || "N/A"}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-2 text-xs text-[#000000]/50 font-semibold whitespace-nowrap">
                      <Calendar className="w-3.5 h-3.5 text-[#0085ff] shrink-0" />
                      {formatDate(app.createdAt)}
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="relative">
                      <select
                        value={app.status}
                        onChange={(e) => updateStatus(app._id, e.target.value)}
                        className={`appearance-none pl-2.5 pr-7 py-1.5 rounded-lg text-[11px] font-black uppercase tracking-wider border-0 outline-none cursor-pointer transition w-full ${statusStyles[app.status]}`}
                      >
                        {statusOptions.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                      <svg
                        className="w-3 h-3 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none opacity-50"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default RecentApplications;
