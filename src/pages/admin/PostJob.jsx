import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api.js";

const PostJob = () => {
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
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post("/jobs", {
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
      alert("Job posted successfully!");
      navigate("/admin/jobs");
    } catch (err) {
      alert(err.response?.data?.message || "Failed to post job");
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full px-5 py-4 rounded-2xl border border-transparent bg-[#eff7ff]/60 focus:border-[#0085ff] focus:bg-white focus:ring-4 focus:ring-[#0085ff]/10 text-sm font-semibold text-[#000000] placeholder:text-[#000000]/30 outline-none transition";

  const labelClass =
    "block text-[11px] font-black text-[#000000]/40 uppercase tracking-widest mb-2 ml-1";

  return (
    <div className="py-6">
      <div className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-black text-[#000000]">
          Post a <span className="text-[#0085ff]">New Job</span>
        </h1>
        <p className="text-sm font-bold text-[#000000]/40 mt-2 uppercase tracking-wider">
          Create a job listing to find the perfect candidate
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-[2.5rem] p-8 sm:p-10 shadow-xl shadow-[#0085ff]/5 border border-white/60 space-y-6"
      >
        {/* Title */}
        <div>
          <label className={labelClass}>Job Title</label>
          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="e.g. Senior Frontend Developer"
            className={inputClass}
            required
          />
        </div>

        {/* Company & Location */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className={labelClass}>Company</label>
            <input
              name="company"
              value={form.company}
              onChange={handleChange}
              placeholder="e.g. TechNova Solutions"
              className={inputClass}
              required
            />
          </div>
          <div>
            <label className={labelClass}>Location</label>
            <input
              name="location"
              value={form.location}
              onChange={handleChange}
              placeholder="e.g. Remote, Islamabad"
              className={inputClass}
              required
            />
          </div>
        </div>

        {/* Type / Salary / Experience */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div>
            <label className={labelClass}>Job Type</label>
            <select
              name="type"
              value={form.type}
              onChange={handleChange}
              className={`${inputClass} cursor-pointer appearance-none`}
              required
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
              onChange={handleChange}
              placeholder="e.g. PKR 150k - 250k"
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Experience</label>
            <input
              name="experience"
              value={form.experience}
              onChange={handleChange}
              placeholder="e.g. 3+ years"
              className={inputClass}
            />
          </div>
        </div>

        {/* Skills */}
        <div>
          <label className={labelClass}>
            Skills{" "}
            <span className="text-[#000000]/20 normal-case lowercase italic ml-1">
              (comma separated)
            </span>
          </label>
          <input
            name="skills"
            value={form.skills}
            onChange={handleChange}
            placeholder="e.g. React, TypeScript, Tailwind CSS"
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
              onChange={handleChange}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#0085ff]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#0085ff]"></div>
          </label>
          <span className="text-sm font-bold text-[#000000]/70 select-none">
            This is an{" "}
            <span className="text-amber-600 font-black">International</span>{" "}
            position
          </span>
        </div>

        {/* Description */}
        <div>
          <label className={labelClass}>Description</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Describe the role, responsibilities, and what makes this opportunity exciting..."
            rows={5}
            className={`${inputClass} resize-none`}
            required
          />
        </div>

        {/* Requirements */}
        <div>
          <label className={labelClass}>
            Requirements{" "}
            <span className="text-[#000000]/20 normal-case lowercase italic ml-1">
              (comma separated)
            </span>
          </label>
          <textarea
            name="requirements"
            value={form.requirements}
            onChange={handleChange}
            placeholder="e.g. Bachelor's degree in CS, 3+ years React experience, Strong communication skills"
            rows={3}
            className={`${inputClass} resize-none`}
          />
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 pt-4">
          <button
            type="button"
            onClick={() => navigate("/admin/jobs")}
            className="w-full sm:w-auto px-8 py-4 bg-slate-50 hover:bg-slate-100 text-[#000000]/40 text-[11px] font-black uppercase tracking-widest rounded-2xl transition-all active:scale-[0.97]"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="w-full sm:flex-1 py-4 bg-[#0085ff] hover:bg-[#000000] text-white text-[11px] font-black uppercase tracking-widest rounded-2xl transition-all shadow-xl shadow-[#0085ff]/20 active:scale-[0.97] disabled:opacity-70"
          >
            {loading ? "Publishing..." : "Publish Job Listing"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PostJob;
