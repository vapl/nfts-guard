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
      className="fixed bottom-5 right-5 bg-gray-700 hover:bg-gray-800 text-white p-3 rounded-full shadow-lg hidden transition-opacity duration-300"
      aria-label="Scroll to top"
    >
      ↑
    </button>
  );
};

const BackButton = () => (
  <Link
    href="/"
    className="absolute top-5 left-5 bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-lg shadow-md transition-colors duration-200"
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
    <div className="min-h-screen bg-gray-900 text-white">
      <BackButton />

      {/* Galvenes sadaļa */}
      <header className="w-full py-10 bg-gradient-to-r from-gray-800 to-gray-900 text-center">
        <h1 className="text-5xl font-extrabold text-white">Tems of Service</h1>
        <p className="mt-4 text-gray-300 text-lg">Last Updated: March 2025</p>
      </header>

      {/* Galvenais saturs ar flex layout */}
      <div className="container mx-auto flex flex-col md:flex-row px-6 py-12">
        {/* Sānu navigācija */}
        <nav className="w-full md:w-1/4 mb-8 md:mb-0 md:pr-8">
          <div className="sticky top-24 bg-gray-800 p-6 rounded-lg shadow-md">
            <ul className="space-y-3 text-lg text-gray-300 mb-6 max-w-full">
              {[
                { id: "introduction", label: "Introduction" },
                { id: "eligibility", label: "Eligibility" },
                { id: "responsibilities", label: "User Responsibilities" },
                { id: "property", label: "Intellectual Property" },
                { id: "liability", label: "Limitation of Liability" },
                { id: "changes", label: "Changes to Terms" },
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
              title: "Introduction",
              content: (
                <>
                  <p className="text-lg text-gray-300 mb-6 max-w-full">
                    Welcome to <strong>NFTs Guard</strong>. These{" "}
                    <strong>Terms of Service</strong> (&quot;Terms&quot;) govern
                    your access to and use of our website, services, and tools
                    (collectively referred to as &quot;Services&quot;). By
                    accessing, browsing, or using our Services, you confirm that
                    you have read, understood, and agree to be bound by these
                    Terms, along with our{" "}
                    <Link
                      href="/privacy"
                      className="text-purple-400 hover:underline"
                    >
                      Privacy Policy
                    </Link>
                    . If you do not agree to any part of these Terms, we advise
                    you to discontinue using our Services immediately.
                  </p>
                  <p className="text-lg text-gray-300 mb-6 max-w-full">
                    NFTs Guard provides a platform designed to enhance **NFT
                    security**, detect fraudulent activity, and offer risk
                    assessment tools for blockchain-based assets. Our Services
                    may include analytics, fraud detection, investment insights,
                    and real-time monitoring to help users make informed
                    decisions in the Web3 ecosystem.
                  </p>
                  <p className="text-lg text-gray-300 mb-6 max-w-full">
                    These Terms apply to all visitors, registered users, and any
                    other individuals or entities accessing NFTs Guard. Certain
                    features of our platform may require you to create an
                    account or connect a blockchain wallet. By doing so, you
                    acknowledge that you are responsible for maintaining the
                    security of your credentials and that all activities
                    conducted under your account or wallet are your
                    responsibility.
                  </p>
                  <p className="text-lg text-gray-300 mb-6 max-w-full">
                    NFTs Guard reserves the right to **modify, update, or
                    discontinue** any aspect of the Services at any time, with
                    or without prior notice. We also reserve the right to
                    **modify these Terms** to reflect new features, legal
                    requirements, or industry standards. Your continued use of
                    our Services after any updates to these Terms signifies your
                    acceptance of the revised version.
                  </p>
                </>
              ),
            },
            {
              id: "eligibility",
              title: "Eligibility",
              content: (
                <>
                  <p className="text-lg text-gray-300 mb-6 max-w-full">
                    To use <strong>NFTs Guard</strong> and access our Services,
                    you must be at least <strong>18 years old</strong> or have
                    reached the age of legal majority in your jurisdiction. By
                    accessing and using our Services, you confirm that you meet
                    this **eligibility requirement** and that you have the legal
                    capacity to enter into these Terms.
                  </p>
                  <p className="text-lg text-gray-300 mb-6 max-w-full">
                    If you are under the age of 18, or do not have the legal
                    authority to agree to these Terms, you must{" "}
                    <strong>immediately discontinue</strong> use of NFTs Guard.
                    We do not knowingly collect or process personal data from
                    individuals who do not meet this requirement. If we discover
                    that an underage individual has accessed our Services, we
                    reserve the right to suspend or terminate their access and
                    take appropriate measures to remove any associated data.
                  </p>
                  <p className="text-lg text-gray-300 mb-6 max-w-full">
                    By using our Services, you also acknowledge that it is
                    <strong>your responsibility</strong> to ensure that
                    participation in blockchain-based transactions and digital
                    asset investments is legally permitted in your jurisdiction.
                    NFTs Guard does not provide legal advice, and we recommend
                    consulting a qualified professional if you are uncertain
                    about the applicable laws in your country.
                  </p>
                </>
              ),
            },
            {
              id: "responsibilities",
              title: "User Responsibilities",
              content: (
                <>
                  <p className="text-lg text-gray-300 mb-6 max-w-full">
                    By using <strong>NFTs Guard</strong>, you agree to access
                    and utilize our Services{" "}
                    <strong>only for lawful purposes</strong>. You are strictly
                    prohibited from using our platform in any manner that
                    violates applicable laws, regulations, or third-party
                    rights, including but not limited to intellectual property
                    laws, privacy rights, and financial regulations.
                  </p>
                  <p className="text-lg text-gray-300 mb-6 max-w-full">
                    You are fully responsible for any **content, data, or
                    materials** that you upload, share, or distribute through
                    our Services. This includes but is not limited to:
                  </p>
                  <ul className="list-disc ml-6 text-lg text-gray-300 mb-6 max-w-full">
                    <li>
                      Ensuring that all **uploaded content complies with
                      applicable laws** and does not infringe upon intellectual
                      property, privacy, or ownership rights of third parties.
                    </li>
                    <li>
                      Avoiding the use of our platform for **fraudulent,
                      misleading, or illegal activities**, including money
                      laundering, terrorist financing, or any unauthorized
                      financial transactions.
                    </li>
                    <li>
                      Refraining from uploading, sharing, or distributing
                      **malicious software, spam, or harmful content** that may
                      compromise the integrity of our platform or harm other
                      users.
                    </li>
                    <li>
                      Not engaging in **manipulative or deceptive practices**,
                      including falsified transactions, wash trading, or any
                      behavior that misrepresents the true nature of an NFT or
                      digital asset.
                    </li>
                  </ul>
                  <p className="text-lg text-gray-300 mb-6 max-w-full">
                    NFTs Guard reserves the right to **monitor, restrict, or
                    remove content** that we determine, at our sole discretion,
                    to be in violation of these Terms or applicable laws. We
                    also reserve the right to suspend or terminate user accounts
                    that engage in activities that compromise the safety and
                    legality of our platform.
                  </p>
                </>
              ),
            },
            {
              id: "property",
              title: "Intellectual Property",
              content: (
                <>
                  <p className="text-lg text-gray-300 mb-6 max-w-full">
                    All **content, trademarks, logos, graphics, software, and
                    materials** provided through the <strong>NFTs Guard</strong>{" "}
                    platform are the exclusive property of NFTs Guard or its
                    licensed partners. This includes but is not limited to
                    platform-generated analytics, proprietary security scoring
                    algorithms, user interface designs, and branding elements.
                  </p>
                  <p className="text-lg text-gray-300 mb-6 max-w-full">
                    You are strictly prohibited from copying, modifying,
                    distributing, publicly displaying, or creating derivative
                    works based on any part of our Services without obtaining
                    **explicit written permission** from NFTs Guard.
                    Unauthorized use of our intellectual property may result in
                    legal action.
                  </p>
                  <p className="text-lg text-gray-300 mb-6 max-w-full">
                    Specifically, you **may not**:
                  </p>
                  <ul className="list-disc ml-6 text-lg text-gray-300 mb-6 max-w-full">
                    <li>
                      Reproduce, duplicate, sell, resell, or commercially
                      exploit any NFTs Guard content or functionality without
                      authorization.
                    </li>
                    <li>
                      Modify, reverse-engineer, or attempt to extract source
                      code, proprietary algorithms, or platform analytics.
                    </li>
                    <li>
                      Use NFTs Guard branding, trademarks, or logos in a
                      misleading or unauthorized manner.
                    </li>
                    <li>
                      Create any competing product, service, or tool using our
                      proprietary content or insights.
                    </li>
                  </ul>
                </>
              ),
            },
            {
              id: "liability",
              title: "Limitation of Liability",
              content: (
                <>
                  <p className="text-lg text-gray-300 mb-6 max-w-full">
                    <strong>Limitation of Liability:</strong> NFTs Guard
                    provides its Services on an &quot;as-is&quot; and
                    &quot;as-available&quot; basis, without any guarantees of
                    uninterrupted availability, accuracy, or fitness for a
                    particular purpose. By using our Services, you acknowledge
                    that NFTs Guard **is not liable** for any damages, losses,
                    or claims that may arise from your use of the platform.
                  </p>
                  <p className="text-lg text-gray-300 mb-6 max-w-full">
                    To the fullest extent permitted by applicable law, NFTs
                    Guard and its affiliates, directors, employees, and partners
                    shall not be responsible for any **indirect, incidental,
                    consequential, special, or punitive damages** resulting
                    from:
                  </p>
                  <ul className="list-disc ml-6 text-lg text-gray-300 mb-6 max-w-full">
                    <li>
                      The **use or inability to use** our platform, tools, or
                      Services.
                    </li>
                    <li>
                      **Errors, inaccuracies, or missing information** in
                      security assessments, risk analyses, or NFT insights
                      provided through our Services.
                    </li>
                    <li>
                      **Financial losses, lost profits, or investment risks**
                      associated with NFT transactions based on our
                      platform&apos;s analysis.
                    </li>
                    <li>
                      **Unauthorized access, cyber-attacks, or security
                      breaches** affecting your blockchain wallet or digital
                      assets.
                    </li>
                    <li>
                      **Decisions made based on our data analytics** or any
                      reliance on automated risk scores or security warnings.
                    </li>
                  </ul>
                  <p className="text-lg text-gray-300 mb-6 max-w-full">
                    Our **total liability** to you for any claims, damages, or
                    legal actions shall not exceed the amount you have paid to
                    NFTs Guard, if any, for the use of our Services. If you have
                    not made any payments, our liability is **strictly limited
                    to the extent permitted by law**.
                  </p>
                </>
              ),
            },
            {
              id: "changes",
              title: "Changes to Terms",
              content: (
                <>
                  <p className="text-lg text-gray-300 mb-6 max-w-full">
                    <strong>Changes to These Terms:</strong> NFTs Guard reserves
                    the right to **modify, update, or amend** these Terms of
                    Service at any time to reflect changes in our Services,
                    applicable laws, or industry standards. Any modifications
                    will become effective once they are published on our
                    platform.
                  </p>
                  <p className="text-lg text-gray-300 mb-6 max-w-full">
                    If we make **material changes** to these Terms, we will
                    provide **reasonable notice** before the changes take
                    effect. Notifications may be sent via:
                  </p>
                  <ul className="list-disc ml-6 text-lg text-gray-300 mb-6 max-w-full">
                    <li>
                      Email communications (if you have provided a valid email
                      address).
                    </li>
                    <li>Notices posted directly within our platform.</li>
                    <li>
                      Other appropriate communication channels, where
                      applicable.
                    </li>
                  </ul>
                  <p className="text-lg text-gray-300 mb-6 max-w-full">
                    Your **continued use** of NFTs Guard after any updates to
                    these Terms will be deemed as **acceptance of the modified
                    Terms**. If you do not agree with the updated Terms, you
                    must discontinue using our Services.
                  </p>
                  <p className="text-lg text-gray-300 mb-6 max-w-full">
                    We encourage users to review this page periodically to stay
                    informed of any updates. If you have any questions regarding
                    changes to these Terms, please contact us at{" "}
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
