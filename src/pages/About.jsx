import React, { useState } from "react";
import { IoArrowForward, IoChevronDown, IoClose } from "react-icons/io5";
import { FaCheckCircle } from "react-icons/fa";
import api from "../services/api.js";

import AboutHeroBg from "../assets/Aboutus Section 1.jpg";
import AboutCollage from "../assets/Aboutus Section 2.png";
import AboutOffice from "../assets/Aboutus Section 3.png";

const About = () => {
  const [openFaq, setOpenFaq] = useState(null);
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [contactForm, setContactForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [contactErrors, setContactErrors] = useState({});
  const [contactLoading, setContactLoading] = useState(false);
  const [contactSuccess, setContactSuccess] = useState(false);

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const handleContactChange = (e) => {
    const { name, value } = e.target;
    setContactForm((p) => ({ ...p, [name]: value }));
    setContactErrors((p) => ({ ...p, [name]: "" }));
  };

  const validateContact = () => {
    const errs = {};
    if (!contactForm.fullName.trim()) errs.fullName = "Full name is required";
    if (!contactForm.email.trim()) errs.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contactForm.email))
      errs.email = "Invalid email";
    if (!contactForm.phone.trim()) errs.phone = "Phone is required";
    if (!contactForm.subject.trim()) errs.subject = "Subject is required";
    if (!contactForm.message.trim()) errs.message = "Message is required";
    return errs;
  };

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    const errs = validateContact();
    if (Object.keys(errs).length > 0) {
      setContactErrors(errs);
      return;
    }
    setContactLoading(true);
    try {
      await api.post("/messages/contact", {
        name: contactForm.fullName,
        email: contactForm.email,
        phone: contactForm.phone,
        subject: contactForm.subject,
        body: contactForm.message,
      });
      setContactSuccess(true);
      setContactForm({
        fullName: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
      });
      setTimeout(() => {
        setContactSuccess(false);
        setIsContactOpen(false);
      }, 2500);
    } catch (err) {
      alert(
        err.response?.data?.message || "Failed to send message. Try again.",
      );
    } finally {
      setContactLoading(false);
    }
  };

  const faqs = [
    {
      question: "What documents do I need to apply for this job?",
      answer:
        "You typically need your updated CV, passport copy, educational certificates, experience letters, and recent photographs. Specific requirements may vary by position.",
    },
    {
      question: "Can I edit my application after submitting it?",
      answer:
        "Yes, you can edit your application from your profile dashboard before it is reviewed by our recruitment team.",
    },
    {
      question: "How will I know if my application is accepted?",
      answer:
        "You will receive an email notification and a dashboard update once your application is reviewed and accepted.",
    },
    {
      question: "Is it necessary to upload all required documents?",
      answer:
        "Yes, uploading all required documents ensures faster processing and increases your chances of being shortlisted.",
    },
  ];

  return (
    <div className="w-full bg-white">
      {/* ═══════════════════════════════════════════════════════
          CONTACT MODAL / POPUP
      ═══════════════════════════════════════════════════════ */}
      {isContactOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center px-4"
          onClick={() => setIsContactOpen(false)}
        >
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity" />
          <div
            className="relative z-10 w-full max-w-lg bg-white rounded-[2rem] shadow-2xl border border-blue-100 p-6 sm:p-8 md:p-10 animate-[fadeIn_0.2s_ease-out]"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setIsContactOpen(false)}
              className="absolute top-4 right-4 sm:top-5 sm:right-5 w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 text-gray-500 hover:bg-red-50 hover:text-red-500 transition-colors"
            >
              <IoClose size={20} />
            </button>

            <div className="text-center mb-6 sm:mb-8">
              <div className="inline-flex items-center rounded-full bg-blue-50 px-5 py-2 mb-4">
                <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#2196F3]">
                  Get In Touch
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">
                Contact <span className="text-[#2196F3]">Us</span>
              </h2>
              <p className="mt-2 text-sm text-gray-400">
                Fill out the form below and we will get back to you shortly.
              </p>
            </div>

            {contactSuccess ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FaCheckCircle className="w-8 h-8 text-emerald-500" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-1">
                  Message Sent!
                </h3>
                <p className="text-sm text-gray-500">
                  We will get back to you soon.
                </p>
              </div>
            ) : (
              <form className="space-y-4" onSubmit={handleContactSubmit}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-medium text-gray-500">
                      Full Name
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      value={contactForm.fullName}
                      onChange={handleContactChange}
                      placeholder="John Doe"
                      className="w-full rounded-xl bg-gray-50 px-4 py-3 text-sm text-gray-900 placeholder-gray-400 border border-gray-100 focus:border-[#2196F3] focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                    />
                    {contactErrors.fullName && (
                      <p className="text-xs text-red-500">
                        {contactErrors.fullName}
                      </p>
                    )}
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-medium text-gray-500">
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={contactForm.email}
                      onChange={handleContactChange}
                      placeholder="john@example.com"
                      className="w-full rounded-xl bg-gray-50 px-4 py-3 text-sm text-gray-900 placeholder-gray-400 border border-gray-100 focus:border-[#2196F3] focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                    />
                    {contactErrors.email && (
                      <p className="text-xs text-red-500">
                        {contactErrors.email}
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-medium text-gray-500">
                      Phone
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={contactForm.phone}
                      onChange={handleContactChange}
                      placeholder="+1 (555) 000-0000"
                      className="w-full rounded-xl bg-gray-50 px-4 py-3 text-sm text-gray-900 placeholder-gray-400 border border-gray-100 focus:border-[#2196F3] focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                    />
                    {contactErrors.phone && (
                      <p className="text-xs text-red-500">
                        {contactErrors.phone}
                      </p>
                    )}
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-medium text-gray-500">
                      Subject
                    </label>
                    <input
                      type="text"
                      name="subject"
                      value={contactForm.subject}
                      onChange={handleContactChange}
                      placeholder="Job Inquiry"
                      className="w-full rounded-xl bg-gray-50 px-4 py-3 text-sm text-gray-900 placeholder-gray-400 border border-gray-100 focus:border-[#2196F3] focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                    />
                    {contactErrors.subject && (
                      <p className="text-xs text-red-500">
                        {contactErrors.subject}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium text-gray-500">
                    Message
                  </label>
                  <textarea
                    name="message"
                    value={contactForm.message}
                    onChange={handleContactChange}
                    rows={4}
                    placeholder="How can we help you?"
                    className="w-full rounded-xl bg-gray-50 px-4 py-3 text-sm text-gray-900 placeholder-gray-400 border border-gray-100 focus:border-[#2196F3] focus:ring-2 focus:ring-blue-100 outline-none transition-all resize-none"
                  />
                  {contactErrors.message && (
                    <p className="text-xs text-red-500">
                      {contactErrors.message}
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={contactLoading}
                  className="w-full inline-flex items-center justify-center gap-2 bg-[#2196F3] hover:bg-blue-600 text-white text-sm font-semibold px-6 py-3 rounded-full shadow-md hover:shadow-lg transition-all duration-300 group mt-2 disabled:opacity-50"
                >
                  {contactLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      Send Message
                      <IoArrowForward
                        size={16}
                        className="group-hover:translate-x-1 transition-transform"
                      />
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* ─── Hero Section ─── */}
      <section className="relative w-full h-[280px] sm:h-[320px] md:h-[360px] lg:h-[400px] flex items-center justify-center overflow-hidden">
        <img
          src={AboutHeroBg}
          alt="About Hero"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative z-10 text-center px-4">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-[2.75rem] font-bold text-white leading-tight">
            <span className="text-[#2196F3]">About</span>{" "}
            <span className="text-white">JobsPher International</span>
          </h1>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-[2.75rem] font-bold text-white leading-tight mt-1">
            Recruitment Agency
          </h2>
        </div>
        <div className="absolute bottom-4 right-4 sm:bottom-5 sm:right-6 md:bottom-6 md:right-10 lg:bottom-8 lg:right-16 z-10">
          <div className="bg-white rounded-full px-4 py-1.5 sm:px-5 sm:py-2 shadow-lg">
            <span className="text-xs sm:text-sm font-semibold text-gray-800">
              About <span className="text-[#2196F3]">Us</span>
            </span>
          </div>
        </div>
      </section>

      {/* ─── Trusted Partner Section ─── */}
      <section className="w-full pt-10 sm:pt-12 md:pt-14 lg:pt-16 pb-12 sm:pb-16 md:pb-20 lg:pb-24 px-4 sm:px-6 lg:px-8 bg-[var(--color-background)]">
        <div className="max-w-6xl mx-auto">
          <div className="w-full flex items-center justify-center mb-[-48px] sm:mb-[-56px] md:mb-[-64px] relative z-0">
            <img
              src={AboutCollage}
              alt="Team collage"
              className="w-full max-w-4xl h-auto object-contain rounded-xl"
            />
          </div>
          <div className="relative z-10 max-w-3xl mx-auto">
            <div className="bg-white rounded-2xl sm:rounded-3xl shadow-lg border border-gray-100 p-4 sm:p-6 md:p-8">
              <div className="flex flex-col sm:flex-row gap-4 sm:gap-5 md:gap-6">
                <div className="w-full sm:w-[38%] flex-shrink-0">
                  <img
                    src={AboutCollage}
                    alt="Meeting"
                    className="w-full h-48 sm:h-full object-cover rounded-xl sm:rounded-2xl"
                  />
                </div>
                <div className="flex-1 space-y-2 sm:space-y-3">
                  <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 leading-snug">
                    Your Trusted Partner{" "}
                    <span className="text-[#2196F3]">for Growth</span>
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-500 leading-relaxed">
                    Our commitment to our clients doesn't stop at recruitment.
                    We also offer a variety of services to help you navigate the
                    hiring process, including background checks, onboarding
                    support, and more.
                  </p>
                  <button
                    onClick={() => setIsContactOpen(true)}
                    className="inline-flex items-center gap-2 bg-[#2196F3] hover:bg-blue-600 text-white text-xs sm:text-sm font-medium px-5 py-2 sm:px-6 sm:py-2.5 rounded-full shadow-md hover:shadow-lg transition-all duration-300 group mt-1"
                  >
                    Get In Touch
                    <IoArrowForward
                      size={14}
                      className="group-hover:translate-x-1 transition-transform"
                    />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Our Services Section ─── */}
      <section className="w-full bg-[var(--color-background)] py-12 sm:py-16 md:py-20 lg:py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center space-y-6 sm:space-y-8">
          <div className="inline-flex">
            <span className="bg-blue-100 text-[#2196F3] text-[10px] sm:text-xs font-bold px-5 py-2 rounded-full tracking-[0.15em] sm:tracking-[0.2em] uppercase">
              Our Services
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-[2rem] font-bold text-gray-900 leading-tight">
            We Strive To Unleash The{" "}
            <span className="text-[#2195F3]">
              World's Untapped Human Potential
            </span>
          </h2>
          <div className="space-y-4 sm:space-y-5 text-left mt-8 sm:mt-10">
            <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="flex">
                <div className="w-1.5 sm:w-2 bg-[#2196F3] flex-shrink-0" />
                <div className="p-4 sm:p-6 md:p-7">
                  <h3 className="text-base sm:text-lg md:text-xl font-bold text-gray-900 mb-2">
                    Who Are We?
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-500 leading-relaxed">
                    We are a dedicated recruitment agency that specializes in
                    connecting top-tier talent with the best job opportunities
                    available.
                  </p>
                </div>
              </div>
            </div>
            <div className="rounded-xl sm:rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col sm:flex-row">
              <div className="bg-[#2196F3] p-4 sm:p-6 md:p-7 sm:w-[32%] md:w-[28%] flex-shrink-0 flex items-start">
                <h3 className="text-base sm:text-lg md:text-xl font-bold text-white">
                  What We Do?
                </h3>
              </div>
              <div className="bg-white p-4 sm:p-6 md:p-7 flex-1">
                <p className="text-xs sm:text-sm text-gray-500 leading-relaxed">
                  We provide recruitment and staffing services to help companies
                  find the right talent for their organization.
                </p>
              </div>
            </div>
            <div className="bg-[#1B3A5C] rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-7 shadow-sm">
              <h3 className="text-base sm:text-lg md:text-xl font-bold text-white mb-2">
                How We Do It?
              </h3>
              <p className="text-xs sm:text-sm text-blue-100/80 leading-relaxed">
                We take a personalized approach to recruitment. We believe that
                every employer and job seeker is unique, and we strive to
                understand their individual needs and requirements.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Our Vision Section ─── */}
      <section className="w-full py-12 sm:py-16 md:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col lg:flex-row items-start gap-10 lg:gap-14 xl:gap-16">
            <div className="w-full lg:w-1/2 flex flex-col justify-center space-y-4 sm:space-y-5">
              <div className="inline-flex">
                <span className="bg-blue-100 text-[#2196F3] text-[10px] sm:text-xs font-bold px-5 py-2 rounded-full tracking-[0.15em] sm:tracking-[0.2em] uppercase">
                  Our Vision
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl md:text-[1.75rem] lg:text-[1.85rem] xl:text-[2rem] font-bold text-gray-900 leading-[1.2]">
                Connecting The Best{" "}
                <span className="text-[#2196F3]">
                  Talent With Top-Tier Organizations
                </span>
              </h2>
              <p className="text-xs sm:text-sm text-gray-500 leading-relaxed">
                Our vision is to be recognized as the premier recruitment agency
                that connects the best talent with top-tier organizations.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2 pt-1">
                {[
                  "Paramount and Hassle-Free Services",
                  "Customer ease and Satisfaction",
                  "Establishing Better Coordination and Customer Relationship",
                  "Ensure Lucidity and Candor",
                ].map((item, idx) => (
                  <div key={idx} className="flex items-start gap-2">
                    <FaCheckCircle className="w-4 h-4 text-[#2196F3] flex-shrink-0 mt-0.5" />
                    <span className="text-[11px] sm:text-xs text-gray-600 font-medium leading-snug">
                      {item}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            <div className="w-full lg:w-1/2 flex items-center justify-center">
              <div className="relative w-full max-w-sm sm:max-w-md lg:max-w-md">
                <div className="relative z-10 ml-2 mt-2 sm:ml-3 sm:mt-3">
                  <img
                    src={AboutOffice}
                    alt="Office"
                    className="w-full h-auto rounded-xl sm:rounded-2xl shadow-md object-contain"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── FAQs Section ─── */}
      <section className="w-full py-12 sm:py-16 md:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 bg-[var(--color-background)]">
        <div className="max-w-3xl mx-auto text-center space-y-6 sm:space-y-8">
          <div className="inline-flex">
            <span className="bg-blue-100 text-[#2196F3] text-[10px] sm:text-xs font-bold px-5 py-2 rounded-full tracking-[0.15em] sm:tracking-[0.2em] uppercase">
              FAQs
            </span>
          </div>
          <div className="space-y-2 sm:space-y-3">
            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-[2rem] font-bold text-gray-900">
              Frequently Asked <span className="text-[#2196F3]">Questions</span>
            </h2>
            <p className="text-xs sm:text-sm text-gray-500 max-w-xl mx-auto leading-relaxed">
              Find quick answers to the most common questions applicants ask
              during the job application process
            </p>
          </div>
          <div className="space-y-2 sm:space-y-3 text-left mt-6 sm:mt-8">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="bg-white rounded-lg sm:rounded-xl overflow-hidden shadow-sm"
              >
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full flex items-center justify-between px-4 sm:px-5 md:px-6 py-3 sm:py-3.5 md:py-4 text-left hover:bg-gray-50/50 transition-colors"
                >
                  <span className="text-xs sm:text-sm md:text-base font-medium text-gray-800 pr-3">
                    {faq.question}
                  </span>
                  <IoChevronDown
                    size={16}
                    className={`text-gray-500 flex-shrink-0 transition-transform duration-300 ${openFaq === index ? "rotate-180" : ""}`}
                  />
                </button>
                <div
                  className={`overflow-hidden transition-all duration-300 ${openFaq === index ? "max-h-40" : "max-h-0"}`}
                >
                  <p className="px-4 sm:px-5 md:px-6 pb-3 sm:pb-4 text-xs sm:text-sm text-gray-500 leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
