"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const ScrollToTop = () => {
  useEffect(() => {
    const scrollBtn = document.getElementById("scrollToTopBtn");
    const handleScroll = () => {
      if (window.scrollY > 300) {
        scrollBtn?.classList.remove("hidden");
      } else {
        scrollBtn?.classList.add("hidden");
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <button
      id="scrollToTopBtn"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className="fixed bottom-5 right-5 bg-gray-700 hover:bg-gray-600 text-white p-3 min-w-12 min-h-12 rounded-full shadow-lg hidden transition-opacity duration-300"
      aria-label="Scroll to top"
    >
      ↑
    </button>
  );
};

const BackButton = () => (
  <Link
    href="/"
    className="fixed bottom-5 sm:top-5 sm:bottom-auto left-5 bg-gray-700 hover:bg-gray-600 text-white px-4 py-3 rounded-full min-h-12 md:min-h-0 shadow-lg transition-colors duration-200"
  >
    ← Back
  </Link>
);

export default function PrivacyPolicy() {
  const [activeSection, setActiveSection] = useState("");

  useEffect(() => {
    const sections = document.querySelectorAll("section");

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { threshold: 0.6 } // 60% no sadaļas jābūt redzamai, lai tā kļūtu aktīva
    );

    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect(); // Cleanup observer
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-white text-justify">
      <BackButton />

      {/* Galvenes sadaļa */}
      <header className="w-full py-10 bg-gradient-to-r from-gray-800 to-gray-900 text-center">
        <h1 className="text-4xl md:text-6xl font-extrabold text-white">
          Privacy Policy
        </h1>
        <p className="mt-4 text-gray-300 text-lg">Last Updated: March 2025</p>
      </header>

      {/* Galvenais saturs ar flex layout */}
      <div className="container mx-auto flex flex-col md:flex-row px-6 py-12">
        {/* Sānu navigācija */}
        <nav className="hidden md:block md:w-1/4 md:pr-8 min-w-[260px]">
          <div className="sticky top-24 bg-gray-800 p-6 rounded-lg shadow-md">
            <ul className="space-y-3 text-lg text-gray-300 mb-6 max-w-full">
              {[
                { id: "introduction", label: "Introduction" },
                { id: "information", label: "Information We Collect" },
                { id: "usage", label: "How We Use Your Data" },
                { id: "thirdparty", label: "Third-Party Services" },
                { id: "security", label: "Data Security & Retention" },
                { id: "rights", label: "Your Rights" },
                { id: "cookies", label: "Cookies and Tracking" },
                { id: "contact", label: "Contact Us" },
              ].map((item) => (
                <li key={item.id}>
                  <a
                    href={`#${item.id}`}
                    className={`${
                      activeSection === item.id
                        ? "text-white underline"
                        : "text-gray-300"
                    } hover:text-white transition-colors`}
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </nav>

        {/* Galvenais saturs */}
        <div className="w-full md:w-3/4 space-y-12">
          {[
            {
              id: "introduction",
              title: "",
              content: (
                <>
                  <p className="text-lg text-gray-300 mb-6 max-w-full">
                    At NFTs Guard, your privacy is our priority. This Privacy
                    Policy outlines in detail how we collect, use, store, share,
                    and protect your personal data when you interact with our
                    platform. Our goal is to ensure transparency and security,
                    so you can confidently use our services knowing how your
                    information is handled.
                  </p>
                  <p className="text-lg text-gray-300 mb-6 max-w-full">
                    This policy applies to all users who visit our website,
                    interact with our services, or engage with NFTs Guard
                    through any platform. We encourage you to read this document
                    carefully to understand what data we collect, why we collect
                    it, and how we protect your personal information.
                  </p>
                  <p className="text-lg text-gray-300 mb-6 max-w-full">
                    By using NFTs Guard, you acknowledge and agree to the
                    practices described in this Privacy Policy. If you do not
                    agree with any of the terms outlined here, we advise you to
                    discontinue using our services.
                  </p>
                </>
              ),
            },
            {
              id: "information",
              title: "Information We Collect",
              content: (
                <>
                  <p className="text-lg text-gray-300 mb-6 max-w-full">
                    At NFTs Guard, we collect various types of personal data to
                    ensure the security, functionality, and continuous
                    improvement of our services. Below is a detailed breakdown
                    of the information we collect and how it is used.
                  </p>

                  <h3 className="text-2xl font-semibold mt-6">
                    1. Account Information
                  </h3>
                  <p className="text-lg text-gray-300 mb-6 max-w-full">
                    When you sign up for NFTs Guard or interact with our
                    platform, we may collect:
                  </p>
                  <ul className="list-disc ml-6 text-lg text-gray-300 mb-6 max-w-full">
                    <li>
                      <strong>Email Address</strong> – Used for account
                      verification, communication, and security notifications.
                    </li>
                    <li>
                      <strong>Username</strong> – Used as an identifier within
                      our system.
                    </li>
                    <li>
                      <strong>Blockchain Wallet Address</strong> – Required to
                      analyze NFT transactions, security risks, and authenticate
                      your Web3 interactions.
                    </li>
                  </ul>

                  <h3 className="text-2xl font-semibold mt-6">
                    2. Transaction Data
                  </h3>
                  <p className="text-lg text-gray-300 mb-6 max-w-full">
                    We track blockchain transactions related to your activity,
                    including:
                  </p>
                  <ul className="list-disc ml-6 text-lg text-gray-300 mb-6 max-w-full">
                    <li>
                      <strong>NFT Purchases and Transfers</strong> – To monitor
                      for potential fraud, wash trading, and price manipulation.
                    </li>
                    <li>
                      <strong>Marketplace Interactions</strong> – Including
                      bids, sales, and listings on supported NFT platforms.
                    </li>
                    <li>
                      <strong>Wallet Activity</strong> – Publicly available on
                      the blockchain, used for security scoring and fraud
                      detection.
                    </li>
                  </ul>

                  <h3 className="text-2xl font-semibold mt-6">
                    3. Technical Data
                  </h3>
                  <p className="text-lg text-gray-300 mb-6 max-w-full">
                    To optimize performance, enhance security, and prevent
                    unauthorized access, we collect technical information such
                    as:
                  </p>
                  <ul className="list-disc ml-6 text-lg text-gray-300 mb-6 max-w-full">
                    <li>
                      <strong>IP Address</strong> – Helps detect suspicious
                      logins and ensure compliance with security protocols.
                    </li>
                    <li>
                      <strong>Device Information</strong> – Includes operating
                      system, browser type, and hardware specifications for
                      platform compatibility and optimization.
                    </li>
                    <li>
                      <strong>Usage Data</strong> – Includes interactions with
                      our platform, pages visited, and engagement patterns for
                      service improvements.
                    </li>
                  </ul>

                  <h3 className="text-2xl font-semibold mt-6">
                    4. Marketing and Communication Data
                  </h3>
                  <p className="text-lg text-gray-300 mb-6 max-w-full">
                    To personalize your experience and provide relevant updates,
                    we may collect:
                  </p>
                  <ul className="list-disc ml-6 text-lg text-gray-300 mb-6 max-w-full">
                    <li>
                      <strong>Communication Preferences</strong> – Determines
                      whether you wish to receive updates, security alerts, or
                      marketing emails.
                    </li>
                    <li>
                      <strong>User Engagement Metrics</strong> – Tracks email
                      open rates and interactions with our promotional content.
                    </li>
                    <li>
                      <strong>Survey and Feedback Responses</strong> – Helps us
                      enhance user experience and improve services.
                    </li>
                  </ul>

                  <p className="text-lg text-gray-300 mb-6 max-w-full">
                    All collected data is handled securely and in compliance
                    with applicable privacy regulations. For more information on
                    how we use your data, refer to the{" "}
                    <strong>&quot;How We Use Your Data&quot;</strong> section of
                    this Privacy Policy.
                  </p>
                </>
              ),
            },
            {
              id: "usage",
              title: "How We Use Your Data",
              content: (
                <>
                  <p className="text-lg text-gray-300 mb-6 max-w-full">
                    At NFTs Guard, we use your data to enhance security, improve
                    platform functionality, and comply with regulatory
                    requirements. Below are the key ways we utilize the
                    information we collect:
                    <ul className="list-disc ml-6 text-lg text-gray-300 mb-6 max-w-full">
                      <li>
                        <strong>NFT Security Risk Analysis</strong> – We analyze
                        blockchain transactions to detect fraudulent activities,
                        such as wash trading and price manipulation, and assess
                        the legitimacy of NFTs.This helps users make informed
                        investment decisions and avoid potential scams.
                      </li>
                      <li>
                        <strong>Improving Platform Functionality</strong> – By
                        analyzing user interactions, performance metrics, and
                        technical data, we optimize website speed, improve UI
                        design, and enhance overall user experience.
                      </li>
                      <li>
                        <strong>Regulatory Compliance</strong> – We may process
                        data to monitor suspicious activities, comply with
                        anti-money laundering (AML) regulations, and respond to
                        legal requests when required.
                      </li>
                      <li>
                        <strong>Fraud Prevention & Security</strong> – We track
                        wallet activity to identify unauthorized access, prevent
                        phishing attacks, and protect users from fraudulent
                        transactions.
                      </li>
                      <li>
                        <strong>Personalized Communication</strong> – We send
                        security alerts, feature updates, and relevant insights
                        based on user preferences. Users can adjust their
                        communication settings at any time.
                      </li>
                    </ul>
                  </p>
                </>
              ),
            },
            {
              id: "thirdparty",
              title: "Third-Party Services",
              content: (
                <>
                  <p className="text-lg text-gray-300 mb-6 max-w-full">
                    {" "}
                    We may share your data with trusted third-party services to
                    enhance functionality, ensure security, and improve user
                    experience. These include:
                    <ul className="list-disc ml-6 text-lg text-gray-300 mb-6 max-w-full">
                      <li>
                        <strong>Blockchain APIs</strong> – We analyze (e.g.,
                        Etherscan, Alchemy) – Used for verifying transaction
                        data, analyzing NFT activity, and enhancing security
                        monitoring.
                      </li>
                      <li>
                        <strong>Analytics Providers</strong> – By analyzing user
                        interactions, performance metrics, and technical data,
                        we optimize website speed, improve UI design, and
                        enhance overall user experience.
                      </li>
                      <li>
                        <strong>Regulatory Compliance</strong> – Help us track
                        platform performance, detect unusual activity, and
                        improve user engagement. We only share the necessary
                        data required for these services, and all third parties
                        must adhere to strict security and privacy standards.
                        Your personal data is never sold or shared for
                        advertising purposes.
                      </li>
                    </ul>
                  </p>
                </>
              ),
            },
            {
              id: "security",
              title: "Data Security & Retention",
              content: (
                <>
                  <p className="text-lg text-gray-300 mb-6 max-w-full">
                    NFTs Guard prioritizes the security of your personal data
                    and implements{" "}
                    <strong>industry-standard security measures</strong> to
                    protect it from unauthorized access, misuse, or breaches.
                    Our approach includes:
                  </p>
                  <ul className="list-disc ml-6 text-lg text-gray-300 mb-6 max-w-full">
                    <li>
                      <strong>Encryption</strong> – Sensitive data is encrypted
                      both <em>in transit</em> and <em>at rest</em> to prevent
                      unauthorized interception.
                    </li>
                    <li>
                      <strong>Secure Storage</strong> – We use a robust
                      infrastructure with strict access controls to protect
                      stored data from unauthorized access.
                    </li>
                    <li>
                      <strong>Access Controls</strong> – Only authorized
                      personnel have access to sensitive data, following strict
                      authentication protocols.
                    </li>
                    <li>
                      <strong>Regular Security Audits</strong> – We conduct
                      periodic security assessments and vulnerability scans to
                      identify and mitigate potential risks.
                    </li>
                    <li>
                      <strong>Monitoring & Threat Detection</strong> – Our
                      system actively monitors for suspicious activities to
                      prevent fraud, unauthorized access, or malicious attacks.
                    </li>
                  </ul>
                  <p className="text-lg text-gray-300 mb-6 max-w-full">
                    While we take all necessary precautions, no online platform
                    can guarantee absolute security. Users are encouraged to
                    follow <strong>best security practices</strong>, such as
                    using strong passwords and enabling{" "}
                    <strong>two-factor authentication (2FA)</strong> for their
                    wallets.
                  </p>
                  <p className="text-lg text-gray-300 mb-6 max-w-full">
                    If you suspect unauthorized access to your data, please
                    contact us immediately at{" "}
                    <a
                      href="mailto:info@nftsguard.com"
                      className="text-purple-400 hover:underline"
                    >
                      info@nftsguard.com
                    </a>
                    .
                  </p>
                </>
              ),
            },
            {
              id: "rights",
              title: "Your Rights",
              content: (
                <>
                  <p className="text-lg text-gray-300 mb-6 max-w-full">
                    As a user of NFTs Guard, you have several important rights
                    regarding your personal data. We are committed to ensuring
                    that you have full control over how your information is
                    collected, used, and stored. These rights include:
                  </p>
                  <ul className="list-disc ml-6 text-lg text-gray-300 mb-6 max-w-full">
                    <li>
                      <strong>Right to Access</strong> – You have the right to
                      request a copy of the personal data we hold about you,
                      including details on how it is being used.
                    </li>
                    <li>
                      <strong>Right to Correction</strong> – If you believe that
                      any of your personal data is inaccurate or incomplete, you
                      may request corrections to ensure its accuracy.
                    </li>
                    <li>
                      <strong>
                        Right to Deletion (&quot;Right to be Forgotten&quot;)
                      </strong>{" "}
                      – You can request the removal of your personal data from
                      our systems if it is no longer necessary for the purposes
                      for which it was collected, or if you withdraw your
                      consent.
                    </li>
                    <li>
                      <strong>Right to Restrict Processing</strong> – You may
                      request that we limit the way your personal data is
                      processed under certain circumstances, such as during
                      dispute resolution or if you contest the accuracy of the
                      data.
                    </li>
                    <li>
                      <strong>Right to Data Portability</strong> – You have the
                      right to receive your personal data in a structured,
                      commonly used, and machine-readable format, allowing you
                      to transfer it to another service provider if needed.
                    </li>
                    <li>
                      <strong>Right to Object</strong> – You can object to
                      certain types of data processing, including direct
                      marketing, where we use your data to send promotional
                      messages or updates.
                    </li>
                    <li>
                      <strong>Right to Withdraw Consent</strong> – If we rely on
                      your consent to process your personal data, you can
                      withdraw it at any time without affecting the legality of
                      processing carried out before withdrawal.
                    </li>
                  </ul>
                </>
              ),
            },
            {
              id: "cookies",
              title: "Cookies and Tracking",
              content: (
                <>
                  <p className="text-lg text-gray-300 mb-6 max-w-full">
                    NFTs Guard uses cookies and similar tracking technologies to
                    enhance user experience, analyze website traffic, and
                    improve our services. Cookies are small text files stored on
                    your device that help us recognize returning users,
                    personalize content, and optimize platform performance.
                  </p>
                  <p className="text-lg text-gray-300 mb-6 max-w-full">
                    Below is a breakdown of the types of cookies we use:
                  </p>
                  <ul className="list-disc ml-6 text-lg text-gray-300 mb-6 max-w-full">
                    <li>
                      <strong>Essential Cookies</strong> – These cookies are
                      necessary for the core functionality of our platform. They
                      enable secure login, authentication, and fraud prevention.
                      Without these cookies, some features may not function
                      properly.
                    </li>
                    <li>
                      <strong>Performance & Analytics Cookies</strong> – These
                      cookies help us analyze website traffic, user behavior,
                      and engagement. By collecting anonymized data, we gain
                      insights into how users interact with NFTs Guard, allowing
                      us to improve user experience and platform performance.
                    </li>
                    <li>
                      <strong>Functionality Cookies</strong> – These cookies
                      allow us to remember user preferences, such as language
                      settings and interface customizations, to provide a more
                      personalized experience.
                    </li>
                    <li>
                      <strong>Marketing & Tracking Cookies</strong> – If
                      enabled, these cookies help us deliver relevant content
                      and promotional updates based on user interests. These may
                      also be used by third-party services, such as analytics or
                      advertising platforms.
                    </li>
                  </ul>
                  <p className="text-lg text-gray-300 mb-6 max-w-full">
                    You can control and manage cookie preferences through your
                    browser settings. Most web browsers allow users to block or
                    delete cookies, but doing so may impact certain platform
                    functionalities.
                  </p>
                </>
              ),
            },
            {
              id: "contact",
              title: "Contact Us",
              content: (
                <>
                  <p className="text-lg text-gray-300 mb-6 max-w-full">
                    For any questions or concerns, please feel free to contact
                    us at{" "}
                    <Link
                      href="mailto:info@nftsguard.com"
                      className="text-purple-400 hover:underline"
                    >
                      info@nftsguard.com
                    </Link>
                    .
                  </p>
                </>
              ),
            },
          ].map((section) => (
            <section
              key={section.id}
              id={section.id}
              className="bg-gray-800 p-8 rounded-lg shadow-md"
            >
              <h2 className="text-3xl font-semibold mb-4">{section.title}</h2>
              <p className="text-lg text-gray-300">{section.content}</p>
            </section>
          ))}
        </div>
      </div>

      <ScrollToTop />
    </div>
  );
}
