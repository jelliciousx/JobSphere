import React from "react";
import {
  FiShield,
  FiUserCheck,
  FiBriefcase,
  FiFileText,
  FiLock,
  FiAlertCircle,
  FiRefreshCw,
  FiPhone,
} from "react-icons/fi";
import { Link } from "react-router-dom";

const TermsAndConditions = () => {
  const lastUpdated = "January 1, 2025";

  const sections = [
    {
      icon: FiShield,
      title: "1. Acceptance of Terms",
      content:
        "By accessing or using JobSphere's platform, you agree to be bound by these Terms and Conditions. If you disagree with any part of the terms, you may not access the service. These terms apply to all job seekers, employers, and visitors of our platform.",
    },
    {
      icon: FiUserCheck,
      title: "2. User Accounts & Responsibilities",
      content:
        "Users are responsible for maintaining the confidentiality of their account credentials. You agree to provide accurate, current, and complete information during registration. JobSphere reserves the right to suspend or terminate accounts containing false information or engaging in fraudulent activity.",
    },
    {
      icon: FiBriefcase,
      title: "3. Job Applications & Listings",
      content:
        "JobSphere serves as an intermediary connecting candidates with employers. We do not guarantee employment or the accuracy of job listings. Employers are solely responsible for the content of their job postings. Candidates must ensure their applications contain truthful information.",
    },
    {
      icon: FiFileText,
      title: "4. Document Uploads & Verification",
      content:
        "Users may be required to upload CVs, certificates, passports, and other documents. By uploading, you grant JobSphere permission to share these documents with prospective employers. All uploaded documents must be authentic. Falsified documents will result in immediate account termination.",
    },
    {
      icon: FiLock,
      title: "5. Privacy & Data Protection",
      content:
        "Your privacy is important to us. Personal information collected is used solely for recruitment purposes. We implement industry-standard security measures to protect your data. For complete details, please review our Privacy Policy.",
    },
    {
      icon: FiAlertCircle,
      title: "6. Prohibited Activities",
      content:
        "Users may not use the platform for unlawful purposes, spam, harassment, or distribution of malware. Scraping, data mining, or automated access to our systems is strictly prohibited. Violation of these rules may result in legal action and permanent bans.",
    },
    {
      icon: FiRefreshCw,
      title: "7. Modifications to Service",
      content:
        "JobSphere reserves the right to modify, suspend, or discontinue any part of the service at any time. We may update these terms periodically. Continued use of the platform after changes constitutes acceptance of the revised terms.",
    },
    {
      icon: FiPhone,
      title: "8. Contact & Disputes",
      content:
        "For questions regarding these terms, please contact us at Jobsphere@Gmail.Com or +92 311 1213456. Any disputes arising from the use of our platform shall be governed by the laws of the Islamic Republic of Pakistan.",
    },
  ];

  return (
    <div className="min-h-screen bg-[#f4f9ff] pb-12">
      {/* ═══════════════════════════════════════════════════════
          HERO HEADER
      ═══════════════════════════════════════════════════════ */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-6">
        <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-r from-blue-400 to-blue-600 px-8 py-12 sm:py-16 shadow-lg text-center">
          <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
            Terms & <span className="text-blue-100">Conditions</span>
          </h1>
          <p className="mt-3 text-sm sm:text-base text-blue-50 max-w-xl mx-auto">
            Please read these terms carefully before using JobSphere's
            recruitment services.
          </p>
          <div className="mt-4 inline-flex items-center rounded-full bg-white/20 px-4 py-1.5 text-xs font-medium text-white backdrop-blur-sm">
            Last Updated: {lastUpdated}
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════
          MAIN CONTENT
      ═══════════════════════════════════════════════════════ */}
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 mt-8 space-y-6">
        {/* Intro Card */}
        <div className="rounded-[2rem] bg-white p-8 sm:p-10 shadow-sm border border-blue-50/50">
          <div className="inline-flex items-center rounded-full bg-blue-50 px-5 py-2 mb-6">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-blue-500">
              Legal Agreement
            </span>
          </div>
          <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
            Welcome to <strong className="text-gray-900">JobSphere</strong>.
            These Terms and Conditions outline the rules and regulations for the
            use of our website and recruitment services. By accessing this
            website, we assume you accept these terms in full. Do not continue
            to use JobSphere if you do not agree to all of the terms and
            conditions stated on this page.
          </p>
        </div>

        {/* Terms Sections */}
        <div className="space-y-4">
          {sections.map((section, idx) => (
            <div
              key={idx}
              className="rounded-[2rem] bg-white p-6 sm:p-8 shadow-sm border border-blue-50/50 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-[#2196F3]">
                  <section.icon size={20} />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-gray-900 mb-3">
                    {section.title}
                  </h3>
                  <p className="text-sm text-gray-500 leading-relaxed">
                    {section.content}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Acknowledgment Card */}
        <div className="rounded-[2rem] bg-gradient-to-r from-[#1B3A5C] to-[#2196F3] p-8 sm:p-10 shadow-lg text-center">
          <h3 className="text-xl sm:text-2xl font-bold text-white mb-3">
            Agreement Acknowledgment
          </h3>
          <p className="text-sm text-blue-100 leading-relaxed max-w-2xl mx-auto mb-6">
            By using our platform, you acknowledge that you have read,
            understood, and agree to be bound by these Terms and Conditions. If
            you have any questions, please reach out to our support team before
            proceeding.
          </p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 bg-white text-[#2196F3] text-sm font-semibold px-6 py-3 rounded-full shadow-md hover:bg-blue-50 transition-all duration-300"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default TermsAndConditions;
