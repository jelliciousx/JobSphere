import React from "react";
import {
  FaFacebook,
  FaInstagram,
  FaWhatsapp,
  FaTiktok,
  FaLinkedin,
  FaPhone,
  FaEnvelope,
} from "react-icons/fa";
import logo from "../assets/Logo.png";

const Footer = () => {
  return (
    <footer className="bg-white">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand Section */}
          <div className="flex flex-col">
            <div className="flex items-center space-x-2 mb-4">
              <img src={logo} alt="JobSphere" className="h-8 w-auto" />
              <div className="flex items-baseline"></div>
            </div>

            <p className="text-gray-700 text-sm leading-relaxed mb-6">
              JobSphere connects talented professionals with the right employers
              efficiently and reliably
            </p>

            {/* Social Media Links */}
            <div className="flex space-x-4">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-700 transition-colors"
                aria-label="Facebook"
              >
                <FaFacebook size={20} />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-700 transition-colors"
                aria-label="Instagram"
              >
                <FaInstagram size={20} />
              </a>
              <a
                href="https://whatsapp.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-700 transition-colors"
                aria-label="WhatsApp"
              >
                <FaWhatsapp size={20} />
              </a>
              <a
                href="https://tiktok.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-700 transition-colors"
                aria-label="TikTok"
              >
                <FaTiktok size={20} />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-700 transition-colors"
                aria-label="LinkedIn"
              >
                <FaLinkedin size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-bold text-blue-600 mb-6">
              Quick Links
            </h3>
            <ul className="space-y-4">
              <li>
                <a
                  href="/"
                  className="text-gray-700 hover:text-blue-600 transition-colors"
                >
                  Home
                </a>
              </li>
              <li>
                <a
                  href="/about"
                  className="text-gray-700 hover:text-blue-600 transition-colors"
                >
                  About
                </a>
              </li>
              <li>
                <a
                  href="/jobs"
                  className="text-gray-700 hover:text-blue-600 transition-colors"
                >
                  Jobs
                </a>
              </li>
              <li>
                <a
                  href="/profile"
                  className="text-gray-700 hover:text-blue-600 transition-colors"
                >
                  Profile
                </a>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-lg font-bold text-blue-600 mb-6">Resources</h3>
            <ul className="space-y-4">
              <li>
                <a
                  href="/terms"
                  className="text-gray-700 hover:text-blue-600 transition-colors"
                >
                  Terms & Conditions
                </a>
              </li>
              <li>
                <a
                  href="/privacy"
                  className="text-gray-700 hover:text-blue-600 transition-colors"
                >
                  Privacy Policy
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Us */}
          <div>
            <h3 className="text-lg font-bold text-blue-600 mb-6">Contact Us</h3>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <FaPhone className="text-blue-600" size={18} />
                <a
                  href="tel:+923111213456"
                  className="text-gray-700 hover:text-blue-600 transition-colors font-medium"
                >
                  +92 311 1213456
                </a>
              </div>
              <div className="flex items-center space-x-3">
                <FaEnvelope className="text-blue-600" size={18} />
                <a
                  href="mailto:jobsphere@gmail.com"
                  className="text-gray-700 hover:text-blue-600 transition-colors font-medium"
                >
                  Jobsphere@Gmail.Com
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-200 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center text-sm text-gray-600">
            <p className="mb-4 md:mb-0">Copyright @ JobSphere.com 2026</p>
            <div className="flex flex-wrap justify-center md:justify-end gap-2">
              <span>All Rights Reserved</span>
              <span>|</span>
              <a
                href="/terms"
                className="text-blue-600 hover:text-blue-700 transition-colors"
              >
                Terms and Conditions
              </a>
              <span>|</span>
              <a
                href="/privacy"
                className="text-blue-600 hover:text-blue-700 transition-colors"
              >
                Privacy Policy
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
