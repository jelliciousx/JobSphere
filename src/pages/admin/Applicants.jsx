import { useEffect, useState } from "react";
import api from "../../services/api.js";
import {
  Phone,
  Mail,
  FileText,
  MapPin,
  Calendar,
  X,
  ChevronDown,
  Download,
} from "lucide-react";

const LinkedInIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
);

const statusStyles = {
  Pending: "bg-gray-100 text-gray-600",
  "In Review": "bg-blue-100 text-blue-600",
  Shortlisted: "bg-purple-100 text-purple-600",
  Approved: "bg-green-100 text-green-600",
  Rejected: "bg-red-100 text-red-600",
  "Pending Docs": "bg-yellow-100 text-yellow-600",
};

const statusOptions = [
  "Pending",
  "In Review",
  "Shortlisted",
  "Approved",
  "Rejected",
  "Pending Docs",
];

const Applicants = () => {
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [detailApplicant, setDetailApplicant] = useState(null);

  useEffect(() => {
    fetchApplicants();
  }, []);

  const fetchApplicants = () => {
    setLoading(true);
    api
      .get("/applications")
      .then((res) => setApplicants(res.data))
      .catch((err) => {
        console.error(err);
        alert("Failed to load applicants");
      })
      .finally(() => setLoading(false));
  };

  const updateStatus = async (id, status) => {
    try {
      await api.put(`/applications/${id}/status`, { status });
      setApplicants((prev) =>
        prev.map((a) => (a._id === id ? { ...a, status } : a)),
      );
    } catch (err) {
      alert("Failed to update status");
    }
  };

  return (
    <div className="py-6">
      <div className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-black text-[#000000]">
          Job <span className="text-[#0085ff]">Applicants</span>
        </h1>
        <p className="text-sm font-bold text-[#000000]/40 mt-2 uppercase tracking-wider">
          Review and manage candidate applications
        </p>
      </div>

      <div className="bg-white rounded-[2.5rem] p-6 sm:p-8 shadow-xl shadow-[#0085ff]/5 border border-white/60 overflow-hidden">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-12 h-12 border-4 border-[#eff7ff] border-t-[#0085ff] rounded-full animate-spin mb-4"></div>
            <p className="text-sm font-bold text-[#000000]/40 uppercase tracking-widest">
              Loading applicants...
            </p>
          </div>
        ) : applicants.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-20 h-20 bg-[#eff7ff] rounded-full flex items-center justify-center mx-auto mb-6">
              <FileText className="w-10 h-10 text-[#0085ff]" />
            </div>
            <h3 className="text-xl font-black text-[#000000]">
              No Applications Yet
            </h3>
            <p className="text-sm font-semibold text-[#000000]/40 mt-2">
              Applications will appear here once candidates start applying.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-[#0085ff] text-white text-left">
                  <th className="px-5 py-4 rounded-tl-xl text-[11px] font-black uppercase tracking-widest">
                    Applicant
                  </th>
                  <th className="px-5 py-4 text-[11px] font-black uppercase tracking-widest">
                    Job Position
                  </th>
                  <th className="px-5 py-4 text-[11px] font-black uppercase tracking-widest">
                    Contact
                  </th>
                  <th className="px-5 py-4 text-[11px] font-black uppercase tracking-widest">
                    Applied
                  </th>
                  <th className="px-5 py-4 rounded-tr-xl text-[11px] font-black uppercase tracking-widest">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {applicants.map((app) => (
                  <tr
                    key={app._id}
                    className="hover:bg-[#eff7ff]/30 transition-colors cursor-pointer"
                    onClick={() => setDetailApplicant(app)}
                  >
                    <td className="px-5 py-5">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden shrink-0">
                          <img
                            src={
                              app.applicant?.avatar ||
                              `https://ui-avatars.com/api/?name=${app.fullName || app.applicant?.name}&background=0D8ABC&color=fff`
                            }
                            alt=""
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <p className="font-bold text-[#000000] text-sm">
                            {app.fullName || app.applicant?.name}
                          </p>
                          <p className="text-xs text-[#000000]/40 font-medium">
                            {app.email || app.applicant?.email}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-5">
                      <p className="font-bold text-[#000000] text-sm">
                        {app.job?.title}
                      </p>
                      <p className="text-xs text-[#000000]/40 font-medium">
                        {app.job?.company}
                      </p>
                      {app.job?.isInternational && (
                        <span className="inline-flex items-center gap-1 mt-1 px-2 py-0.5 rounded-full bg-amber-50 text-amber-600 text-[10px] font-black uppercase tracking-wider">
                          <MapPin className="w-3 h-3" />
                          International
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-5">
                      <div className="space-y-1">
                        {app.phone && (
                          <div className="flex items-center gap-2 text-xs text-[#000000]/60 font-semibold">
                            <Phone className="w-3.5 h-3.5 text-[#0085ff]" />
                            {app.phone}
                          </div>
                        )}
                        {app.linkedin && (
                          <a
                            href={app.linkedin}
                            target="_blank"
                            rel="noreferrer"
                            className="flex items-center gap-2 text-xs text-[#0085ff] font-semibold hover:underline"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <LinkedInIcon className="w-3.5 h-3.5" />
                            LinkedIn
                          </a>
                        )}
                      </div>
                    </td>
                    <td className="px-5 py-5">
                      <div className="flex items-center gap-2 text-xs text-[#000000]/50 font-semibold">
                        <Calendar className="w-3.5 h-3.5 text-[#0085ff]" />
                        {new Date(app.createdAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </div>
                    </td>
                    <td
                      className="px-5 py-5"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="relative">
                        <select
                          value={app.status}
                          onChange={(e) =>
                            updateStatus(app._id, e.target.value)
                          }
                          className={`appearance-none pl-3 pr-8 py-2 rounded-xl text-xs font-black uppercase tracking-wider border-0 outline-none cursor-pointer transition ${statusStyles[app.status]}`}
                        >
                          {statusOptions.map((s) => (
                            <option key={s} value={s}>
                              {s}
                            </option>
                          ))}
                        </select>
                        <ChevronDown className="w-3.5 h-3.5 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none opacity-50" />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {detailApplicant && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
          <div
            className="absolute inset-0 bg-[#000000]/40 backdrop-blur-sm"
            onClick={() => setDetailApplicant(null)}
          />
          <div className="relative bg-white rounded-[2rem] sm:rounded-[3rem] shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-6 sm:p-10 border border-white/60">
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-gray-200 overflow-hidden">
                  <img
                    src={
                      detailApplicant.applicant?.avatar ||
                      `https://ui-avatars.com/api/?name=${detailApplicant.fullName || detailApplicant.applicant?.name}&background=0D8ABC&color=fff`
                    }
                    alt=""
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h3 className="text-xl font-black text-[#000000]">
                    {detailApplicant.fullName ||
                      detailApplicant.applicant?.name}
                  </h3>
                  <p className="text-sm text-[#000000]/40 font-semibold">
                    {detailApplicant.email || detailApplicant.applicant?.email}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setDetailApplicant(null)}
                className="p-2 rounded-xl hover:bg-[#eff7ff] text-[#000000]/40 hover:text-[#0085ff] transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-5">
              <div className="bg-[#eff7ff]/50 rounded-2xl p-4">
                <p className="text-[10px] font-black text-[#000000]/30 uppercase tracking-widest mb-1">
                  Applied For
                </p>
                <p className="text-sm font-bold text-[#000000]">
                  {detailApplicant.job?.title}
                </p>
                <p className="text-xs text-[#000000]/40 font-medium">
                  {detailApplicant.job?.company} —{" "}
                  {detailApplicant.job?.location}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-[#eff7ff]/50 rounded-2xl p-4">
                  <p className="text-[10px] font-black text-[#000000]/30 uppercase tracking-widest mb-1">
                    Phone
                  </p>
                  <p className="text-sm font-bold text-[#000000]">
                    {detailApplicant.phone || "N/A"}
                  </p>
                </div>
                <div className="bg-[#eff7ff]/50 rounded-2xl p-4">
                  <p className="text-[10px] font-black text-[#000000]/30 uppercase tracking-widest mb-1">
                    Passport
                  </p>
                  <p className="text-sm font-bold text-[#000000]">
                    {detailApplicant.passport || "N/A"}
                  </p>
                </div>
              </div>

              {detailApplicant.linkedin && (
                <a
                  href={detailApplicant.linkedin}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-[#0085ff]/10 text-[#0085ff] text-sm font-bold hover:bg-[#0085ff]/20 transition"
                >
                  <LinkedInIcon className="w-5 h-5" />
                  View LinkedIn Profile
                </a>
              )}

              {/* CV / Resume Download Section */}
              {detailApplicant.resume && (
                <div className="bg-amber-50 rounded-2xl p-5 border border-amber-100">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center">
                      <FileText className="w-5 h-5 text-amber-600" />
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-amber-600 uppercase tracking-widest">
                        Resume / CV
                      </p>
                      <p className="text-sm font-bold text-gray-800">
                        Uploaded Document
                      </p>
                    </div>
                  </div>
                  <a
                    href={`http://localhost:5000${detailApplicant.resume}`}
                    target="_blank"
                    rel="noreferrer"
                    download
                    className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-sm font-black uppercase tracking-widest transition-all"
                  >
                    <Download className="w-4 h-4" />
                    Download CV
                  </a>
                </div>
              )}

              <div>
                <p className="text-[10px] font-black text-[#0085ff] uppercase tracking-widest mb-2">
                  Cover Letter
                </p>
                <div className="bg-slate-50 rounded-2xl p-5 text-sm font-semibold text-[#000000]/70 leading-relaxed max-h-48 overflow-y-auto">
                  {detailApplicant.coverLetter || "No cover letter provided."}
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <span
                  className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider ${statusStyles[detailApplicant.status]}`}
                >
                  {detailApplicant.status}
                </span>
                <button
                  onClick={() => setDetailApplicant(null)}
                  className="px-6 py-3 rounded-xl bg-[#0085ff] hover:bg-[#000000] text-white text-[11px] font-black uppercase tracking-widest transition-all"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Applicants;
