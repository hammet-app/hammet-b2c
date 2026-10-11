import Image from "next/image";
import Link from "next/link";

const sections = [
  { id: "intro", label: "Introduction & scope" },
  { id: "collect", label: "Information we collect" },
  { id: "use", label: "How we use your information" },
  { id: "basis", label: "Our legal basis for processing" },
  { id: "cookies", label: "Cookies & tracking" },
  { id: "share", label: "How we share information" },
  { id: "retention", label: "Data retention" },
  { id: "security", label: "Data security" },
  { id: "rights", label: "Your rights" },
  { id: "children", label: "Children's privacy" },
  { id: "transfers", label: "International data transfers" },
  { id: "ai", label: "AI features & your data" },
  { id: "changes", label: "Changes to this Policy" },
  { id: "contact", label: "Contact & complaints" },
];

export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen bg-[#FBF7F0] text-[#24123F]">
      {/* Top bar */}
      <div className="bg-[#24123F] py-5 text-[#FBF7F0]">
        <div className="mx-auto flex w-full max-w-3xl items-center px-5 sm:px-8">
          <Link
            href="/"
            className="flex items-center gap-2.5 font-serif text-xl font-bold"
          >
            <Image
              src="/favicon.ico"
              alt="Hammet"
              width={24}
              height={24}
              className="h-6 w-6"
            />
            Hammet
          </Link>
        </div>
      </div>

      <div className="mx-auto w-full max-w-3xl px-5 sm:px-8">
        {/* Header */}
        <header className="border-b border-[#E4D9C6] py-12 sm:py-14">
          <p className="text-[13px] font-semibold uppercase tracking-[0.04em] text-[#0B7285]">
            Legal
          </p>

          <h1 className="mt-2 font-serif text-4xl font-bold tracking-tight text-[#24123F] sm:text-5xl">
            Privacy Policy
          </h1>

          <p className="mt-4 text-sm leading-6 text-[#4A3A66]">
            Effective date: [30th September 2026]
            <span className="mx-2">·</span>
            Applies to: app.hammetedu.com and the Hammet mobile and web
            learning platform
            <span className="mx-2">·</span>
            Data controller: Hammet Limited
          </p>
        </header>

        {/* Legal review notice */}
        <div className="my-8 rounded-2xl bg-[#F1E9DA] p-5 text-sm leading-6 text-[#4A3A66] sm:p-6">
          <strong className="text-[#24123F]">Draft for legal review.</strong>{" "}
          This is a structured starting point built around Nigeria&apos;s Data
          Protection Act 2023 (NDPA) and its 2025 General Application and
          Implementation Directive, with GDPR- and CCPA-style rights included
          since users outside Nigeria may access the Service. It has not been
          reviewed by a lawyer or your Data Protection Officer and should not be
          published as-is. Items marked{" "}
          <code className="rounded bg-[#E8DDCA] px-1.5 py-0.5 text-[13px]">
            [like this]
          </code>{" "}
          need a real value before publishing.
        </div>

        {/* Table of contents */}
        <nav className="my-8 rounded-2xl border border-[#E4D9C6] bg-white p-5 sm:p-6">
          <h2 className="mb-3 text-sm font-bold uppercase tracking-[0.04em] text-[#0B7285]">
            Contents
          </h2>

          <ol className="grid gap-1.5 text-sm sm:grid-cols-2 sm:gap-x-8">
            {sections.map((section, index) => (
              <li key={section.id}>
                <a
                  href={`#${section.id}`}
                  className="text-[#0B7285] transition hover:text-[#4B2A8A] hover:underline"
                >
                  {index + 1}. {section.label}
                </a>
              </li>
            ))}
          </ol>
        </nav>

        {/* Policy */}
        <article className="pb-20">
          {/* 1 */}
          <section
            id="intro"
            className="border-t border-[#E4D9C6] pt-9 first:border-t-0 first:pt-0"
          >
            <h2 className="font-serif text-2xl font-bold text-[#24123F]">
              1. Introduction &amp; scope
            </h2>

            <p className="mt-5 text-base leading-7 text-[#2E1E4A]">
              Hammet Limited (&quot;Hammet,&quot; &quot;we,&quot; &quot;us,&quot;
              &quot;our&quot;) respects your privacy. This Privacy Policy
              explains what personal data we collect through app.hammetedu.com
              and related apps (the &quot;Service&quot;), why we collect it,
              how we use and protect it, and the choices and rights you have.
            </p>

            <p className="mt-4 text-base leading-7 text-[#2E1E4A]">
              This Policy is written to meet the requirements of Nigeria&apos;s
              Data Protection Act 2023 (&quot;NDPA&quot;) and its General
              Application and Implementation Directive, and, where our users
              are located elsewhere, to reflect standards under the EU/UK
              General Data Protection Regulation (&quot;GDPR&quot;) and the
              California Consumer Privacy Act (&quot;CCPA&quot;). Where these
              laws differ, we apply whichever gives you stronger protection.
            </p>
          </section>

          {/* 2 */}
          <section
            id="collect"
            className="mt-9 border-t border-[#E4D9C6] pt-9"
          >
            <h2 className="font-serif text-2xl font-bold text-[#24123F]">
              2. Information we collect
            </h2>

            <div className="mt-5 overflow-x-auto rounded-xl border border-[#E4D9C6] bg-white">
              <table className="w-full min-w-[600px] border-collapse text-left text-sm">
                <thead>
                  <tr>
                    <th className="border-b border-[#E4D9C6] px-3 py-3 text-xs font-semibold uppercase tracking-wide text-[#0B7285]">
                      Category
                    </th>
                    <th className="border-b border-[#E4D9C6] px-3 py-3 text-xs font-semibold uppercase tracking-wide text-[#0B7285]">
                      Examples
                    </th>
                  </tr>
                </thead>

                <tbody>
                  <tr>
                    <td className="border-b border-[#E4D9C6] px-3 py-3 align-top font-medium">
                      Account information
                    </td>
                    <td className="border-b border-[#E4D9C6] px-3 py-3 align-top">
                      Name, email address, phone number, password (stored
                      hashed), date of birth [if collected], profile photo
                    </td>
                  </tr>

                  <tr>
                    <td className="border-b border-[#E4D9C6] px-3 py-3 align-top font-medium">
                      Learning data
                    </td>
                    <td className="border-b border-[#E4D9C6] px-3 py-3 align-top">
                      Courses enrolled, lesson progress, quiz and exercise
                      responses, time spent, certificates earned
                    </td>
                  </tr>

                  <tr>
                    <td className="border-b border-[#E4D9C6] px-3 py-3 align-top font-medium">
                      Payment information
                    </td>
                    <td className="border-b border-[#E4D9C6] px-3 py-3 align-top">
                      Billing name and address, transaction history — full card
                      numbers are handled by our payment processor and are not
                      stored by Hammet
                    </td>
                  </tr>

                  <tr>
                    <td className="border-b border-[#E4D9C6] px-3 py-3 align-top font-medium">
                      Device &amp; usage information
                    </td>
                    <td className="border-b border-[#E4D9C6] px-3 py-3 align-top">
                      IP address, device type, operating system, browser type,
                      app version, pages viewed, referring URLs
                    </td>
                  </tr>

                  <tr>
                    <td className="border-b border-[#E4D9C6] px-3 py-3 align-top font-medium">
                      Communications
                    </td>
                    <td className="border-b border-[#E4D9C6] px-3 py-3 align-top">
                      Messages you send us for support, feedback, or
                      forum/community posts
                    </td>
                  </tr>

                  <tr>
                    <td className="px-3 py-3 align-top font-medium">
                      Cookies &amp; similar technologies
                    </td>
                    <td className="px-3 py-3 align-top">
                      See our{" "}
                      <Link
                        href="/cookie-policy"
                        className="text-[#0B7285] hover:underline"
                      >
                        Cookie Policy
                      </Link>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* 3 */}
          <section id="use" className="mt-9 border-t border-[#E4D9C6] pt-9">
            <h2 className="font-serif text-2xl font-bold text-[#24123F]">
              3. How we use your information
            </h2>

            <ul className="mt-5 list-disc space-y-2 pl-6 text-base leading-7 text-[#2E1E4A]">
              <li>
                To create and maintain your account and deliver the courses and
                features you access;
              </li>
              <li>
                To track your learning progress and issue certificates;
              </li>
              <li>To process payments and manage subscriptions;</li>
              <li>To personalize content and recommendations;</li>
              <li>
                To communicate with you about your account, course updates, and
                — where you have opted in — marketing;
              </li>
              <li>
                To monitor, secure, and improve the Service, including
                analyzing aggregate usage trends;
              </li>
              <li>
                To detect, prevent, and address fraud, abuse, or violations of
                our Terms of Service;
              </li>
              <li>To comply with legal obligations.</li>
            </ul>
          </section>

          {/* 4 */}
          <section id="basis" className="mt-9 border-t border-[#E4D9C6] pt-9">
            <h2 className="font-serif text-2xl font-bold text-[#24123F]">
              4. Our legal basis for processing
            </h2>

            <p className="mt-5 text-base leading-7 text-[#2E1E4A]">
              Where the NDPA or GDPR applies, we rely on one or more of the
              following bases for each use of your data: performance of our
              contract with you (delivering the Service you signed up for),
              your consent (for example, for marketing emails or optional
              cookies), our legitimate interests (for example, keeping the
              Service secure and improving it), and compliance with legal
              obligations. You may withdraw consent at any time where consent
              is our basis for processing, without affecting processing carried
              out before withdrawal.
            </p>
          </section>

          {/* 5 */}
          <section
            id="cookies"
            className="mt-9 border-t border-[#E4D9C6] pt-9"
          >
            <h2 className="font-serif text-2xl font-bold text-[#24123F]">
              5. Cookies &amp; tracking
            </h2>

            <p className="mt-5 text-base leading-7 text-[#2E1E4A]">
              We use cookies and similar technologies to keep you logged in,
              remember your preferences, and understand how the Service is
              used. Full detail on the categories of cookies we use, and how to
              manage them, is in our{" "}
              <Link
                href="/cookie-policy"
                className="text-[#0B7285] hover:underline"
              >
                Cookie Policy
              </Link>
              .
            </p>
          </section>

          {/* 6 */}
          <section id="share" className="mt-9 border-t border-[#E4D9C6] pt-9">
            <h2 className="font-serif text-2xl font-bold text-[#24123F]">
              6. How we share information
            </h2>

            <p className="mt-5 text-base leading-7 text-[#2E1E4A]">
              We do not sell your personal data. We share information only in
              the following circumstances:
            </p>

            <ul className="mt-4 list-disc space-y-2 pl-6 text-base leading-7 text-[#2E1E4A]">
              <li>
                <strong>Service providers</strong> who help us operate the
                Service, such as hosting ([Supabase/AWS — confirm]), payment
                processing ([Paystack/Flutterwave — confirm]), analytics, and
                customer support tools — bound by contracts requiring them to
                protect your data and use it only for the purposes we specify;
              </li>

              <li>
                <strong>Schools or institutions</strong>, where you access
                Hammet through a school account, in which case your school may
                act as data controller for your learning records under a
                separate arrangement;
              </li>

              <li>
                <strong>Legal &amp; safety</strong> — where required by law,
                court order, or to protect the rights, property, or safety of
                Hammet, our users, or the public;
              </li>

              <li>
                <strong>Business transfers</strong> — if Hammet is involved in
                a merger, acquisition, or asset sale, your information may be
                transferred as part of that transaction, subject to this
                Policy&apos;s protections continuing to apply.
              </li>
            </ul>
          </section>

          {/* 7 */}
          <section
            id="retention"
            className="mt-9 border-t border-[#E4D9C6] pt-9"
          >
            <h2 className="font-serif text-2xl font-bold text-[#24123F]">
              7. Data retention
            </h2>

            <p className="mt-5 text-base leading-7 text-[#2E1E4A]">
              We retain your personal data for as long as your account is
              active, and for a reasonable period afterward to comply with
              legal, accounting, or reporting obligations, resolve disputes,
              and enforce our agreements. Learning records and certificates
              may be retained longer to allow you to verify your credentials in
              future. You can request deletion of your account and associated
              data at any time (see Section 9).
            </p>
          </section>

          {/* 8 */}
          <section
            id="security"
            className="mt-9 border-t border-[#E4D9C6] pt-9"
          >
            <h2 className="font-serif text-2xl font-bold text-[#24123F]">
              8. Data security
            </h2>

            <p className="mt-5 text-base leading-7 text-[#2E1E4A]">
              We use administrative, technical, and physical safeguards
              designed to protect your personal data, including encryption in
              transit, access controls, and regular security review of our
              systems. No method of transmission or storage is 100% secure, and
              we cannot guarantee absolute security. If we become aware of a
              breach affecting your personal data, we will notify the Nigeria
              Data Protection Commission and affected users as required by the
              NDPA.
            </p>
          </section>

          {/* 9 */}
          <section id="rights" className="mt-9 border-t border-[#E4D9C6] pt-9">
            <h2 className="font-serif text-2xl font-bold text-[#24123F]">
              9. Your rights
            </h2>

            <p className="mt-5 text-base leading-7 text-[#2E1E4A]">
              Depending on where you live, you have some or all of the
              following rights over your personal data:
            </p>

            <ul className="mt-4 list-disc space-y-2 pl-6 text-base leading-7 text-[#2E1E4A]">
              <li>
                <strong>Access</strong> — request a copy of the personal data
                we hold about you;
              </li>
              <li>
                <strong>Rectification</strong> — correct inaccurate or
                incomplete data;
              </li>
              <li>
                <strong>Erasure</strong> — request deletion of your data,
                subject to legal retention requirements;
              </li>
              <li>
                <strong>Restriction</strong> — request that we limit how we use
                your data in certain circumstances;
              </li>
              <li>
                <strong>Portability</strong> — receive your data in a
                structured, machine-readable format;
              </li>
              <li>
                <strong>Objection</strong> — object to processing based on
                legitimate interests or direct marketing;
              </li>
              <li>
                <strong>Withdraw consent</strong> — where processing is based
                on consent.
              </li>
            </ul>

            <p className="mt-4 text-base leading-7 text-[#2E1E4A]">
              To exercise any of these rights, email{" "}
              <a
                href="mailto:hammetedu@gmail.com"
                className="text-[#0B7285] hover:underline"
              >
                hammetedu@gmail.com
              </a>
              . We will respond within the timeframe required by applicable
              law (typically within 30 days). If you are not satisfied with our
              response, you may lodge a complaint with the Nigeria Data
              Protection Commission (NDPC), or, if you are in the EU/UK, with
              your local data protection authority.
            </p>
          </section>

          {/* 10 */}
          <section
            id="children"
            className="mt-9 border-t border-[#E4D9C6] pt-9"
          >
            <h2 className="font-serif text-2xl font-bold text-[#24123F]">
              10. Children&apos;s privacy
            </h2>

            <p className="mt-5 text-base leading-7 text-[#2E1E4A]">
              The Service is intended for users aged 13 and older. Under the
              NDPA, processing a child&apos;s personal data requires the
              consent of a parent or legal guardian, and we require this for
              any account holder under 18. If you believe a child has provided
              us with personal data without appropriate consent, contact us at{" "}
              <a
                href="mailto:hammetedu@gmail.com"
                className="text-[#0B7285] hover:underline"
              >
                hammetedu@gmail.com
              </a>{" "}
              and we will investigate and delete the data as required.
            </p>

            <p className="mt-4 text-base leading-7 text-[#2E1E4A]">
              [If Hammet&apos;s B2C platform will knowingly serve users under
              13 — for example, through a school-supervised account — this
              section needs additional safeguards drafted with counsel, similar
              to COPPA-style protections.]
            </p>
          </section>

          {/* 11 */}
          <section
            id="transfers"
            className="mt-9 border-t border-[#E4D9C6] pt-9"
          >
            <h2 className="font-serif text-2xl font-bold text-[#24123F]">
              11. International data transfers
            </h2>

            <p className="mt-5 text-base leading-7 text-[#2E1E4A]">
              Your data may be processed in countries other than the one you
              live in, including [Nigeria and the United States, where our
              infrastructure providers operate]. Where we transfer personal
              data out of Nigeria or the EU/UK, we do so only where the
              destination provides an adequate level of protection, under
              contractual safeguards, or with your consent, as required under
              the NDPA and GDPR.
            </p>
          </section>

          {/* 12 */}
          <section id="ai" className="mt-9 border-t border-[#E4D9C6] pt-9">
            <h2 className="font-serif text-2xl font-bold text-[#24123F]">
              12. AI features &amp; your data
            </h2>

            <p className="mt-5 text-base leading-7 text-[#2E1E4A]">
              Where the Service uses AI to generate feedback or recommendations,
              your learning inputs (such as quiz responses or written answers)
              may be processed by AI models, including third-party AI
              providers, to generate that output. We do not use your personal
              data to train third-party AI models without your consent.
            </p>
          </section>

          {/* 13 */}
          <section
            id="changes"
            className="mt-9 border-t border-[#E4D9C6] pt-9"
          >
            <h2 className="font-serif text-2xl font-bold text-[#24123F]">
              13. Changes to this Policy
            </h2>

            <p className="mt-5 text-base leading-7 text-[#2E1E4A]">
              We may update this Privacy Policy from time to time. If we make
              material changes, we will notify you by email or through the
              Service before they take effect. The &quot;Effective date&quot;
              at the top of this page shows when it was last updated.
            </p>
          </section>

          {/* 14 */}
          <section
            id="contact"
            className="mt-9 border-t border-[#E4D9C6] pt-9"
          >
            <h2 className="font-serif text-2xl font-bold text-[#24123F]">
              14. Contact &amp; complaints
            </h2>

            <p className="mt-5 text-base leading-7 text-[#2E1E4A]">
              Questions, requests, or complaints about this Policy can be sent
              to{" "}
              <a
                href="mailto:hammetedu@gmail.com"
                className="text-[#0B7285] hover:underline"
              >
                hammetedu@gmail.com
              </a>{" "}
              or{" "}
              <a
                href="mailto:admin@hammetlabs.com"
                className="text-[#0B7285] hover:underline"
              >
                admin@hammetlabs.com
              </a>
              , or by phone at 07040576412. [If Hammet appoints a formal Data
              Protection Officer under the NDPA, their name and direct contact
              should be added here.]
            </p>
          </section>
        </article>

        {/* Footer */}
        <footer className="flex flex-col gap-3 border-t border-[#E4D9C6] py-8 text-sm text-[#4A3A66] sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap gap-x-5 gap-y-2">
            <Link
              href="/terms"
              className="text-[#0B7285] hover:underline"
            >
              Terms of Service
            </Link>

            <Link
              href="/cookie-policy"
              className="text-[#0B7285] hover:underline"
            >
              Cookie Policy
            </Link>
          </div>

          <div>© 2026 Hammet Limited</div>
        </footer>
      </div>
    </main>
  );
}