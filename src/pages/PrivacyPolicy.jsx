import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Shield,
  Lock,
  Eye,
  Server,
  Cookie,
  Users,
  Mail,
  ChevronDown,
  ChevronUp,
  FileText,
  Globe,
  Clock,
  Trash2,
  Hand,
} from "lucide-react";

const sections = [
  {
    id: "introduction",
    icon: Shield,
    title: "Introduction",
    content: `JobsPher International Recruitment Agency ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, store, and protect your personal information when you use our website, services, and job application platform (collectively, the "Services").

By accessing or using our Services, you agree to the terms of this Privacy Policy. If you do not agree, please do not use our Services.`,
  },
  {
    id: "collection",
    icon: Eye,
    title: "Information We Collect",
    content: `We collect the following types of information to provide and improve our recruitment services:

**Personal Information:**
• Full name, email address, phone number
• Residential address and location preferences
• Date of birth and nationality
• Passport number (for international job placements)
• LinkedIn profile and professional social media links

**Professional Information:**
• Resume/CV, cover letters, and portfolio documents
• Work experience, education history, and certifications
• Skills, languages, and professional qualifications
• Desired salary range and job preferences

**Usage Data:**
• IP address, browser type, and device information
• Pages visited, time spent, and interaction patterns
• Cookies and similar tracking technologies

**Communication Data:**
• Messages sent through our contact forms
• Email correspondence with our recruitment team
• Application status updates and notifications`,
  },
  {
    id: "usage",
    icon: FileText,
    title: "How We Use Your Information",
    content: `We use your personal information for the following purposes:

**Recruitment Services:**
• Matching your profile with suitable job opportunities
• Submitting your application to potential employers
• Coordinating interviews and assessments
• Providing application status updates

**Platform Improvement:**
• Analyzing user behavior to enhance user experience
• Personalizing job recommendations
• Troubleshooting technical issues
• Developing new features and services

**Communication:**
• Sending job alerts and relevant opportunities
• Responding to inquiries and support requests
• Sharing company news and industry updates (with consent)
• Administering surveys and feedback requests

**Legal Compliance:**
• Complying with labor laws and immigration regulations
• Verifying identity and eligibility for employment
• Preventing fraud and ensuring platform security
• Responding to legal requests and court orders`,
  },
  {
    id: "confidentiality",
    icon: Lock,
    title: "Applicant Data Confidentiality",
    content: `**Your privacy is our priority.** JobsPher International maintains strict confidentiality standards for all applicant data:

• **Exclusive Access:** Only authorized recruitment consultants and relevant hiring managers can access your profile.
• **No Unauthorized Sharing:** We never sell, rent, or trade your personal information to third parties for marketing purposes.
• **Employer Disclosure:** Your application is only shared with specific employers after your explicit consent for each job application.
• **Anonymized Profiles:** For sensitive searches, we can present anonymized profiles to employers until mutual interest is established.
• **Data Minimization:** We only collect information necessary for the recruitment process and remove unnecessary data promptly.
• **Confidential Searches:** If you are currently employed and seeking new opportunities, we handle your search with absolute discretion.

**Breach Notification:** In the unlikely event of a data breach, we will notify affected users within 72 hours and take immediate remedial action.`,
  },
  {
    id: "storage",
    icon: Server,
    title: "Data Storage & Security",
    content: `We implement industry-standard security measures to protect your data:

**Technical Safeguards:**
• AES-256 encryption for data at rest
• TLS 1.3 encryption for data in transit
• Secure cloud infrastructure with SOC 2 compliance
• Regular security audits and penetration testing
• Multi-factor authentication for staff access

**Data Retention:**
• Active applications: Retained for the duration of the recruitment process plus 12 months
• Inactive profiles: Retained for 24 months unless deletion is requested
• Resumes and documents: Stored securely with access logging
• Usage logs: Retained for 12 months for security purposes

**Geographic Storage:**
• Primary servers located in secure data centers
• Backup copies maintained in geographically separate locations
• Cross-border data transfers comply with GDPR and local data protection laws

**Deletion Rights:**
You may request complete deletion of your profile and associated data at any time. We will process deletion requests within 30 days, except where legal obligations require retention.`,
  },
  {
    id: "cookies",
    icon: Cookie,
    title: "Cookies & Tracking Technologies",
    content: `We use cookies and similar technologies to enhance your experience:

**Essential Cookies:**
• Session management and authentication
• Security features and fraud prevention
• Load balancing and performance optimization

**Functional Cookies:**
• Language preferences and location settings
• Saved job searches and filters
• Form auto-fill and draft preservation

**Analytics Cookies:**
• Google Analytics for usage statistics
• Heatmaps and session recordings (anonymized)
• Conversion tracking for platform improvements

**Marketing Cookies (Optional):**
• Job recommendation personalization
• Retargeting for relevant opportunities (with consent)
• Social media integration features

**Your Control:**
You can manage cookie preferences through your browser settings. Note that disabling essential cookies may affect platform functionality.`,
  },
  {
    id: "thirdparties",
    icon: Users,
    title: "Third-Party Services",
    content: `We work with trusted third-party providers to deliver our Services:

**Service Providers:**
• Cloud hosting and storage services (AWS, Google Cloud)
• Email and communication platforms (SendGrid, Resend)
• Analytics and monitoring tools (Google Analytics, Sentry)
• Payment processors (for premium services, if applicable)

**Employer Partners:**
• Your application data is shared only with employers you apply to
• Employers are contractually bound to handle your data responsibly
• We verify employer legitimacy before sharing any applicant information

**Legal Requirements:**
• Government agencies for work permit and visa processing (with consent)
• Law enforcement when legally compelled by valid court order
• Regulatory bodies for compliance verification

**International Transfers:**
For international job placements, your data may be transferred to countries with different privacy laws. We ensure adequate protection through standard contractual clauses and data processing agreements.`,
  },
  {
    id: "rights",
    icon: Hand,
    title: "Your Rights & Choices",
    content: `As a user of our Services, you have the following rights regarding your personal data:

**Access & Portability:**
• Request a copy of all personal data we hold about you
• Receive your data in a structured, machine-readable format
• View your application history and status updates

**Correction & Updates:**
• Update your profile information at any time
• Correct inaccurate or incomplete data
• Modify job preferences and availability status

**Deletion & Restriction:**
• Request deletion of your account and all associated data
• Restrict processing of your data in specific circumstances
• Object to automated decision-making and profiling
• Withdraw consent for marketing communications

**How to Exercise Your Rights:**
Contact our Data Protection Officer at privacy@jobshphere.com with your request. We will respond within 30 days and may request identity verification for security purposes.

**Complaints:**
If you believe your privacy rights have been violated, you may file a complaint with your local data protection authority or contact us directly for resolution.`,
  },
  {
    id: "children",
    icon: Globe,
    title: "Children's Privacy",
    content: `Our Services are not intended for individuals under 16 years of age. We do not knowingly collect personal information from children. If we discover that a child under 16 has provided us with personal information, we will promptly delete such information from our servers.

If you are a parent or guardian and believe your child has provided us with personal information, please contact us immediately at privacy@jobshphere.com.`,
  },
  {
    id: "changes",
    icon: Clock,
    title: "Policy Updates",
    content: `We may update this Privacy Policy periodically to reflect changes in our practices, legal requirements, or service offerings. 

**Notification of Changes:**
• Material changes will be communicated via email and platform notifications
• The "Last Updated" date at the top of this page will reflect the latest revision
• Continued use of our Services after changes constitutes acceptance

**Review History:**
• Current version: May 15, 2026
• Previous versions available upon request
• Significant changes will include a summary of modifications

We encourage you to review this Privacy Policy regularly to stay informed about how we protect your information.`,
  },
  {
    id: "contact",
    icon: Mail,
    title: "Contact Us",
    content: `If you have any questions, concerns, or requests regarding this Privacy Policy or our data practices, please contact us:

**Data Protection Officer:**
• Email: privacy@jobshphere.com
• Phone: +92 300 1234567
• Address: JobsPher International, 123 Business District, Lahore, Pakistan

**Response Time:**
• General inquiries: Within 48 hours
• Data access/deletion requests: Within 30 days
• Security incident reports: Immediate response

**Office Hours:**
Monday – Friday: 9:00 AM – 6:00 PM (PKT)
Saturday: 10:00 AM – 2:00 PM (PKT)

For urgent privacy matters, please mark your communication as "URGENT – PRIVACY" for priority handling.`,
  },
];

const PrivacyPolicy = () => {
  const [openSection, setOpenSection] = useState("introduction");

  const toggleSection = (id) => {
    setOpenSection(openSection === id ? null : id);
  };

  return (
    <div className="min-h-screen bg-[#eff7ff] py-10 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Accents */}
      <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[25%] bg-[#0085ff]/5 rounded-full blur-[100px] -z-0 pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[25%] bg-[#0085ff]/5 rounded-full blur-[100px] -z-0 pointer-events-none" />

      <div className="max-w-4xl mx-auto relative z-10">
        {/* ─── Header ─── */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center rounded-full bg-[#0085ff]/10 px-5 py-2 mb-4">
            <Shield className="w-4 h-4 text-[#0085ff] mr-2" />
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#0085ff]">
              Legal
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight">
            <span className="text-[#000000]">Privacy </span>
            <span className="text-[#0085ff]">Policy</span>
          </h1>
          <p className="text-[#000000]/40 text-xs sm:text-sm font-bold uppercase tracking-[0.25em] mt-3">
            JobsPher International Recruitment Agency
          </p>
          <p className="text-[#000000]/30 text-xs font-semibold mt-2">
            Last Updated: May 15, 2026
          </p>
        </div>

        {/* ─── Intro Card ─── */}
        <div className="bg-white rounded-[2rem] sm:rounded-[2.5rem] p-6 sm:p-8 shadow-xl shadow-[#0085ff]/5 border border-white/60 mb-8">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-[#0085ff]/10 flex items-center justify-center shrink-0">
              <Lock className="w-6 h-6 text-[#0085ff]" />
            </div>
            <div>
              <h2 className="text-lg font-black text-[#000000] mb-2">
                Your Privacy Matters
              </h2>
              <p className="text-sm text-[#000000]/50 font-semibold leading-relaxed">
                At JobsPher International, we understand that your personal and
                professional information is sensitive. This Privacy Policy
                outlines our commitment to safeguarding your data, maintaining
                confidentiality, and ensuring transparency in all our data
                practices. We adhere to international data protection standards
                including GDPR principles.
              </p>
            </div>
          </div>
        </div>

        {/* ─── Accordion Sections ─── */}
        <div className="space-y-3">
          {sections.map((section) => {
            const Icon = section.icon;
            const isOpen = openSection === section.id;

            return (
              <div
                key={section.id}
                className="bg-white rounded-2xl sm:rounded-3xl shadow-lg shadow-[#0085ff]/5 border border-white/60 overflow-hidden transition-all duration-300"
              >
                <button
                  onClick={() => toggleSection(section.id)}
                  className="w-full flex items-center gap-4 px-6 py-5 text-left hover:bg-[#eff7ff]/30 transition-colors"
                >
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                      isOpen ? "bg-[#0085ff]" : "bg-[#eff7ff]"
                    }`}
                  >
                    <Icon
                      className={`w-5 h-5 transition-colors ${
                        isOpen ? "text-white" : "text-[#0085ff]"
                      }`}
                    />
                  </div>
                  <span className="flex-1 text-sm sm:text-base font-bold text-[#000000]">
                    {section.title}
                  </span>
                  <div
                    className={`w-8 h-8 rounded-full bg-[#eff7ff] flex items-center justify-center transition-all ${
                      isOpen ? "rotate-180 bg-[#0085ff]" : ""
                    }`}
                  >
                    <ChevronDown
                      className={`w-4 h-4 transition-colors ${
                        isOpen ? "text-white" : "text-[#0085ff]"
                      }`}
                    />
                  </div>
                </button>

                <div
                  className={`overflow-hidden transition-all duration-300 ${
                    isOpen ? "max-h-[2000px]" : "max-h-0"
                  }`}
                >
                  <div className="px-6 pb-6 pt-2">
                    <div className="pl-14">
                      <div className="text-sm text-[#000000]/60 font-semibold leading-[1.8] whitespace-pre-line">
                        {section.content}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* ─── Footer Card ─── */}
        <div className="bg-white rounded-[2rem] sm:rounded-[2.5rem] p-6 sm:p-8 shadow-xl shadow-[#0085ff]/5 border border-white/60 mt-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center">
                <Shield className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-sm font-bold text-[#000000]">
                  Your Data is Safe
                </p>
                <p className="text-xs text-[#000000]/40 font-semibold">
                  Protected by industry-standard encryption
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4 text-xs font-semibold text-[#000000]/40">
              <Link to="/terms" className="hover:text-[#0085ff] transition">
                Terms & Conditions
              </Link>
              <span className="w-1 h-1 rounded-full bg-[#000000]/20" />
              <Link to="/about" className="hover:text-[#0085ff] transition">
                About Us
              </Link>
              <span className="w-1 h-1 rounded-full bg-[#000000]/20" />
              <Link to="/contact" className="hover:text-[#0085ff] transition">
                Contact
              </Link>
            </div>
          </div>
        </div>

        {/* ─── Bottom Spacing ─── */}
        <div className="h-10" />
      </div>
    </div>
  );
};

export default PrivacyPolicy;
