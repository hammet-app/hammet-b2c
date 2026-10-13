"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Shield, FileText, Lock, Globe, Database, UserCheck, AlertCircle } from "lucide-react";

const sections = [
  { id: "intro", label: "Introduction & Scope" },
  { id: "collect", label: "Information We Collect" },
  { id: "use", label: "How We Use Data" },
  { id: "basis", label: "Legal Basis for Processing" },
  { id: "cookies", label: "Cookies & Tracking" },
  { id: "share", label: "Data Sharing & Third Parties" },
  { id: "retention", label: "Data Retention" },
  { id: "security", label: "Security & Safeguards" },
  { id: "rights", label: "Your Privacy Rights" },
  { id: "children", label: "Children's Privacy" },
  { id: "transfers", label: "Cross-Border Transfers" },
  { id: "ai", label: "AI Features & Data Governance" },
  { id: "changes", label: "Policy Updates" },
  { id: "contact", label: "Contact & Data Officer" },
];

export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen bg-[#FAF9F6] text-slate-800 antialiased transition-colors dark:bg-[#0A0713] dark:text-slate-200">
      {/* Top Glassmorphic Navigation Bar */}
      <header className="sticky top-0 z-50 border-b border-black/[0.06] bg-white/80 backdrop-blur-md dark:border-white/10 dark:bg-[#0A0713]/80">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-5 py-3.5 sm:px-8">
          <Link
            href="/"
            className="flex items-center gap-2.5 transition-opacity hover:opacity-90"
          >
            <Image
              src="/icon-512x512.png"
              alt="Hammet"
              width={28}
              height={28}
              className="rounded-lg object-contain shadow-sm"
            />
            <span className="font-poppins text-lg font-black tracking-tight text-slate-900 dark:text-white">
              Hammet <span className="text-purple-600 dark:text-cyan-400">Academy</span>
            </span>
          </Link>

          <div className="flex items-center gap-3">
            <Link
              href="/terms"
              className="text-xs font-semibold text-slate-600 transition hover:text-purple-600 dark:text-slate-400 dark:hover:text-cyan-400 sm:text-sm"
            >
              Terms &amp; Conditions
            </Link>
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 rounded-xl border border-black/[0.08] bg-white px-3.5 py-1.5 text-xs font-semibold text-slate-800 shadow-sm transition hover:bg-slate-50 dark:border-white/10 dark:bg-white/[0.05] dark:text-white dark:hover:bg-white/[0.08]"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Back to Home</span>
            </Link>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-5xl px-5 py-10 sm:px-8 lg:py-14">
        {/* Header Hero Card */}
        <div className="rounded-3xl border border-black/[0.06] bg-white p-7 shadow-sm dark:border-white/10 dark:bg-white/[0.02] sm:p-10">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-300">
            <Shield className="h-3.5 w-3.5" />
            <span>Privacy &amp; Data Protection</span>
          </div>

          <h1 className="mt-4 font-poppins text-3xl font-black tracking-tight text-slate-950 sm:text-4xl lg:text-5xl dark:text-white">
            Privacy Policy
          </h1>

          <p className="mt-3 max-w-3xl text-sm leading-relaxed text-slate-600 sm:text-base dark:text-slate-400">
            Hammet Limited (&quot;Hammet,&quot; &quot;we,&quot; &quot;our&quot;) is committed to protecting your personal data 
            and ensuring transparency across our AI Academy, developer playgrounds, and student passport infrastructure.
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 border-t border-black/[0.06] pt-5 text-xs text-slate-500 dark:border-white/10 dark:text-slate-400">
            <span><strong>Effective Date:</strong> October 2026</span>
            <span>•</span>
            <span><strong>Compliance Standards:</strong> NDPA 2023, GDPR &amp; CCPA</span>
            <span>•</span>
            <span><strong>Data Controller:</strong> Hammet Limited</span>
          </div>
        </div>

        {/* Layout Grid: TOC + Policy Articles */}
        <div className="mt-10 grid gap-10 lg:grid-cols-[260px_1fr]">
          {/* Table of Contents */}
          <aside className="hidden lg:block">
            <div className="sticky top-24 rounded-2xl border border-black/[0.06] bg-white p-5 shadow-sm dark:border-white/10 dark:bg-white/[0.02]">
              <h3 className="mb-3 font-poppins text-xs font-black uppercase tracking-wider text-slate-400 dark:text-slate-500">
                Contents
              </h3>
              <nav className="space-y-1">
                {sections.map((sec, idx) => (
                  <a
                    key={sec.id}
                    href={`#${sec.id}`}
                    className="block rounded-lg px-2.5 py-1.5 text-xs font-medium text-slate-600 transition hover:bg-purple-50 hover:text-purple-700 dark:text-slate-400 dark:hover:bg-purple-950/40 dark:hover:text-cyan-300"
                  >
                    <span className="text-slate-400 dark:text-slate-600 mr-1.5">{idx + 1}.</span>
                    {sec.label}
                  </a>
                ))}
              </nav>
            </div>
          </aside>

          {/* Privacy Articles */}
          <article className="space-y-10 text-sm leading-relaxed text-slate-700 dark:text-slate-300 sm:text-base">
            {/* 1 */}
            <section id="intro" className="scroll-mt-28 rounded-2xl border border-black/[0.06] bg-white p-6 shadow-sm dark:border-white/10 dark:bg-white/[0.02] sm:p-8">
              <h2 className="font-poppins text-xl font-bold text-slate-900 dark:text-white sm:text-2xl">
                1. Introduction &amp; Scope
              </h2>
              <p className="mt-4">
                This Privacy Policy explains what personal data Hammet Limited collects through our web applications, 
                learning management systems, mobile apps, and developer portals, why we collect it, how it is safeguarded, 
                and the rights you hold over your data.
              </p>
              <p className="mt-3">
                This Policy is drafted to comply with Nigeria&apos;s Data Protection Act 2023 (&quot;NDPA&quot;) and its General 
                Application and Implementation Directive, as well as the EU/UK General Data Protection Regulation (&quot;GDPR&quot;) 
                and the California Consumer Privacy Act (&quot;CCPA&quot;) for international learners.
              </p>
            </section>

            {/* 2 */}
            <section id="collect" className="scroll-mt-28 rounded-2xl border border-black/[0.06] bg-white p-6 shadow-sm dark:border-white/10 dark:bg-white/[0.02] sm:p-8">
              <h2 className="font-poppins text-xl font-bold text-slate-900 dark:text-white sm:text-2xl">
                2. Information We Collect
              </h2>
              <p className="mt-4">We collect information to deliver tailored learning experiences, assess module progress, and issue verified credentials:</p>
              
              <div className="mt-5 overflow-x-auto rounded-xl border border-black/[0.08] dark:border-white/10">
                <table className="w-full text-left text-xs sm:text-sm">
                  <thead className="border-b border-black/[0.08] bg-slate-50 font-bold uppercase tracking-wider text-slate-600 dark:border-white/10 dark:bg-white/[0.04] dark:text-slate-400">
                    <tr>
                      <th className="p-3 sm:p-4">Category</th>
                      <th className="p-3 sm:p-4">Examples of Data Collected</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-black/[0.06] dark:divide-white/[0.06]">
                    <tr>
                      <td className="p-3 font-semibold text-slate-900 dark:text-white sm:p-4">Account Profile</td>
                      <td className="p-3 sm:p-4">Full name, username, email address, hashed password, avatar photo, bio.</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-semibold text-slate-900 dark:text-white sm:p-4">Learning Telemetry</td>
                      <td className="p-3 sm:p-4">Enrolled tracks, module milestones, lab completion times, quiz scores, project commits.</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-semibold text-slate-900 dark:text-white sm:p-4">Billing &amp; Transactions</td>
                      <td className="p-3 sm:p-4">Invoice IDs, transaction receipts, payment method tokens (raw card numbers are handled securely by PCI-compliant payment gateways).</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-semibold text-slate-900 dark:text-white sm:p-4">Device &amp; Session</td>
                      <td className="p-3 sm:p-4">IP address, browser type, operating system, device identifiers, and platform access logs.</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            {/* 3 */}
            <section id="use" className="scroll-mt-28 rounded-2xl border border-black/[0.06] bg-white p-6 shadow-sm dark:border-white/10 dark:bg-white/[0.02] sm:p-8">
              <h2 className="font-poppins text-xl font-bold text-slate-900 dark:text-white sm:text-2xl">
                3. How We Use Your Information
              </h2>
              <ul className="mt-4 list-disc space-y-2 pl-5">
                <li>To initialize accounts, authenticate users, and manage course enrollments.</li>
                <li>To evaluate coding assessments, track streaks, and issue digital completion credentials.</li>
                <li>To provide responsive technical support and communicate vital cohort announcements.</li>
                <li>To detect fraud, safeguard learning sandboxes, and maintain platform security.</li>
                <li>To generate aggregated, anonymized insights for educational curriculum improvement.</li>
              </ul>
            </section>

            {/* 4 */}
            <section id="basis" className="scroll-mt-28 rounded-2xl border border-black/[0.06] bg-white p-6 shadow-sm dark:border-white/10 dark:bg-white/[0.02] sm:p-8">
              <h2 className="font-poppins text-xl font-bold text-slate-900 dark:text-white sm:text-2xl">
                4. Legal Basis for Processing
              </h2>
              <p className="mt-4">
                Under NDPA and GDPR, we process personal data under designated legal grounds:
              </p>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <div className="rounded-xl border border-purple-500/20 bg-purple-500/5 p-4 dark:border-purple-400/20">
                  <h4 className="font-bold text-purple-950 dark:text-purple-300">Contractual Performance</h4>
                  <p className="mt-1 text-xs">Delivering the learning courses, projects, and certifications you registered to receive.</p>
                </div>
                <div className="rounded-xl border border-cyan-500/20 bg-cyan-500/5 p-4 dark:border-cyan-400/20">
                  <h4 className="font-bold text-cyan-950 dark:text-cyan-300">Legitimate Interests</h4>
                  <p className="mt-1 text-xs">Protecting the integrity of assessments and continually upgrading academy tools.</p>
                </div>
              </div>
            </section>

            {/* 5 */}
            <section id="cookies" className="scroll-mt-28 rounded-2xl border border-black/[0.06] bg-white p-6 shadow-sm dark:border-white/10 dark:bg-white/[0.02] sm:p-8">
              <h2 className="font-poppins text-xl font-bold text-slate-900 dark:text-white sm:text-2xl">
                5. Cookies &amp; Local Storage
              </h2>
              <p className="mt-4">
                We use strictly necessary cookies and browser local storage to maintain authenticated sessions, 
                remember your dark/light theme preference, and cache active learning progress. You can control 
                non-essential tracking through your browser settings.
              </p>
            </section>

            {/* 6 */}
            <section id="share" className="scroll-mt-28 rounded-2xl border border-black/[0.06] bg-white p-6 shadow-sm dark:border-white/10 dark:bg-white/[0.02] sm:p-8">
              <h2 className="font-poppins text-xl font-bold text-slate-900 dark:text-white sm:text-2xl">
                6. Data Sharing &amp; Third Parties
              </h2>
              <p className="mt-4">
                <strong>We never sell your personal data.</strong> Information is shared only with verified infrastructure 
                partners bound by strict confidentiality and data protection agreements:
              </p>
              <ul className="mt-3 list-disc space-y-2 pl-5">
                <li>Cloud hosting &amp; database providers (AWS, Supabase).</li>
                <li>PCI-DSS compliant payment gateways (Paystack, Stripe).</li>
                <li>Institutional partners (when you join via an employer or university license).</li>
                <li>Legal compliance bodies when mandated by court orders or active law enforcement investigations.</li>
              </ul>
            </section>

            {/* 7 */}
            <section id="retention" className="scroll-mt-28 rounded-2xl border border-black/[0.06] bg-white p-6 shadow-sm dark:border-white/10 dark:bg-white/[0.02] sm:p-8">
              <h2 className="font-poppins text-xl font-bold text-slate-900 dark:text-white sm:text-2xl">
                7. Data Retention
              </h2>
              <p className="mt-4">
                Your data is retained for the lifetime of your active student account. You may request account deletion at 
                any time via your profile settings. Verified certificate hashes are retained permanently to ensure third-party 
                employers can authenticate your earned credentials upon request.
              </p>
            </section>

            {/* 8 */}
            <section id="security" className="scroll-mt-28 rounded-2xl border border-black/[0.06] bg-white p-6 shadow-sm dark:border-white/10 dark:bg-white/[0.02] sm:p-8">
              <h2 className="font-poppins text-xl font-bold text-slate-900 dark:text-white sm:text-2xl">
                8. Security &amp; Data Safeguards
              </h2>
              <p className="mt-4">
                We implement industry-standard technical and organizational security measures, including TLS 1.3 encryption 
                in transit, AES-256 encryption at rest, regular vulnerability scans, and strict role-based access control (RBAC). 
                In the event of a security breach affecting your data, we will notify regulators and impacted users in compliance with NDPA timelines.
              </p>
            </section>

            {/* 9 */}
            <section id="rights" className="scroll-mt-28 rounded-2xl border border-black/[0.06] bg-white p-6 shadow-sm dark:border-white/10 dark:bg-white/[0.02] sm:p-8">
              <h2 className="font-poppins text-xl font-bold text-slate-900 dark:text-white sm:text-2xl">
                9. Your Privacy Rights
              </h2>
              <p className="mt-4">Depending on your jurisdiction, you enjoy the following enforceable rights:</p>
              <ul className="mt-3 list-disc space-y-2 pl-5">
                <li><strong>Right of Access:</strong> Request a complete copy of personal records held by Hammet.</li>
                <li><strong>Right to Rectification:</strong> Correct inaccurate or outdated profile details.</li>
                <li><strong>Right to Erasure (&quot;Right to be Forgotten&quot;):</strong> Request complete purging of your personal records.</li>
                <li><strong>Right to Data Portability:</strong> Export your course achievements and code projects in structured formats.</li>
                <li><strong>Right to Object:</strong> Opt out of marketing emails or analytics tracking at any time.</li>
              </ul>
              <p className="mt-4">
                To exercise any of these rights, email our compliance team at <a href="mailto:privacy@hammetedu.com" className="text-purple-600 underline dark:text-cyan-400">privacy@hammetedu.com</a>. Requests are fulfilled within 30 calendar days.
              </p>
            </section>

            {/* 10 */}
            <section id="children" className="scroll-mt-28 rounded-2xl border border-black/[0.06] bg-white p-6 shadow-sm dark:border-white/10 dark:bg-white/[0.02] sm:p-8">
              <h2 className="font-poppins text-xl font-bold text-slate-900 dark:text-white sm:text-2xl">
                10. Children&apos;s Privacy
              </h2>
              <p className="mt-4">
                Hammet does not knowingly solicit or collect personal data from children under 13 without verifiable parental 
                consent. If you believe a minor has registered without appropriate authorization, contact us immediately to remove 
                the associated profile.
              </p>
            </section>

            {/* 11 */}
            <section id="transfers" className="scroll-mt-28 rounded-2xl border border-black/[0.06] bg-white p-6 shadow-sm dark:border-white/10 dark:bg-white/[0.02] sm:p-8">
              <h2 className="font-poppins text-xl font-bold text-slate-900 dark:text-white sm:text-2xl">
                11. Cross-Border Data Transfers
              </h2>
              <p className="mt-4">
                Given our global cloud infrastructure, your information may be processed in secure data centers located in 
                Nigeria, Europe, or the United States. Cross-border transfers adhere to standard contractual clauses (SCCs) 
                and NDPC adequacy guidelines to ensure uniform protection.
              </p>
            </section>

            {/* 12 */}
            <section id="ai" className="scroll-mt-28 rounded-2xl border border-black/[0.06] bg-white p-6 shadow-sm dark:border-white/10 dark:bg-white/[0.02] sm:p-8">
              <h2 className="font-poppins text-xl font-bold text-slate-900 dark:text-white sm:text-2xl">
                12. AI Features &amp; Data Governance
              </h2>
              <p className="mt-4">
                When interacting with Hammet AI tutors or automated code reviewers, your prompts and code submissions are processed 
                to generate real-time feedback. <strong>We do not use your proprietary project code or personal data to train public foundation models without your express opt-in.</strong>
              </p>
            </section>

            {/* 13 */}
            <section id="changes" className="scroll-mt-28 rounded-2xl border border-black/[0.06] bg-white p-6 shadow-sm dark:border-white/10 dark:bg-white/[0.02] sm:p-8">
              <h2 className="font-poppins text-xl font-bold text-slate-900 dark:text-white sm:text-2xl">
                13. Changes to this Policy
              </h2>
              <p className="mt-4">
                We may periodically update this policy to reflect new product features or statutory regulations. 
                Material changes will be highlighted via in-app banners or email notifications prior to enforcement.
              </p>
            </section>

            {/* 14 */}
            <section id="contact" className="scroll-mt-28 rounded-2xl border border-black/[0.06] bg-white p-6 shadow-sm dark:border-white/10 dark:bg-white/[0.02] sm:p-8">
              <h2 className="font-poppins text-xl font-bold text-slate-900 dark:text-white sm:text-2xl">
                14. Contact &amp; Data Protection Officer
              </h2>
              <p className="mt-4">
                For questions, complaints, or data deletion requests, contact our designated Data Protection Officer:
              </p>
              <div className="mt-4 space-y-1 rounded-xl bg-slate-100 p-4 font-mono text-xs dark:bg-white/[0.04]">
                <p><strong>DPO Office:</strong> dpo@hammetedu.com</p>
                <p><strong>General Support:</strong> hammetedu@gmail.com / admin@hammetlabs.com</p>
                <p><strong>Telephone:</strong> +234 704 057 6412</p>
                <p><strong>Address:</strong> Hammet Limited, Lagos, Nigeria</p>
              </div>
            </section>
          </article>
        </div>

        {/* Footer */}
        <footer className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-black/[0.06] pt-8 text-xs text-slate-500 dark:border-white/10 dark:text-slate-400 sm:flex-row">
          <div className="flex gap-4">
            <Link href="/privacy" className="font-semibold text-slate-800 dark:text-slate-200 hover:text-purple-600 dark:hover:text-cyan-400">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-purple-600 dark:hover:text-cyan-400">Terms of Service</Link>
          </div>
          <p>© {new Date().getFullYear()} Hammet Limited. All rights reserved.</p>
        </footer>
      </div>
    </main>
  );
}