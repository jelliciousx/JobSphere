import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api.js";
import {
  Pencil,
  Trash2,
  X,
  MapPin,
  Briefcase,
  DollarSign,
  Globe,
  Clock,
} from "lucide-react";

const JobListings = () => {
  const [jobs, setJobs] = useState([]);
  const [editJob, setEditJob] = useState(null);
  const [form, setForm] = useState({
    title: "",
    company: "",
    location: "",
    type: "Full-time",
    salary: "",
    experience: "",
    skills: "",
    description: "",
    requirements: "",
    isInternational: false,
    status: "active",
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = () => {
    api
      .get("/jobs/admin/all")
      .then((res) => setJobs(res.data))
      .catch(console.error);
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this job?")) return;
    try {
      await api.delete(`/jobs/${id}`);
      setJobs(jobs.filter((j) => j._id !== id));
    } catch (err) {
      alert("Failed to delete job");
    }
  };

  const openEdit = (job) => {
    setEditJob(job);
    setForm({
      title: job.title || "",
      company: job.company || "",
      location: job.location || "",
      type: job.type || "Full-time",
      salary: job.salary || "",
      experience: job.experience || "",
      skills: (job.skills || []).join(", "),
      description: job.description || "",
      requirements: (job.requirements || []).join(", "),
      isInternational: job.isInternational || false,
      status: job.status || "active",
    });
  };

  const closeEdit = () => {
    setEditJob(null);
    setSaving(false);
  };

  const handleFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.put(`/jobs/${editJob._id}`, {
        ...form,
        skills: form.skills
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
        requirements: form.requirements
          .split(",")
          .map((r) => r.trim())
          .filter(Boolean),
      });
      setSaving(false);
      closeEdit();
      fetchJobs();
      alert("Job updated successfully!");
    } catch (err) {
      setSaving(false);
      alert(err.response?.data?.message || "Failed to update job");
    }
  };

  const inputClass =
    "w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-[#0085ff] focus:ring-2 focus:ring-[#0085ff]/10 text-sm font-semibold text-gray-800 placeholder:text-gray-400 transition";

  const labelClass =
    "block text-[11px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1";

  return (
    <div className="py-6">
      <div className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-black text-[#000000]">
          Job <span className="text-[#0085ff]">Listings</span>
        </h1>
        <p className="text-sm font-bold text-[#000000]/40 mt-2 uppercase tracking-wider">
          Manage all posted job opportunities
        </p>
      </div>

      <div className="bg-white rounded-[2.5rem] p-6 sm:p-8 shadow-xl shadow-[#0085ff]/5 border border-white/60 overflow-hidden">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-800">
            {jobs.length} {jobs.length === 1 ? "Job" : "Jobs"}
          </h2>
          <Link
            to="/admin/post-job"
            className="px-6 py-3 bg-[#0085ff] hover:bg-[#000000] text-white rounded-xl text-[11px] font-black uppercase tracking-widest transition-all shadow-lg shadow-[#0085ff]/20 active:scale-95"
          >
            + Post New Job
          </Link>
        </div>

        {jobs.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-20 h-20 bg-[#eff7ff] rounded-full flex items-center justify-center mx-auto mb-6">
              <Briefcase className="w-10 h-10 text-[#0085ff]" />
            </div>
            <h3 className="text-xl font-black text-[#000000]">
              No Jobs Posted
            </h3>
            <p className="text-sm font-semibold text-[#000000]/40 mt-2">
              Create your first job listing to get started.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-[#0085ff] text-white text-left">
                  <th className="px-5 py-4 rounded-tl-xl text-[11px] font-black uppercase tracking-widest">
                    Job Details
                  </th>
                  <th className="px-5 py-4 text-[11px] font-black uppercase tracking-widest">
                    Location
                  </th>
                  <th className="px-5 py-4 text-[11px] font-black uppercase tracking-widest">
                    Type
                  </th>
                  <th className="px-5 py-4 text-[11px] font-black uppercase tracking-widest">
                    Status
                  </th>
                  <th className="px-5 py-4 rounded-tr-xl text-[11px] font-black uppercase tracking-widest text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {jobs.map((job) => (
                  <tr
                    key={job._id}
                    className="hover:bg-[#eff7ff]/30 transition-colors"
                  >
                    <td className="px-5 py-5">
                      <div>
                        <p className="font-bold text-[#000000] text-sm">
                          {job.title}
                        </p>
                        <p className="text-xs text-[#000000]/40 font-medium mt-0.5">
                          {job.company}
                        </p>
                        {job.isInternational && (
                          <span className="inline-flex items-center gap-1 mt-1.5 px-2 py-0.5 rounded-full bg-amber-50 text-amber-600 text-[10px] font-black uppercase tracking-wider">
                            <Globe className="w-3 h-3" />
                            International
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-5 py-5">
                      <div className="flex items-center gap-2 text-sm font-semibold text-[#000000]/60">
                        <MapPin className="w-4 h-4 text-[#0085ff]" />
                        {job.location}
                      </div>
                    </td>
                    <td className="px-5 py-5">
                      <span className="px-3 py-1.5 rounded-lg bg-[#eff7ff] text-[#0085ff] text-[11px] font-bold">
                        {job.type}
                      </span>
                    </td>
                    <td className="px-5 py-5">
                      <span
                        className={`px-3 py-1.5 rounded-full text-[11px] font-black uppercase tracking-wider ${
                          job.status === "active"
                            ? "bg-green-100 text-green-600"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {job.status}
                      </span>
                    </td>
                    <td className="px-5 py-5 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEdit(job)}
                          className="p-2.5 rounded-xl bg-[#eff7ff] hover:bg-[#0085ff]/20 text-[#0085ff] transition-all active:scale-95"
                          title="Edit"
                        >
                          <Pencil size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(job._id)}
                          className="p-2.5 rounded-xl bg-red-50 hover:bg-red-100 text-red-500 transition-all active:scale-95"
                          title="Delete"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ─── Edit Modal ─── */}
      {editJob && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
          <div
            className="absolute inset-0 bg-[#000000]/40 backdrop-blur-sm"
            onClick={closeEdit}
          />
          <div className="relative bg-white rounded-[2rem] sm:rounded-[3rem] shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 sm:p-10 border border-white/60">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-black text-[#000000]">
                  Edit <span className="text-[#0085ff]">Job</span>
                </h2>
                <p className="text-xs text-[#000000]/40 font-bold uppercase tracking-wider mt-1">
                  Update job listing details
                </p>
              </div>
              <button
                onClick={closeEdit}
                className="p-2 rounded-xl hover:bg-[#eff7ff] text-[#000000]/40 hover:text-[#0085ff] transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpdate} className="space-y-5">
              {/* Title */}
              <div>
                <label className={labelClass}>Job Title</label>
                <input
                  name="title"
                  value={form.title}
                  onChange={handleFormChange}
                  className={inputClass}
                  required
                />
              </div>

              {/* Company & Location */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className={labelClass}>Company</label>
                  <input
                    name="company"
                    value={form.company}
                    onChange={handleFormChange}
                    className={inputClass}
                    required
                  />
                </div>
                <div>
                  <label className={labelClass}>Location</label>
                  <input
                    name="location"
                    value={form.location}
                    onChange={handleFormChange}
                    className={inputClass}
                    required
                  />
                </div>
              </div>

              {/* Type / Salary / Experience */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                <div>
                  <label className={labelClass}>Job Type</label>
                  <select
                    name="type"
                    value={form.type}
                    onChange={handleFormChange}
                    className={`${inputClass} cursor-pointer appearance-none`}
                  >
                    <option>Full-time</option>
                    <option>Part-time</option>
                    <option>Contract</option>
                    <option>Remote</option>
                    <option>Internship</option>
                  </select>
                </div>
                <div>
                  <label className={labelClass}>Salary</label>
                  <input
                    name="salary"
                    value={form.salary}
                    onChange={handleFormChange}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>Experience</label>
                  <input
                    name="experience"
                    value={form.experience}
                    onChange={handleFormChange}
                    placeholder="e.g. 3+ years"
                    className={inputClass}
                  />
                </div>
              </div>

              {/* Skills */}
              <div>
                <label className={labelClass}>
                  Skills{" "}
                  <span className="text-gray-400 normal-case lowercase italic ml-1">
                    (comma separated)
                  </span>
                </label>
                <input
                  name="skills"
                  value={form.skills}
                  onChange={handleFormChange}
                  placeholder="React, TypeScript, Node.js"
                  className={inputClass}
                />
              </div>

              {/* International Toggle */}
              <div className="flex items-center gap-4 px-1">
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    name="isInternational"
                    checked={form.isInternational}
                    onChange={handleFormChange}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#0085ff]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#0085ff]"></div>
                </label>
                <span className="text-sm font-bold text-[#000000]/70 select-none flex items-center gap-2">
                  <Globe className="w-4 h-4 text-amber-500" />
                  International Position
                </span>
              </div>

              {/* Description */}
              <div>
                <label className={labelClass}>Description</label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleFormChange}
                  rows={4}
                  className={`${inputClass} resize-none`}
                  required
                />
              </div>

              {/* Requirements */}
              <div>
                <label className={labelClass}>
                  Requirements{" "}
                  <span className="text-gray-400 normal-case lowercase italic ml-1">
                    (comma separated)
                  </span>
                </label>
                <textarea
                  name="requirements"
                  value={form.requirements}
                  onChange={handleFormChange}
                  rows={3}
                  className={`${inputClass} resize-none`}
                />
              </div>

              {/* Status */}
              <div>
                <label className={labelClass}>Status</label>
                <div className="flex gap-3">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="status"
                      value="active"
                      checked={form.status === "active"}
                      onChange={handleFormChange}
                      className="w-4 h-4 text-[#0085ff] focus:ring-[#0085ff]"
                    />
                    <span className="text-sm font-bold text-green-600">
                      Active
                    </span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="status"
                      value="closed"
                      checked={form.status === "closed"}
                      onChange={handleFormChange}
                      className="w-4 h-4 text-gray-400 focus:ring-gray-400"
                    />
                    <span className="text-sm font-bold text-gray-500">
                      Closed
                    </span>
                  </label>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <button
                  type="button"
                  onClick={closeEdit}
                  className="w-full sm:w-auto px-8 py-4 bg-slate-50 hover:bg-slate-100 text-[#000000]/40 text-[11px] font-black uppercase tracking-widest rounded-2xl transition-all active:scale-[0.97]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="w-full sm:flex-1 py-4 bg-[#0085ff] hover:bg-[#000000] text-white text-[11px] font-black uppercase tracking-widest rounded-2xl transition-all shadow-xl shadow-[#0085ff]/20 active:scale-[0.97] disabled:opacity-70"
                >
                  {saving ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobListings;
