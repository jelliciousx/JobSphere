import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import api from "../services/api.js";
import {
  FiCalendar,
  FiMapPin,
  FiBriefcase,
  FiCheckCircle,
  FiClock,
  FiAlertCircle,
  FiFileText,
  FiArrowRight,
} from "react-icons/fi";

const statusConfig = {
  Pending: {
    color: "bg-yellow-100 text-yellow-700 border-yellow-300",
    icon: FiClock,
  },
  "In Review": {
    color: "bg-blue-100 text-blue-700 border-blue-300",
    icon: FiFileText,
  },
  Shortlisted: {
    color: "bg-purple-100 text-purple-700 border-purple-300",
    icon: FiCheckCircle,
  },
  Approved: {
    color: "bg-green-100 text-green-700 border-green-300",
    icon: FiCheckCircle,
  },
  Rejected: {
    color: "bg-red-100 text-red-700 border-red-300",
    icon: FiAlertCircle,
  },
  "Pending Docs": {
    color: "bg-orange-100 text-orange-700 border-orange-300",
    icon: FiFileText,
  },
};

const Profile = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const { data } = await api.get("/applications/my");
      setApplications(data);
    } catch (err) {
      console.error("Failed to load applications", err);
    } finally {
      setLoading(false);
    }
  };

  const timeAgo = (date) => {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    const intervals = [
      { label: "year", seconds: 31536000 },
      { label: "month", seconds: 2592000 },
      { label: "week", seconds: 604800 },
      { label: "day", seconds: 86400 },
      { label: "hour", seconds: 3600 },
      { label: "minute", seconds: 60 },
    ];
    for (const interval of intervals) {
      const count = Math.floor(seconds / interval.seconds);
      if (count >= 1)
        return `${count} ${interval.label}${count > 1 ? "s" : ""} ago`;
    }
    return "Just now";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f4f9ff] flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-[#eff7ff] border-t-[#0085ff] rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f4f9ff] pb-12">
      {/* Header */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-6">
        <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-r from-[#0085ff] to-blue-600 px-8 py-10 shadow-lg">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
            <div className="relative shrink-0">
              <img
                src={
                  user?.avatar ||
                  `https://ui-avatars.com/api/?name=${user?.name}&background=0D8ABC&color=fff`
                }
                alt={user?.name}
                referrerPolicy="no-referrer"
                className="h-24 w-24 rounded-2xl object-cover border-4 border-white/30 shadow-md"
              />
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="text-3xl font-bold text-white tracking-tight">
                {user?.name || "Applicant"}
              </h1>
              <p className="mt-2 text-blue-100 text-sm">
                Track all your job applications in one place
              </p>
            </div>
            <div className="hidden sm:block">
              <span className="px-4 py-2 rounded-full bg-white/20 text-white text-sm font-semibold backdrop-blur-sm">
                {applications.length}{" "}
                {applications.length === 1 ? "Application" : "Applications"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-8">
        {applications.length === 0 ? (
          /* Empty State */
          <div className="rounded-[2.5rem] bg-white p-12 shadow-sm text-center">
            <div className="w-24 h-24 bg-[#eff7ff] rounded-full flex items-center justify-center mx-auto mb-6">
              <FiBriefcase className="w-12 h-12 text-[#0085ff]" />
            </div>
            <h3 className="text-2xl font-black text-gray-900 mb-3">
              No Applications Yet
            </h3>
            <p className="text-sm text-gray-500 max-w-md mx-auto mb-8 leading-relaxed">
              You haven't applied to any jobs yet. Browse available
              opportunities and submit your first application.
            </p>
            <button
              onClick={() => navigate("/jobs")}
              className="inline-flex items-center gap-2 px-8 py-4 bg-[#0085ff] hover:bg-[#000000] text-white rounded-2xl text-sm font-black uppercase tracking-widest transition-all shadow-xl shadow-[#0085ff]/20 active:scale-95"
            >
              Browse Jobs <FiArrowRight />
            </button>
          </div>
        ) : (
          /* Applications List */
          <div className="space-y-6">
            {applications.map((app, idx) => {
              const status = statusConfig[app.status] || statusConfig.Pending;
              const StatusIcon = status.icon;

              return (
                <div
                  key={app._id}
                  className="rounded-[2rem] bg-white p-6 sm:p-8 shadow-sm border border-gray-100 hover:shadow-md transition-all"
                >
                  {/* Top Row */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-2xl bg-[#eff7ff] flex items-center justify-center shrink-0">
                        <FiBriefcase className="w-7 h-7 text-[#0085ff]" />
                      </div>
                      <div>
                        <h3 className="text-lg font-black text-gray-900">
                          {app.job?.title}
                        </h3>
                        <p className="text-sm text-gray-500 font-medium mt-0.5">
                          {app.job?.company}
                        </p>
                      </div>
                    </div>
                    <div
                      className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-bold ${status.color}`}
                    >
                      <StatusIcon size={16} />
                      {app.status}
                    </div>
                  </div>

                  {/* Details Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                    <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-gray-50">
                      <FiMapPin className="w-5 h-5 text-[#0085ff]" />
                      <div>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-wider">
                          Location
                        </p>
                        <p className="text-sm font-bold text-gray-800">
                          {app.job?.location}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-gray-50">
                      <FiCalendar className="w-5 h-5 text-[#0085ff]" />
                      <div>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-wider">
                          Applied
                        </p>
                        <p className="text-sm font-bold text-gray-800">
                          {timeAgo(app.createdAt)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-gray-50">
                      <FiBriefcase className="w-5 h-5 text-[#0085ff]" />
                      <div>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-wider">
                          Job Type
                        </p>
                        <p className="text-sm font-bold text-gray-800">
                          {app.job?.type}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-gray-50">
                      <FiCheckCircle className="w-5 h-5 text-[#0085ff]" />
                      <div>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-wider">
                          Salary
                        </p>
                        <p className="text-sm font-bold text-gray-800">
                          {app.job?.salary || "Not disclosed"}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Application Details */}
                  <div className="border-t border-gray-100 pt-5">
                    <h4 className="text-[11px] font-black text-[#0085ff] uppercase tracking-widest mb-3">
                      Your Application Details
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="text-gray-400 font-medium">
                          Full Name:
                        </span>
                        <p className="font-semibold text-gray-800 mt-0.5">
                          {app.fullName}
                        </p>
                      </div>
                      <div>
                        <span className="text-gray-400 font-medium">
                          Email:
                        </span>
                        <p className="font-semibold text-gray-800 mt-0.5">
                          {app.email}
                        </p>
                      </div>
                      <div>
                        <span className="text-gray-400 font-medium">
                          Phone:
                        </span>
                        <p className="font-semibold text-gray-800 mt-0.5">
                          {app.phone}
                        </p>
                      </div>
                      {app.passport && (
                        <div>
                          <span className="text-gray-400 font-medium">
                            Passport:
                          </span>
                          <p className="font-semibold text-gray-800 mt-0.5">
                            {app.passport}
                          </p>
                        </div>
                      )}
                      {app.linkedin && (
                        <div className="sm:col-span-2">
                          <span className="text-gray-400 font-medium">
                            LinkedIn:
                          </span>
                          <a
                            href={app.linkedin}
                            target="_blank"
                            rel="noreferrer"
                            className="font-semibold text-[#0085ff] hover:underline mt-0.5 block truncate"
                          >
                            {app.linkedin}
                          </a>
                        </div>
                      )}
                    </div>
                    {app.coverLetter && (
                      <div className="mt-4">
                        <span className="text-gray-400 font-medium text-sm">
                          Cover Letter:
                        </span>
                        <p className="mt-2 text-sm text-gray-600 bg-gray-50 rounded-xl p-4 leading-relaxed">
                          {app.coverLetter}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
