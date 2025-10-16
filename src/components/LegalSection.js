import React, { useState } from "react";

const LegalSection = () => {
  const [activeTab, setActiveTab] = useState("privacy");

  const tabs = [
    { id: "privacy", label: "Privacy Policy", content: "privacy" },
    { id: "terms", label: "Terms of Service", content: "terms" },
  ];

  const renderContent = () => {
    if (activeTab === "privacy") {
      return (
        <div className="prose prose-sm max-w-none">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Privacy Policy
          </h2>
          <p className="text-sm text-gray-600 mb-4">
            Last Updated: January 2025
          </p>

          <div className="space-y-6">
            <section>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Introduction
              </h3>
              <p className="text-gray-700 leading-relaxed">
                Criterra Labs ("we," "our," or "us") operates the Exposr
                application (the "Service"). This Privacy Policy explains how we
                collect, use, disclose, and safeguard your information when you
                use our Service.
              </p>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Information We Collect
              </h3>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-gray-900">
                    Personal Information
                  </h4>
                  <ul className="list-disc list-inside text-gray-700 mt-2 space-y-1">
                    <li>
                      Email addresses (when you contact us or request support)
                    </li>
                    <li>Names (when provided voluntarily)</li>
                    <li>Usage data and analytics information</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">
                    Technical Information
                  </h4>
                  <ul className="list-disc list-inside text-gray-700 mt-2 space-y-1">
                    <li>IP addresses and device information</li>
                    <li>Browser type and version</li>
                    <li>Operating system information</li>
                    <li>Usage patterns and interaction data</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">
                    Content You Provide
                  </h4>
                  <ul className="list-disc list-inside text-gray-700 mt-2 space-y-1">
                    <li>Images uploaded for analysis</li>
                    <li>Feedback and comments you submit</li>
                    <li>Analysis results and generated content</li>
                  </ul>
                </div>
              </div>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                How We Use Your Information
              </h3>
              <p className="text-gray-700 leading-relaxed mb-3">
                We use the collected information to:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-1">
                <li>Provide and maintain our Service</li>
                <li>Process and analyze uploaded images</li>
                <li>Improve our Service and user experience</li>
                <li>Communicate with you about updates and support</li>
                <li>Ensure security and prevent abuse</li>
                <li>Comply with legal obligations</li>
              </ul>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Your Rights and Choices
              </h3>
              <p className="text-gray-700 leading-relaxed mb-3">
                You have the right to:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-1">
                <li>Access your personal information</li>
                <li>Correct inaccurate information</li>
                <li>Delete your personal information</li>
                <li>Port your data to another service</li>
                <li>Opt-out of certain data processing</li>
                <li>Withdraw consent at any time</li>
              </ul>
                <p className="text-gray-700 leading-relaxed mt-3">
                  Contact us at{" "}
                  <a
                    href="https://www.criterralabs.com/contact"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 underline"
                  >
                    our contact page
                  </a>{" "}
                  to exercise your rights.
                </p>
            </section>

              <section>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  Contact Information
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  If you have questions about this Privacy Policy, please contact
                  us:
                </p>
                <div className="mt-3 p-4 bg-gray-50 rounded-lg">
                  <p className="text-gray-700">
                    <strong>Website:</strong>{" "}
                    <a
                      href="https://www.criterralabs.com/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 underline"
                    >
                      www.criterralabs.com
                    </a>
                  </p>
                  <p className="text-gray-700">
                    <strong>Contact:</strong>{" "}
                    <a
                      href="https://www.criterralabs.com/contact"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 underline"
                    >
                      Contact Page
                    </a>
                  </p>
                  <p className="text-gray-700">
                    <strong>Company:</strong> Criterra Labs
                  </p>
                  <p className="text-gray-700">
                    <strong>Service:</strong> Exposr
                  </p>
                </div>
              </section>
          </div>
        </div>
      );
    }

    if (activeTab === "terms") {
      return (
        <div className="prose prose-sm max-w-none">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Terms of Service
          </h2>
          <p className="text-sm text-gray-600 mb-4">
            Last Updated: January 2025
          </p>

          <div className="space-y-6">
            <section>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Agreement to Terms
              </h3>
              <p className="text-gray-700 leading-relaxed">
                By accessing and using the Exposr application ("Service")
                operated by Criterra Labs, you agree to be bound by these Terms
                of Service. If you disagree with any part of these terms, you
                may not access the Service.
              </p>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Description of Service
              </h3>
              <p className="text-gray-700 leading-relaxed mb-3">
                Exposr is an AI-powered image analysis application that
                provides:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-1">
                <li>Image analysis and processing capabilities</li>
                <li>Data insights and reporting features</li>
                <li>User feedback and interaction tools</li>
                <li>Administrative and management functions</li>
              </ul>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Acceptable Use Policy
              </h3>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-gray-900">Permitted Uses</h4>
                  <ul className="list-disc list-inside text-gray-700 mt-2 space-y-1">
                    <li>Personal and commercial use of analysis features</li>
                    <li>Legitimate business purposes</li>
                    <li>Educational and research activities</li>
                    <li>Feedback and improvement suggestions</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">Prohibited Uses</h4>
                  <p className="text-gray-700 mt-2 mb-2">
                    You may NOT use the Service to:
                  </p>
                  <ul className="list-disc list-inside text-gray-700 space-y-1">
                    <li>Upload illegal or harmful content</li>
                    <li>Violate any laws or regulations</li>
                    <li>Infringe on intellectual property rights</li>
                    <li>Attempt to hack or compromise security</li>
                    <li>Spam or abuse the Service</li>
                    <li>Upload malicious software or content</li>
                  </ul>
                </div>
              </div>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Service Availability
              </h3>
              <p className="text-gray-700 leading-relaxed">
                We strive to maintain high service availability, but downtime
                may occur for maintenance or updates. We are not liable for
                temporary service interruptions.
              </p>
            </section>

              <section>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  Contact Information
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  For questions about these Terms, please contact us:
                </p>
                <div className="mt-3 p-4 bg-gray-50 rounded-lg">
                  <p className="text-gray-700">
                    <strong>Website:</strong>{" "}
                    <a
                      href="https://www.criterralabs.com/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 underline"
                    >
                      www.criterralabs.com
                    </a>
                  </p>
                  <p className="text-gray-700">
                    <strong>Contact:</strong>{" "}
                    <a
                      href="https://www.criterralabs.com/contact"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 underline"
                    >
                      Contact Page
                    </a>
                  </p>
                  <p className="text-gray-700">
                    <strong>Company:</strong> Criterra Labs
                  </p>
                  <p className="text-gray-700">
                    <strong>Service:</strong> Exposr
                  </p>
                </div>
              </section>
          </div>
        </div>
      );
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-lg">
        {/* Header */}
        <div className="border-b border-gray-200 px-6 py-4">
          <h1 className="text-3xl font-bold text-gray-900">
            Legal Information
          </h1>
          <p className="text-gray-600 mt-2">
            Please review our privacy policy and terms of service
          </p>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div className="px-6 py-8">{renderContent()}</div>
      </div>
    </div>
  );
};

export default LegalSection;
