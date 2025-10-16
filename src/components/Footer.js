import React from "react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const handleLegalClick = (type) => {
    window.location.hash = `legal/${type}`;
  };

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Company Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">
              <a
                href="https://www.criterralabs.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white hover:text-blue-300 transition-colors"
              >
                Criterra Labs
              </a>
            </h3>
            <p className="text-gray-300 text-sm leading-relaxed">
              AI-powered image analysis and insights for modern businesses.
            </p>
            <div className="mt-4">
              <a
                href="https://www.criterralabs.com/contact"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-blue-300 text-sm transition-colors"
              >
                Contact Us →
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => (window.location.hash = "")}
                  className="text-gray-300 hover:text-white text-sm transition-colors"
                >
                  Home
                </button>
              </li>
              <li>
                <button
                  onClick={() => (window.location.hash = "delete")}
                  className="text-gray-300 hover:text-white text-sm transition-colors"
                >
                  Data Deletion
                </button>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Legal</h3>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => handleLegalClick("privacy")}
                  className="text-gray-300 hover:text-white text-sm transition-colors"
                >
                  Privacy Policy
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleLegalClick("terms")}
                  className="text-gray-300 hover:text-white text-sm transition-colors"
                >
                  Terms of Service
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © {currentYear} Criterra Labs. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <button
                onClick={() => handleLegalClick("privacy")}
                className="text-gray-400 hover:text-white text-sm transition-colors"
              >
                Privacy
              </button>
              <button
                onClick={() => handleLegalClick("terms")}
                className="text-gray-400 hover:text-white text-sm transition-colors"
              >
                Terms
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
