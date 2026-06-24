import { useEffect, useState } from "react";
import api from "../../services/api.js";
import {
  Send,
  Mail,
  User,
  Phone,
  Calendar,
  Search,
  MessageSquare,
  Briefcase,
  X,
  ChevronDown,
  Inbox,
  Users,
  PenLine,
  ArrowLeft,
} from "lucide-react";

const typeStyles = {
  "Contact Form": "bg-[#0085ff]/10 text-[#0085ff]",
  Applicant: "bg-emerald-50 text-emerald-600",
};

const typeIcons = {
  "Contact Form": MessageSquare,
  Applicant: Briefcase,
};

const AdminMessages = () => {
  const [activeTab, setActiveTab] = useState("inbox"); // inbox | applicants | compose
  const [messages, setMessages] = useState([]);
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("All");

  // Message detail view
  const [viewingMessage, setViewingMessage] = useState(null);

  // Compose form state
  const [composeForm, setComposeForm] = useState({
    to: "",
    toName: "",
    subject: "",
    body: "",
  });
  const [composeLoading, setComposeLoading] = useState(false);
  const [composeSuccess, setComposeSuccess] = useState(false);
  const [selectedRecipient, setSelectedRecipient] = useState(null);
  const [showRecipientDropdown, setShowRecipientDropdown] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [msgRes, appRes] = await Promise.all([
        api.get("/messages").catch(() => ({ data: [] })),
        api.get("/applications").catch(() => ({ data: [] })),
      ]);

      // Tag contact messages
      const contacts = (msgRes.data || []).map((m) => ({
        ...m,
        _type: "Contact Form",
        _displayName: m.name || m.sender?.name || "Unknown",
        _displayEmail: m.email || m.sender?.email || "",
        _displayPhone: m.phone || "",
        _preview: m.body || m.message || "",
        _date: m.createdAt,
      }));

      // Tag applicants
      const apps = (appRes.data || []).map((a) => ({
        ...a,
        _type: "Applicant",
        _displayName: a.fullName || a.applicant?.name || "Unknown",
        _displayEmail: a.email || a.applicant?.email || "",
        _displayPhone: a.phone || "",
        _preview: `Applied for: ${a.job?.title || "Unknown Job"} at ${a.job?.company || ""}`,
        _date: a.createdAt,
        _jobTitle: a.job?.title,
        _jobCompany: a.job?.company,
        _status: a.status,
      }));

      setMessages(contacts);
      setApplicants(apps);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const allRecipients = [
    ...messages.map((m) => ({
      id: m._id + "-contact",
      name: m._displayName,
      email: m._displayEmail,
      phone: m._displayPhone,
      type: "Contact Form",
      original: m,
    })),
    ...applicants.map((a) => ({
      id: a._id + "-applicant",
      name: a._displayName,
      email: a._displayEmail,
      phone: a._displayPhone,
      type: "Applicant",
      original: a,
      jobTitle: a._jobTitle,
      status: a._status,
    })),
  ];

  // Inbox: only contact form messages
  const inboxMessages = messages
    .filter((m) => {
      if (filterType !== "All" && m._type !== filterType) return false;
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      return (
        m._displayName?.toLowerCase().includes(q) ||
        m._displayEmail?.toLowerCase().includes(q) ||
        m._preview?.toLowerCase().includes(q) ||
        (m.subject && m.subject.toLowerCase().includes(q))
      );
    })
    .sort((a, b) => new Date(b._date) - new Date(a._date));

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setViewingMessage(null);
  };

  const handleSelectRecipient = (recipient) => {
    setSelectedRecipient(recipient);
    setComposeForm((p) => ({
      ...p,
      to: recipient.email,
      toName: recipient.name,
    }));
    setShowRecipientDropdown(false);
  };

  const handleComposeChange = (e) => {
    const { name, value } = e.target;
    setComposeForm((p) => ({ ...p, [name]: value }));
    setComposeSuccess(false);
  };

  const handleSendEmail = async (e) => {
    e.preventDefault();
    if (
      !composeForm.to.trim() ||
      !composeForm.subject.trim() ||
      !composeForm.body.trim()
    ) {
      alert("Please fill in all fields");
      return;
    }
    setComposeLoading(true);
    try {
      await api.post("/messages/send", {
        to: composeForm.to,
        toName: composeForm.toName,
        subject: composeForm.subject,
        body: composeForm.body,
      });
      setComposeSuccess(true);
      setComposeForm({ to: "", toName: "", subject: "", body: "" });
      setSelectedRecipient(null);
      setTimeout(() => setComposeSuccess(false), 3000);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to send email.");
    } finally {
      setComposeLoading(false);
    }
  };

  const clearFilters = () => {
    setSearchQuery("");
    setFilterType("All");
  };

  const inboxCount = messages.length;
  const applicantCount = applicants.length;

  return (
    <div className="py-6 space-y-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-black text-[#000000]">
          Admin <span className="text-[#0085ff]">Messages</span>
        </h1>
        <p className="text-sm font-bold text-[#000000]/40 mt-2 uppercase tracking-wider">
          Manage contact inquiries and communicate with applicants
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-[1.5rem] p-5 shadow-sm border border-white/60 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-[#0085ff]/10 flex items-center justify-center">
            <Inbox className="w-6 h-6 text-[#0085ff]" />
          </div>
          <div>
            <p className="text-2xl font-black text-[#000000]">{inboxCount}</p>
            <p className="text-xs font-bold text-[#000000]/40 uppercase tracking-wider">
              Contact Messages
            </p>
          </div>
        </div>
        <div className="bg-white rounded-[1.5rem] p-5 shadow-sm border border-white/60 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center">
            <Users className="w-6 h-6 text-emerald-600" />
          </div>
          <div>
            <p className="text-2xl font-black text-[#000000]">
              {applicantCount}
            </p>
            <p className="text-xs font-bold text-[#000000]/40 uppercase tracking-wider">
              Job Applicants
            </p>
          </div>
        </div>
        <div className="bg-white rounded-[1.5rem] p-5 shadow-sm border border-white/60 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center">
            <Mail className="w-6 h-6 text-amber-600" />
          </div>
          <div>
            <p className="text-2xl font-black text-[#000000]">
              {allRecipients.length}
            </p>
            <p className="text-xs font-bold text-[#000000]/40 uppercase tracking-wider">
              Total Recipients
            </p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 bg-white rounded-[1.5rem] p-2 shadow-sm border border-white/60 w-fit">
        <button
          onClick={() => handleTabChange("inbox")}
          className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${
            activeTab === "inbox"
              ? "bg-[#0085ff] text-white shadow-lg shadow-[#0085ff]/20"
              : "text-[#000000]/40 hover:text-[#000000] hover:bg-[#eff7ff]"
          }`}
        >
          <span className="flex items-center gap-2">
            <Inbox className="w-4 h-4" />
            Inbox
            {inboxCount > 0 && (
              <span className="ml-1 px-1.5 py-0.5 bg-white/20 rounded-md text-xs">
                {inboxCount}
              </span>
            )}
          </span>
        </button>
        <button
          onClick={() => handleTabChange("applicants")}
          className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${
            activeTab === "applicants"
              ? "bg-[#0085ff] text-white shadow-lg shadow-[#0085ff]/20"
              : "text-[#000000]/40 hover:text-[#000000] hover:bg-[#eff7ff]"
          }`}
        >
          <span className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            Applicants
            {applicantCount > 0 && (
              <span className="ml-1 px-1.5 py-0.5 bg-white/20 rounded-md text-xs">
                {applicantCount}
              </span>
            )}
          </span>
        </button>
        <button
          onClick={() => handleTabChange("compose")}
          className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${
            activeTab === "compose"
              ? "bg-[#0085ff] text-white shadow-lg shadow-[#0085ff]/20"
              : "text-[#000000]/40 hover:text-[#000000] hover:bg-[#eff7ff]"
          }`}
        >
          <span className="flex items-center gap-2">
            <PenLine className="w-4 h-4" />
            Compose
          </span>
        </button>
      </div>

      {/* ─── INBOX TAB ─── */}
      {activeTab === "inbox" && (
        <div className="bg-white rounded-[2.5rem] p-6 sm:p-8 shadow-xl shadow-[#0085ff]/5 border border-white/60 overflow-hidden">
          {viewingMessage ? (
            /* ── Message Detail View ── */
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
              {/* Back button */}
              <button
                onClick={() => setViewingMessage(null)}
                className="inline-flex items-center gap-2 text-sm font-bold text-[#0085ff] hover:text-[#006fd6] transition"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Inbox
              </button>

              {/* Sender Info */}
              <div className="bg-[#eff7ff]/40 rounded-2xl p-6 border border-[#0085ff]/10">
                <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                  <div className="w-14 h-14 rounded-full bg-[#0085ff]/10 flex items-center justify-center shrink-0">
                    <MessageSquare className="w-7 h-7 text-[#0085ff]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-3 mb-2">
                      <h2 className="text-xl font-black text-[#000000]">
                        {viewingMessage._displayName}
                      </h2>
                      <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full bg-[#0085ff]/10 text-[#0085ff]">
                        Contact Form
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-x-4 gap-y-2 text-xs font-semibold text-[#000000]/50">
                      <span className="flex items-center gap-1.5">
                        <Mail className="w-3.5 h-3.5 text-[#0085ff]" />
                        {viewingMessage._displayEmail || "No email"}
                      </span>
                      {viewingMessage._displayPhone && (
                        <span className="flex items-center gap-1.5">
                          <Phone className="w-3.5 h-3.5 text-[#0085ff]" />
                          {viewingMessage._displayPhone}
                        </span>
                      )}
                      <span className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-[#0085ff]" />
                        {new Date(viewingMessage._date).toLocaleString(
                          "en-US",
                          {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          },
                        )}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Message Body */}
              <div className="bg-[#fafafa] rounded-2xl p-6 sm:p-8 border border-gray-100">
                {viewingMessage.subject && (
                  <h3 className="text-lg font-bold text-[#000000] mb-4 pb-4 border-b border-gray-200">
                    {viewingMessage.subject}
                  </h3>
                )}
                <div className="text-sm font-medium text-[#000000]/80 leading-relaxed whitespace-pre-wrap">
                  {viewingMessage._preview || (
                    <span className="italic text-[#000000]/30">
                      No message content.
                    </span>
                  )}
                </div>
              </div>

              {/* Reply Action */}
              <div className="flex justify-end pt-2">
                <button
                  onClick={() => {
                    const rec = allRecipients.find(
                      (r) =>
                        r.email === viewingMessage._displayEmail &&
                        r.type === "Contact Form",
                    );
                    if (rec) handleSelectRecipient(rec);
                    setViewingMessage(null);
                    setActiveTab("compose");
                  }}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-[#0085ff] hover:bg-[#006fd6] text-white text-sm font-bold rounded-xl transition shadow-lg shadow-[#0085ff]/20"
                >
                  <Send className="w-4 h-4" />
                  Reply to Message
                </button>
              </div>
            </div>
          ) : (
            /* ── Inbox List ── */
            <>
              {/* Filters */}
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="flex-1 relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#0085ff]" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by name, email, or message..."
                    className="w-full pl-11 pr-4 py-3 rounded-xl bg-[#eff7ff]/60 border border-transparent focus:border-[#0085ff] focus:bg-white focus:ring-4 focus:ring-[#0085ff]/10 text-sm font-semibold text-[#000000] placeholder:text-[#000000]/30 outline-none transition"
                  />
                </div>
                <div className="sm:w-40">
                  <div className="relative">
                    <select
                      value={filterType}
                      onChange={(e) => setFilterType(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-[#eff7ff]/60 border border-transparent focus:border-[#0085ff] focus:bg-white focus:ring-4 focus:ring-[#0085ff]/10 text-sm font-semibold text-[#000000] outline-none transition cursor-pointer appearance-none"
                    >
                      <option value="All">All Types</option>
                      <option value="Contact Form">Contact Form</option>
                      <option value="Applicant">Applicant</option>
                    </select>
                    <ChevronDown className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-[#000000]/30" />
                  </div>
                </div>
                {(searchQuery || filterType !== "All") && (
                  <button
                    onClick={clearFilters}
                    className="px-4 py-3 rounded-xl bg-[#eff7ff] text-[#0085ff] text-sm font-bold hover:bg-[#0085ff]/10 transition"
                  >
                    Clear
                  </button>
                )}
              </div>

              {loading ? (
                <div className="flex flex-col items-center justify-center py-20">
                  <div className="w-12 h-12 border-4 border-[#eff7ff] border-t-[#0085ff] rounded-full animate-spin mb-4"></div>
                  <p className="text-sm font-bold text-[#000000]/40 uppercase tracking-widest">
                    Loading messages...
                  </p>
                </div>
              ) : inboxMessages.length === 0 ? (
                <div className="text-center py-20">
                  <div className="w-20 h-20 bg-[#eff7ff] rounded-full flex items-center justify-center mx-auto mb-6">
                    <Mail className="w-10 h-10 text-[#0085ff]" />
                  </div>
                  <h3 className="text-xl font-black text-[#000000]">
                    No Messages Found
                  </h3>
                  <p className="text-sm font-semibold text-[#000000]/40 mt-2">
                    {searchQuery || filterType !== "All"
                      ? "Try adjusting your search or filters"
                      : "Messages will appear here when users submit the contact form."}
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {inboxMessages.map((item) => {
                    const TypeIcon = typeIcons[item._type] || Mail;
                    return (
                      <div
                        key={item._id}
                        className="group flex flex-col sm:flex-row sm:items-center gap-4 p-4 sm:p-5 rounded-2xl border border-gray-100 hover:border-[#0085ff]/20 hover:bg-[#eff7ff]/30 transition-all cursor-pointer"
                        onClick={() => setViewingMessage(item)}
                      >
                        {/* Avatar */}
                        <div className="w-12 h-12 rounded-full bg-[#eff7ff] flex items-center justify-center shrink-0">
                          <TypeIcon className="w-5 h-5 text-[#0085ff]" />
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="text-sm font-bold text-[#000000] truncate">
                              {item._displayName}
                            </h4>
                            <span
                              className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full ${typeStyles[item._type]}`}
                            >
                              {item._type}
                            </span>
                          </div>
                          <p className="text-xs text-[#000000]/40 font-medium truncate">
                            {item._displayEmail}
                            {item._displayPhone && ` • ${item._displayPhone}`}
                          </p>
                          <p className="text-xs text-[#000000]/50 font-semibold mt-1 line-clamp-1">
                            {item._preview}
                          </p>
                        </div>

                        {/* Date + Action */}
                        <div className="flex items-center gap-3 shrink-0">
                          <span className="text-[11px] font-semibold text-[#000000]/30">
                            {new Date(item._date).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                            })}
                          </span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setViewingMessage(item);
                            }}
                            className="px-4 py-2 rounded-xl bg-[#0085ff] text-white text-xs font-bold hover:bg-[#006fd6] transition shadow-sm"
                          >
                            View
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </>
          )}
        </div>
      )}

      {/* ─── APPLICANTS TAB ─── */}
      {activeTab === "applicants" && (
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
                <Users className="w-10 h-10 text-[#0085ff]" />
              </div>
              <h3 className="text-xl font-black text-[#000000]">
                No Applicants Yet
              </h3>
              <p className="text-sm font-semibold text-[#000000]/40 mt-2">
                Applicants will appear here once candidates start applying for
                jobs.
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
                      Job
                    </th>
                    <th className="px-5 py-4 text-[11px] font-black uppercase tracking-widest">
                      Contact
                    </th>
                    <th className="px-5 py-4 text-[11px] font-black uppercase tracking-widest">
                      Status
                    </th>
                    <th className="px-5 py-4 rounded-tr-xl text-[11px] font-black uppercase tracking-widest">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {applicants.map((app) => (
                    <tr
                      key={app._id}
                      className="hover:bg-[#eff7ff]/30 transition-colors"
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
                      </td>
                      <td className="px-5 py-5">
                        <div className="space-y-1">
                          {app.phone && (
                            <div className="flex items-center gap-2 text-xs text-[#000000]/60 font-semibold">
                              <Phone className="w-3.5 h-3.5 text-[#0085ff]" />
                              {app.phone}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-5 py-5">
                        <span className="px-3 py-1.5 rounded-xl text-xs font-black uppercase tracking-wider bg-gray-100 text-gray-600">
                          {app.status}
                        </span>
                      </td>
                      <td className="px-5 py-5">
                        <button
                          onClick={() => {
                            const rec = allRecipients.find(
                              (r) => r.id === app._id + "-applicant",
                            );
                            if (rec) handleSelectRecipient(rec);
                            setActiveTab("compose");
                          }}
                          className="px-4 py-2 rounded-xl bg-[#0085ff] text-white text-xs font-bold hover:bg-[#006fd6] transition shadow-sm flex items-center gap-1.5"
                        >
                          <Send className="w-3 h-3" />
                          Email
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* ─── COMPOSE TAB ─── */}
      {activeTab === "compose" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recipient List */}
          <div className="lg:col-span-1 bg-white rounded-[2.5rem] p-6 shadow-xl shadow-[#0085ff]/5 border border-white/60 overflow-hidden max-h-[600px] flex flex-col">
            <h3 className="text-sm font-black text-[#000000] uppercase tracking-wider mb-4">
              Select Recipient
            </h3>
            <div className="relative mb-3">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#0085ff]" />
              <input
                type="text"
                placeholder="Search recipients..."
                onChange={(e) => setShowRecipientDropdown(true)}
                className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-[#eff7ff]/60 border border-transparent focus:border-[#0085ff] focus:bg-white focus:ring-4 focus:ring-[#0085ff]/10 text-sm font-semibold text-[#000000] placeholder:text-[#000000]/30 outline-none transition"
              />
            </div>
            <div className="overflow-y-auto flex-1 space-y-2 pr-1">
              {allRecipients.length === 0 ? (
                <p className="text-xs text-[#000000]/40 font-semibold text-center py-8">
                  No recipients available
                </p>
              ) : (
                allRecipients.map((rec) => (
                  <button
                    key={rec.id}
                    onClick={() => handleSelectRecipient(rec)}
                    className={`w-full text-left p-3 rounded-xl transition-all ${
                      selectedRecipient?.id === rec.id
                        ? "bg-[#0085ff]/10 border border-[#0085ff]/20"
                        : "hover:bg-[#eff7ff]/50 border border-transparent"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-[#eff7ff] flex items-center justify-center shrink-0">
                        <User className="w-4 h-4 text-[#0085ff]" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-[#000000] truncate">
                          {rec.name}
                        </p>
                        <p className="text-[10px] text-[#000000]/40 truncate">
                          {rec.email}
                        </p>
                      </div>
                      <span
                        className={`ml-auto text-[9px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded-full shrink-0 ${typeStyles[rec.type]}`}
                      >
                        {rec.type === "Contact Form" ? "Contact" : "Applicant"}
                      </span>
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>

          {/* Compose Form */}
          <div className="lg:col-span-2 bg-white rounded-[2.5rem] p-6 sm:p-8 shadow-xl shadow-[#0085ff]/5 border border-white/60">
            <h3 className="text-sm font-black text-[#000000] uppercase tracking-wider mb-6">
              Compose Email
            </h3>

            {composeSuccess && (
              <div className="mb-6 p-4 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center">
                  <Send className="w-4 h-4 text-emerald-600" />
                </div>
                <div>
                  <p className="text-sm font-bold text-emerald-700">
                    Email Sent Successfully!
                  </p>
                  <p className="text-xs text-emerald-600">
                    Your message has been delivered.
                  </p>
                </div>
              </div>
            )}

            <form onSubmit={handleSendEmail} className="space-y-4">
              {/* Recipient Selector */}
              <div className="relative">
                <label className="block text-xs font-black text-[#000000] uppercase tracking-wider mb-1.5">
                  To
                </label>
                <div className="relative">
                  <input
                    type="email"
                    name="to"
                    value={composeForm.to}
                    onChange={handleComposeChange}
                    placeholder="Select a recipient or type an email..."
                    className="w-full px-4 py-3 rounded-xl bg-[#eff7ff]/60 border border-transparent focus:border-[#0085ff] focus:bg-white focus:ring-4 focus:ring-[#0085ff]/10 text-sm font-semibold text-[#000000] placeholder:text-[#000000]/30 outline-none transition"
                    required
                  />
                  {selectedRecipient && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
                      <span
                        className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full ${typeStyles[selectedRecipient.type]}`}
                      >
                        {selectedRecipient.type}
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedRecipient(null);
                          setComposeForm((p) => ({ ...p, to: "", toName: "" }));
                        }}
                        className="w-5 h-5 rounded-full bg-gray-200 flex items-center justify-center hover:bg-red-100 transition"
                      >
                        <X className="w-3 h-3 text-gray-500" />
                      </button>
                    </div>
                  )}
                </div>
                {selectedRecipient?.toName && (
                  <p className="text-xs text-[#000000]/40 mt-1">
                    {selectedRecipient.toName}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-black text-[#000000] uppercase tracking-wider mb-1.5">
                  Subject
                </label>
                <input
                  type="text"
                  name="subject"
                  value={composeForm.subject}
                  onChange={handleComposeChange}
                  placeholder="Enter email subject..."
                  className="w-full px-4 py-3 rounded-xl bg-[#eff7ff]/60 border border-transparent focus:border-[#0085ff] focus:bg-white focus:ring-4 focus:ring-[#0085ff]/10 text-sm font-semibold text-[#000000] placeholder:text-[#000000]/30 outline-none transition"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-black text-[#000000] uppercase tracking-wider mb-1.5">
                  Message
                </label>
                <textarea
                  name="body"
                  value={composeForm.body}
                  onChange={handleComposeChange}
                  rows={8}
                  placeholder="Write your message here..."
                  className="w-full px-4 py-3 rounded-xl bg-[#eff7ff]/60 border border-transparent focus:border-[#0085ff] focus:bg-white focus:ring-4 focus:ring-[#0085ff]/10 text-sm font-semibold text-[#000000] placeholder:text-[#000000]/30 outline-none transition resize-none"
                  required
                />
              </div>

              <div className="flex items-center justify-between pt-2">
                <p className="text-xs text-[#000000]/30 font-medium">
                  {composeForm.to
                    ? `Sending to: ${composeForm.to}`
                    : "No recipient selected"}
                </p>
                <button
                  type="submit"
                  disabled={composeLoading}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-[#0085ff] hover:bg-[#006fd6] text-white text-sm font-bold rounded-xl transition shadow-lg shadow-[#0085ff]/20 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {composeLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      Send Email
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminMessages;
