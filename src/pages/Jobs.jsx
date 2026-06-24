import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api.js";

const JOB_TYPES = [
  "All",
  "Full-time",
  "Part-time",
  "Remote",
  "Contract",
  "Internship",
];
const LOCATIONS = [
  "All",
  "Lahore",
  "Karachi",
  "Islamabad",
  "Rawalpindi",
  "Faisalabad",
  "Remote",
  "Other",
];

const timeAgo = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now - date) / 1000);

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
    if (count >= 1) {
      return `${count} ${interval.label}${count > 1 ? "s" : ""} ago`;
    }
  }
  return "Just now";
};

export default function Jobs() {
  const navigate = useNavigate();

  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState("All");
  const [selectedLocation, setSelectedLocation] = useState("All");
  const [pageLoading, setPageLoading] = useState(true);

  // â”€â”€â”€ DUPLICATE PREVENTION STATE â”€â”€â”€
  const [appliedJobIds, setAppliedJobIds] = useState(new Set());
  const [checkingApplication, setCheckingApplication] = useState(new Set());

  const [selectedJob, setSelectedJob] = useState(null);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [applySuccess, setApplySuccess] = useState(false);
  const [alreadyAppliedError, setAlreadyAppliedError] = useState(false);

  const [applyForm, setApplyForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    passport: "",
    resume: null,
    coverLetter: "",
    linkedin: "",
  });
  const [applyErrors, setApplyErrors] = useState({});
  const [applyLoading, setApplyLoading] = useState(false);

  // â”€â”€â”€ Fetch Jobs from API â”€â”€â”€
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setPageLoading(true);
        const { data } = await api.get("/jobs");
        const formatted = data.map((job) => ({
          ...job,
          id: job._id,
          postedAt: timeAgo(job.createdAt),
          isInternational: job.isInternational || false,
          skills: job.skills || [],
          requirements: job.requirements || [],
        }));
        setJobs(formatted);
      } catch (err) {
        console.error("Failed to load jobs", err);
        setJobs([]);
      } finally {
        setPageLoading(false);
      }
    };
    fetchJobs();
  }, []);

  // â”€â”€â”€ Check which jobs user already applied for â”€â”€â”€
  useEffect(() => {
    const checkAppliedJobs = async () => {
      if (jobs.length === 0) return;

      try {
        // Get user's applications to check which jobs they've applied to
        const { data } = await api.get("/applications/my");
        const appliedIds = new Set(data.map((app) => app.job?._id || app.job));
        setAppliedJobIds(appliedIds);
      } catch (err) {
        // User might not be logged in, that's fine
        console.log("Not checking applied jobs:", err.response?.status);
      }
    };
    checkAppliedJobs();
  }, [jobs]);

  // â”€â”€â”€ Filter Logic â”€â”€â”€
  useEffect(() => {
    let result = jobs;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (j) =>
          j.title.toLowerCase().includes(q) ||
          j.company.toLowerCase().includes(q) ||
          (j.skills || []).some((s) => s.toLowerCase().includes(q)),
      );
    }

    if (selectedType !== "All") {
      result = result.filter((j) => j.type === selectedType);
    }

    if (selectedLocation !== "All") {
      result = result.filter(
        (j) =>
          j.location === selectedLocation ||
          (selectedLocation === "Remote" &&
            j.location.toLowerCase().includes("remote")),
      );
    }

    setFilteredJobs(result);
  }, [searchQuery, selectedType, selectedLocation, jobs]);

  // â”€â”€â”€ Apply Form Handlers â”€â”€â”€
  const handleApplyChange = (e) => {
    const { name, value, files } = e.target;
    setApplyForm((p) => ({
      ...p,
      [name]: files ? files[0] : value,
    }));
    setApplyErrors((p) => ({ ...p, [name]: "" }));
  };

  const validateApply = () => {
    const errs = {};
    if (!applyForm.fullName.trim()) errs.fullName = "Full name is required";
    if (!applyForm.email.trim()) errs.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(applyForm.email))
      errs.email = "Invalid email";
    if (!applyForm.phone.trim()) errs.phone = "Phone number is required";
    // Passport is optional even for international jobs
    if (!applyForm.coverLetter.trim())
      errs.coverLetter = "Cover letter is required";
    if (!applyForm.resume) errs.resume = "Resume/CV is required";
    return errs;
  };

  const handleApplySubmit = async (e) => {
    e.preventDefault();

    // â”€â”€â”€ FRONTEND DUPLICATE CHECK â”€â”€â”€
    if (appliedJobIds.has(selectedJob.id || selectedJob._id)) {
      setAlreadyAppliedError(true);
      setApplyErrors({ general: "You have already applied for this job." });
      return;
    }

    const errs = validateApply();
    if (Object.keys(errs).length > 0) {
      setApplyErrors(errs);
      return;
    }

    setApplyLoading(true);
    setAlreadyAppliedError(false);

    try {
      const formData = new FormData();
      formData.append("job", selectedJob.id || selectedJob._id);
      formData.append("fullName", applyForm.fullName);
      formData.append("email", applyForm.email);
      formData.append("phone", applyForm.phone);
      formData.append("passport", applyForm.passport);
      formData.append("linkedin", applyForm.linkedin);
      formData.append("coverLetter", applyForm.coverLetter);
      formData.append("region", selectedJob.location);

      if (applyForm.resume) {
        formData.append("resume", applyForm.resume);
      }

      const { data } = await api.post("/applications", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      // â”€â”€â”€ Mark job as applied in local state â”€â”€â”€
      setAppliedJobIds(
        (prev) => new Set([...prev, selectedJob.id || selectedJob._id]),
      );

      setApplyLoading(false);
      setApplySuccess(true);

      setTimeout(() => {
        setShowApplyModal(false);
        setApplySuccess(false);
        setApplyForm({
          fullName: "",
          email: "",
          phone: "",
          passport: "",
          resume: null,
          coverLetter: "",
          linkedin: "",
        });
        setSelectedJob(null);
      }, 2000);
    } catch (err) {
      setApplyLoading(false);

      // â”€â”€â”€ HANDLE BACKEND DUPLICATE RESPONSE â”€â”€â”€
      if (err.response?.status === 409) {
        setAlreadyAppliedError(true);
        setApplyErrors({
          general:
            err.response.data.message ||
            "You have already applied for this job.",
        });
        // Mark as applied in local state too
        setAppliedJobIds(
          (prev) => new Set([...prev, selectedJob.id || selectedJob._id]),
        );
      } else if (err.response?.status === 401) {
        alert("Please login first to apply for this job.");
        navigate("/login");
      } else {
        alert(
          err.response?.data?.message ||
            "Failed to submit application. Please try again.",
        );
      }
    }
  };

  // â”€â”€â”€ Helpers â”€â”€â”€
  const openApply = (job) => {
    // â”€â”€â”€ CHECK BEFORE OPENING MODAL â”€â”€â”€
    if (appliedJobIds.has(job.id || job._id)) {
      setAlreadyAppliedError(true);
      setSelectedJob(job);
      setShowApplyModal(true);
      return;
    }

    setSelectedJob(job);
    setShowApplyModal(true);
    setApplySuccess(false);
    setAlreadyAppliedError(false);
    setApplyErrors({});
  };

  const closeApply = () => {
    setShowApplyModal(false);
    setSelectedJob(null);
    setApplyErrors({});
    setApplySuccess(false);
    setAlreadyAppliedError(false);
  };

  const openDetail = (job) => setSelectedJob(job);
  const closeDetail = () => setSelectedJob(null);

  // â”€â”€â”€ Render â”€â”€â”€
  return (
    <div className="min-h-screen bg-[#eff7ff] py-10 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Accents */}
      <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[25%] bg-[#0085ff]/5 rounded-full blur-[100px] -z-0 pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[25%] bg-[#0085ff]/5 rounded-full blur-[100px] -z-0 pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* â”€â”€â”€ Header â”€â”€â”€ */}
        <div className="text-center mb-12">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight">
            <span className="text-[#000000]">Find Your </span>
            <span className="text-[#0085ff]">Dream Job</span>
          </h1>
          <p className="text-[#000000]/40 text-xs sm:text-sm font-bold uppercase tracking-[0.25em] mt-3">
            Browse opportunities posted by top employers
          </p>
        </div>

        {/* â”€â”€â”€ Search & Filters â”€â”€â”€ */}
        <div className="bg-white rounded-[2rem] sm:rounded-[3rem] shadow-xl shadow-[#0085ff]/5 p-6 sm:p-8 mb-10 border border-white/60">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <svg
                className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#0085ff]"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by title, company, or skills..."
                className="w-full pl-12 pr-5 py-4 rounded-2xl bg-[#eff7ff]/60 border border-transparent focus:border-[#0085ff] focus:bg-white focus:ring-4 focus:ring-[#0085ff]/10 text-sm font-semibold text-[#000000] placeholder:text-[#000000]/30 outline-none transition"
              />
            </div>

            {/* Type Filter */}
            <div className="lg:w-48">
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="w-full px-5 py-4 rounded-2xl bg-[#eff7ff]/60 border border-transparent focus:border-[#0085ff] focus:bg-white focus:ring-4 focus:ring-[#0085ff]/10 text-sm font-semibold text-[#000000] outline-none transition cursor-pointer"
              >
                {JOB_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {t === "All" ? "All Job Types" : t}
                  </option>
                ))}
              </select>
            </div>

            {/* Location Filter */}
            <div className="lg:w-48">
              <select
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                className="w-full px-5 py-4 rounded-2xl bg-[#eff7ff]/60 border border-transparent focus:border-[#0085ff] focus:bg-white focus:ring-4 focus:ring-[#0085ff]/10 text-sm font-semibold text-[#000000] outline-none transition cursor-pointer"
              >
                {LOCATIONS.map((l) => (
                  <option key={l} value={l}>
                    {l === "All" ? "All Locations" : l}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Active Filters */}
          <div className="flex flex-wrap gap-2 mt-4">
            {!pageLoading && jobs.length > 0 && (
              <span className="text-xs font-bold text-[#000000]/40 uppercase tracking-wider">
                {filteredJobs.length}{" "}
                {filteredJobs.length === 1 ? "job" : "jobs"} found
              </span>
            )}
          </div>
        </div>

        {/* â”€â”€â”€ Content States â”€â”€â”€ */}
        {pageLoading ? (
          <div className="flex flex-col items-center justify-center py-24">
            <div className="w-16 h-16 border-4 border-[#eff7ff] border-t-[#0085ff] rounded-full animate-spin mb-6"></div>
            <p className="text-sm font-bold text-[#000000]/40 uppercase tracking-widest">
              Loading opportunities...
            </p>
          </div>
        ) : jobs.length === 0 ? (
          <div className="text-center py-24">
            <div className="w-24 h-24 bg-[#eff7ff] rounded-full flex items-center justify-center mx-auto mb-8">
              <svg
                className="w-12 h-12 text-[#0085ff]"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M20 7H4a2 2 0 00-2 2v10a2 2 0 002 2h16a2 2 0 002-2V9a2 2 0 00-2-2z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M16 11V7a4 4 0 00-8 0v4"
                />
              </svg>
            </div>
            <h3 className="text-2xl sm:text-3xl font-black text-[#000000] mb-3">
              No Jobs Available Yet
            </h3>
            <p className="text-sm font-semibold text-[#000000]/40 max-w-md mx-auto leading-relaxed">
              New opportunities are added regularly. Please check back soon to
              find your dream job.
            </p>
          </div>
        ) : filteredJobs.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-20 h-20 bg-[#eff7ff] rounded-full flex items-center justify-center mx-auto mb-6">
              <svg
                className="w-10 h-10 text-[#0085ff]"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-black text-[#000000]">No jobs found</h3>
            <p className="text-sm text-[#000000]/40 font-semibold mt-2">
              Try adjusting your search or filters
            </p>
          </div>
        ) : (
          /* â”€â”€â”€ Job Cards Grid â”€â”€â”€ */
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredJobs.map((job) => {
              const isApplied = appliedJobIds.has(job.id || job._id);

              return (
                <div
                  key={job.id}
                  className={`group bg-white rounded-[2rem] sm:rounded-[2.5rem] p-6 sm:p-8 shadow-lg transition-all duration-300 border border-white/60 ${
                    isApplied ? "opacity-75" : "hover:shadow-xl cursor-pointer"
                  }`}
                >
                  {/* Job Card Content */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 bg-[#eff7ff] rounded-xl flex items-center justify-center text-[#0085ff] font-black text-lg">
                      {job.company?.charAt(0)?.toUpperCase() || "J"}
                    </div>
                    <div className="flex items-center gap-2">
                      {isApplied && (
                        <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full flex items-center gap-1">
                          <svg
                            className="w-3 h-3"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="3"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                          Applied
                        </span>
                      )}
                      <span className="text-xs font-bold text-[#0085ff] bg-[#eff7ff] px-3 py-1 rounded-full">
                        {job.type}
                      </span>
                    </div>
                  </div>

                  <h3 className="text-lg font-black text-[#000000] mb-1 line-clamp-1">
                    {job.title}
                  </h3>
                  <p className="text-sm font-semibold text-[#000000]/40 mb-4">
                    {job.company}
                  </p>

                  <div className="flex items-center gap-4 text-xs font-semibold text-[#000000]/40 mb-4">
                    <span className="flex items-center gap-1">
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                      {job.location}
                    </span>
                    <span className="flex items-center gap-1">
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      {job.postedAt}
                    </span>
                  </div>

                  {job.skills?.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-6">
                      {job.skills.slice(0, 3).map((skill, idx) => (
                        <span
                          key={idx}
                          className="text-xs font-semibold text-[#0085ff] bg-[#eff7ff] px-2.5 py-1 rounded-lg"
                        >
                          {skill}
                        </span>
                      ))}
                      {job.skills.length > 3 && (
                        <span className="text-xs font-semibold text-[#000000]/30 px-2 py-1">
                          +{job.skills.length - 3}
                        </span>
                      )}
                    </div>
                  )}

                  <div className="flex gap-3 mt-auto">
                    <button
                      onClick={() => openDetail(job)}
                      className="flex-1 py-3 rounded-xl text-sm font-bold text-[#0085ff] bg-[#eff7ff] hover:bg-[#0085ff]/10 transition"
                    >
                      View Details
                    </button>
                    <button
                      onClick={() => (isApplied ? null : openApply(job))}
                      disabled={isApplied}
                      className={`flex-1 py-3 rounded-xl text-sm font-bold transition shadow-lg ${
                        isApplied
                          ? "bg-gray-100 text-gray-400 cursor-not-allowed shadow-none"
                          : "text-white bg-[#0085ff] hover:bg-[#006fd6] shadow-[#0085ff]/20"
                      }`}
                    >
                      {isApplied ? (
                        <span className="flex items-center justify-center gap-1.5">
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.5"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                          Already Applied
                        </span>
                      ) : (
                        "Apply Now"
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* â”€â”€â”€ Job Detail Modal â”€â”€â”€ */}
        {selectedJob && !showApplyModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
            <div className="bg-white rounded-[2rem] max-w-2xl w-full max-h-[90vh] overflow-y-auto p-8 shadow-2xl">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-black text-[#000000]">
                    {selectedJob.title}
                  </h2>
                  <p className="text-sm font-semibold text-[#000000]/40 mt-1">
                    {selectedJob.company} â€¢ {selectedJob.location}
                  </p>
                </div>
                <button
                  onClick={closeDetail}
                  className="w-10 h-10 rounded-full bg-[#eff7ff] flex items-center justify-center text-[#000000]/40 hover:text-[#000000] transition"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              <div className="space-y-6">
                <div className="flex flex-wrap gap-2">
                  <span className="text-xs font-bold text-[#0085ff] bg-[#eff7ff] px-3 py-1.5 rounded-full">
                    {selectedJob.type}
                  </span>
                  {selectedJob.isInternational && (
                    <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-full">
                      International
                    </span>
                  )}
                  {appliedJobIds.has(selectedJob.id || selectedJob._id) && (
                    <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-full flex items-center gap-1">
                      <svg
                        className="w-3 h-3"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      You have applied
                    </span>
                  )}
                </div>

                <div>
                  <h4 className="text-sm font-black text-[#000000] uppercase tracking-wider mb-2">
                    Description
                  </h4>
                  <p className="text-sm font-semibold text-[#000000]/60 leading-relaxed">
                    {selectedJob.description}
                  </p>
                </div>

                {selectedJob.requirements?.length > 0 && (
                  <div>
                    <h4 className="text-sm font-black text-[#000000] uppercase tracking-wider mb-2">
                      Requirements
                    </h4>
                    <ul className="space-y-2">
                      {selectedJob.requirements.map((req, idx) => (
                        <li
                          key={idx}
                          className="text-sm font-semibold text-[#000000]/60 flex items-start gap-2"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-[#0085ff] mt-2 shrink-0" />
                          {req}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {selectedJob.skills?.length > 0 && (
                  <div>
                    <h4 className="text-sm font-black text-[#000000] uppercase tracking-wider mb-2">
                      Skills
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedJob.skills.map((skill, idx) => (
                        <span
                          key={idx}
                          className="text-xs font-semibold text-[#0085ff] bg-[#eff7ff] px-3 py-1.5 rounded-lg"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="pt-4 flex gap-3">
                  <button
                    onClick={closeDetail}
                    className="flex-1 py-3.5 rounded-xl text-sm font-bold text-[#000000]/40 bg-[#eff7ff] hover:bg-[#000000]/5 transition"
                  >
                    Close
                  </button>
                  <button
                    onClick={() => {
                      if (
                        !appliedJobIds.has(selectedJob.id || selectedJob._id)
                      ) {
                        closeDetail();
                        openApply(selectedJob);
                      }
                    }}
                    disabled={appliedJobIds.has(
                      selectedJob.id || selectedJob._id,
                    )}
                    className={`flex-1 py-3.5 rounded-xl text-sm font-bold transition shadow-lg ${
                      appliedJobIds.has(selectedJob.id || selectedJob._id)
                        ? "bg-gray-100 text-gray-400 cursor-not-allowed shadow-none"
                        : "text-white bg-[#0085ff] hover:bg-[#006fd6] shadow-[#0085ff]/20"
                    }`}
                  >
                    {appliedJobIds.has(selectedJob.id || selectedJob._id)
                      ? "Already Applied"
                      : "Apply Now"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* â”€â”€â”€ Apply Modal â”€â”€â”€ */}
        {showApplyModal && selectedJob && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
            <div className="bg-white rounded-[2rem] max-w-lg w-full max-h-[90vh] overflow-y-auto p-8 shadow-2xl">
              {applySuccess ? (
                <div className="text-center py-12">
                  <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg
                      className="w-10 h-10 text-emerald-500"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-black text-[#000000] mb-2">
                    Application Submitted!
                  </h3>
                  <p className="text-sm font-semibold text-[#000000]/40">
                    Good luck with your application.
                  </p>
                </div>
              ) : alreadyAppliedError ? (
                <div className="text-center py-12">
                  <div className="w-20 h-20 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg
                      className="w-10 h-10 text-amber-500"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 9v2m0 4h.01M12 8a4 4 0 100 8 4 4 0 000-8z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-black text-[#000000] mb-2">
                    Already Applied
                  </h3>
                  <p className="text-sm font-semibold text-[#000000]/40 mb-6">
                    You have already applied for this job. You can only apply
                    once per position.
                  </p>
                  <button
                    onClick={closeApply}
                    className="px-6 py-3 rounded-xl text-sm font-bold text-white bg-[#0085ff] hover:bg-[#006fd6] transition"
                  >
                    Close
                  </button>
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h3 className="text-xl font-black text-[#000000]">
                        Apply for {selectedJob.title}
                      </h3>
                      <p className="text-xs font-semibold text-[#000000]/40 mt-1">
                        {selectedJob.company}
                      </p>
                    </div>
                    <button
                      onClick={closeApply}
                      className="w-10 h-10 rounded-full bg-[#eff7ff] flex items-center justify-center text-[#000000]/40 hover:text-[#000000] transition"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </div>

                  {/* Duplicate Error Banner */}
                  {applyErrors.general && (
                    <div className="mb-4 p-4 rounded-xl bg-amber-50 border border-amber-100 flex items-center gap-3">
                      <svg
                        className="w-5 h-5 text-amber-500 shrink-0"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M12 9v2m0 4h.01M12 8a4 4 0 100 8 4 4 0 000-8z"
                        />
                      </svg>
                      <p className="text-sm font-semibold text-amber-700">
                        {applyErrors.general}
                      </p>
                    </div>
                  )}

                  <form onSubmit={handleApplySubmit} className="space-y-4">
                    <div>
                      <label className="block text-xs font-black text-[#000000] uppercase tracking-wider mb-1.5">
                        Full Name
                      </label>
                      <input
                        type="text"
                        name="fullName"
                        value={applyForm.fullName}
                        onChange={handleApplyChange}
                        className="w-full px-4 py-3 rounded-xl bg-[#eff7ff]/60 border border-transparent focus:border-[#0085ff] focus:bg-white focus:ring-4 focus:ring-[#0085ff]/10 text-sm font-semibold outline-none transition"
                        placeholder="John Doe"
                      />
                      {applyErrors.fullName && (
                        <p className="text-xs font-semibold text-red-500 mt-1">
                          {applyErrors.fullName}
                        </p>
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-black text-[#000000] uppercase tracking-wider mb-1.5">
                          Email
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={applyForm.email}
                          onChange={handleApplyChange}
                          className="w-full px-4 py-3 rounded-xl bg-[#eff7ff]/60 border border-transparent focus:border-[#0085ff] focus:bg-white focus:ring-4 focus:ring-[#0085ff]/10 text-sm font-semibold outline-none transition"
                          placeholder="john@example.com"
                        />
                        {applyErrors.email && (
                          <p className="text-xs font-semibold text-red-500 mt-1">
                            {applyErrors.email}
                          </p>
                        )}
                      </div>
                      <div>
                        <label className="block text-xs font-black text-[#000000] uppercase tracking-wider mb-1.5">
                          Phone
                        </label>
                        <input
                          type="tel"
                          name="phone"
                          value={applyForm.phone}
                          onChange={handleApplyChange}
                          className="w-full px-4 py-3 rounded-xl bg-[#eff7ff]/60 border border-transparent focus:border-[#0085ff] focus:bg-white focus:ring-4 focus:ring-[#0085ff]/10 text-sm font-semibold outline-none transition"
                          placeholder="+92 300 1234567"
                        />
                        {applyErrors.phone && (
                          <p className="text-xs font-semibold text-red-500 mt-1">
                            {applyErrors.phone}
                          </p>
                        )}
                      </div>
                    </div>

                    {selectedJob.isInternational && (
                      <div>
                        <label className="block text-xs font-black text-[#000000] uppercase tracking-wider mb-1.5">
                          Passport Number{" "}
                          <span className="text-[#000000]/30 font-semibold normal-case">
                            (Optional)
                          </span>
                        </label>
                        <input
                          type="text"
                          name="passport"
                          value={applyForm.passport}
                          onChange={handleApplyChange}
                          className="w-full px-4 py-3 rounded-xl bg-[#eff7ff]/60 border border-transparent focus:border-[#0085ff] focus:bg-white focus:ring-4 focus:ring-[#0085ff]/10 text-sm font-semibold outline-none transition"
                          placeholder="Optional - enter if available"
                        />
                        {applyErrors.passport && (
                          <p className="text-xs font-semibold text-red-500 mt-1">
                            {applyErrors.passport}
                          </p>
                        )}
                      </div>
                    )}

                    <div>
                      <label className="block text-xs font-black text-[#000000] uppercase tracking-wider mb-1.5">
                        LinkedIn (Optional)
                      </label>
                      <input
                        type="url"
                        name="linkedin"
                        value={applyForm.linkedin}
                        onChange={handleApplyChange}
                        className="w-full px-4 py-3 rounded-xl bg-[#eff7ff]/60 border border-transparent focus:border-[#0085ff] focus:bg-white focus:ring-4 focus:ring-[#0085ff]/10 text-sm font-semibold outline-none transition"
                        placeholder="https://linkedin.com/in/johndoe"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-black text-[#000000] uppercase tracking-wider mb-1.5">
                        Resume
                      </label>
                      <input
                        type="file"
                        name="resume"
                        required
                        accept=".pdf,.doc,.docx"
                        onChange={handleApplyChange}
                        className="w-full px-4 py-3 rounded-xl bg-[#eff7ff]/60 border border-transparent focus:border-[#0085ff] focus:bg-white focus:ring-4 focus:ring-[#0085ff]/10 text-sm font-semibold outline-none transition file:mr-4 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-[#0085ff] file:text-white hover:file:bg-[#006fd6]"
                      />
                      {applyErrors.resume && (
                        <p className="text-xs font-semibold text-red-500 mt-1">
                          {applyErrors.resume}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-black text-[#000000] uppercase tracking-wider mb-1.5">
                        Cover Letter
                      </label>
                      <textarea
                        name="coverLetter"
                        value={applyForm.coverLetter}
                        onChange={handleApplyChange}
                        rows={4}
                        className="w-full px-4 py-3 rounded-xl bg-[#eff7ff]/60 border border-transparent focus:border-[#0085ff] focus:bg-white focus:ring-4 focus:ring-[#0085ff]/10 text-sm font-semibold outline-none transition resize-none"
                        placeholder="Tell us why you're a great fit..."
                      />
                      {applyErrors.coverLetter && (
                        <p className="text-xs font-semibold text-red-500 mt-1">
                          {applyErrors.coverLetter}
                        </p>
                      )}
                    </div>

                    <button
                      type="submit"
                      disabled={applyLoading}
                      className="w-full py-4 rounded-xl text-sm font-bold text-white bg-[#0085ff] hover:bg-[#006fd6] transition shadow-lg shadow-[#0085ff]/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {applyLoading ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          Submitting...
                        </>
                      ) : (
                        "Submit Application"
                      )}
                    </button>
                  </form>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
