"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Shield, FileText, Scale, ArrowUpRight, CheckCircle2 } from "lucide-react";

const sections = [
  { id: "acceptance", label: "Acceptance of Terms" },
  { id: "eligibility", label: "Eligibility & Accounts" },
  { id: "enrollment", label: "Academy & Courses" },
  { id: "billing", label: "Payments & Refunds" },
  { id: "ip", label: "Intellectual Property" },
  { id: "conduct", label: "Acceptable Use Policy" },
  { id: "ai", label: "AI Features & Outputs" },
  { id: "credentials", label: "Passports & Certificates" },
  { id: "liability", label: "Limitation of Liability" },
  { id: "termination", label: "Termination" },
  { id: "governing", label: "Governing Law" },
  { id: "contact", label: "Contact Information" },
];

export default function TermsAndConditionsPage() {
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
              href="/privacy"
              className="text-xs font-semibold text-slate-600 transition hover:text-purple-600 dark:text-slate-400 dark:hover:text-cyan-400 sm:text-sm"
            >
              Privacy Policy
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
        {/* Header Hero */}
        <div className="rounded-3xl border border-black/[0.06] bg-white p-7 shadow-sm dark:border-white/10 dark:bg-white/[0.02] sm:p-10">
          <div className="inline-flex items-center gap-2 rounded-full border border-purple-500/20 bg-purple-500/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-purple-700 dark:text-purple-300">
            <Scale className="h-3.5 w-3.5" />
            <span>Legal Agreement</span>
          </div>

          <h1 className="mt-4 font-poppins text-3xl font-black tracking-tight text-slate-950 sm:text-4xl lg:text-5xl dark:text-white">
            Terms &amp; Conditions
          </h1>

          <p className="mt-3 max-w-3xl text-sm leading-relaxed text-slate-600 sm:text-base dark:text-slate-400">
            Welcome to Hammet. These Terms of Service govern your access to and use of Hammet AI Academy, 
            our learning portals, AI developer sandboxes, passport credential systems, and related services.
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 border-t border-black/[0.06] pt-5 text-xs text-slate-500 dark:border-white/10 dark:text-slate-400">
            <span><strong>Effective Date:</strong> October 2026</span>
            <span>•</span>
            <span><strong>Entity:</strong> Hammet Limited</span>
            <span>•</span>
            <span><strong>Applies to:</strong> All web &amp; mobile learners</span>
          </div>
        </div>

        {/* Layout Grid: Sticky TOC on Desktop + Content */}
        <div className="mt-10 grid gap-10 lg:grid-cols-[260px_1fr]">
          {/* Table of Contents */}
          <aside className="hidden lg:block">
            <div className="sticky top-24 rounded-2xl border border-black/[0.06] bg-white p-5 shadow-sm dark:border-white/10 dark:bg-white/[0.02]">
              <h3 className="mb-3 font-poppins text-xs font-black uppercase tracking-wider text-slate-400 dark:text-slate-500">
                Quick Navigation
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

          {/* Legal Content Body */}
          <article className="space-y-10 text-sm leading-relaxed text-slate-700 dark:text-slate-300 sm:text-base">
            {/* 1. Acceptance */}
            <section id="acceptance" className="scroll-mt-28 rounded-2xl border border-black/[0.06] bg-white p-6 shadow-sm dark:border-white/10 dark:bg-white/[0.02] sm:p-8">
              <h2 className="font-poppins text-xl font-bold text-slate-900 dark:text-white sm:text-2xl">
                1. Acceptance of Terms
              </h2>
              <p className="mt-4">
                By creating an account, browsing the Hammet website, purchasing courses or AI school access, 
                or using any Hammet features, you agree to be bound by these Terms and Conditions (&quot;Terms&quot;) 
                and our Privacy Policy. If you do not agree to these Terms, you may not access or use Hammet.
              </p>
              <p className="mt-3">
                These Terms apply to all visitors, registered learners, enterprise trainees, and partners. 
                Additional terms may apply to specific programs, cohorts, or specialized certifications.
              </p>
            </section>

            {/* 2. Eligibility & Accounts */}
            <section id="eligibility" className="scroll-mt-28 rounded-2xl border border-black/[0.06] bg-white p-6 shadow-sm dark:border-white/10 dark:bg-white/[0.02] sm:p-8">
              <h2 className="font-poppins text-xl font-bold text-slate-900 dark:text-white sm:text-2xl">
                2. Eligibility &amp; Account Security
              </h2>
              <ul className="mt-4 list-disc space-y-2.5 pl-5">
                <li>
                  <strong>Minimum Age:</strong> You must be at least 13 years of age (or 18 where required by local law) 
                  to create a student account. Minors must have verifiable parental or guardian consent.
                </li>
                <li>
                  <strong>Accurate Information:</strong> You must provide truthful, current, and complete registration data. 
                  Impersonating individuals or organizations is strictly prohibited.
                </li>
                <li>
                  <strong>Account Security:</strong> You are responsible for safeguarding your login credentials. 
                  Notify us immediately at <a href="mailto:support@hammetedu.com" className="text-purple-600 underline dark:text-cyan-400">support@hammetedu.com</a> if you suspect unauthorized access.
                </li>
              </ul>
            </section>

            {/* 3. Academy Enrollment & Courses */}
            <section id="enrollment" className="scroll-mt-28 rounded-2xl border border-black/[0.06] bg-white p-6 shadow-sm dark:border-white/10 dark:bg-white/[0.02] sm:p-8">
              <h2 className="font-poppins text-xl font-bold text-slate-900 dark:text-white sm:text-2xl">
                3. Academy Enrollment &amp; Course Access
              </h2>
              <p className="mt-4">
                Hammet grants you a personal, non-exclusive, non-transferable license to access enrolled courses, 
                interactive code playgrounds, and video modules for individual educational purposes.
              </p>
              <div className="mt-4 rounded-xl bg-purple-500/10 p-4 border border-purple-500/20 text-purple-900 dark:text-purple-200">
                <strong>Course Prerequisites:</strong> Non-free schools and specialty tracks require completed payment 
                before course modules, laboratory sandboxes, and cohort materials unlock.
              </div>
            </section>

            {/* 4. Payments, Subscriptions & Refunds */}
            <section id="billing" className="scroll-mt-28 rounded-2xl border border-black/[0.06] bg-white p-6 shadow-sm dark:border-white/10 dark:bg-white/[0.02] sm:p-8">
              <h2 className="font-poppins text-xl font-bold text-slate-900 dark:text-white sm:text-2xl">
                4. Payments, Subscriptions &amp; Refund Policy
              </h2>
              <ul className="mt-4 list-disc space-y-2.5 pl-5">
                <li>
                  <strong>Pricing &amp; Currencies:</strong> All prices for paid schools and individual courses are displayed 
                  at checkout in the stated local or international currency.
                </li>
                <li>
                  <strong>Payment Verification:</strong> Course access is granted upon confirmed electronic payment 
                  (card payment or verified direct bank transfer).
                </li>
                <li>
                  <strong>Refunds:</strong> Learners may request a refund within 7 days of course purchase if less than 
                  20% of modules have been completed. Cohort-based live bootcamps may have program-specific withdrawal dates.
                </li>
              </ul>
            </section>

            {/* 5. Intellectual Property */}
            <section id="ip" className="scroll-mt-28 rounded-2xl border border-black/[0.06] bg-white p-6 shadow-sm dark:border-white/10 dark:bg-white/[0.02] sm:p-8">
              <h2 className="font-poppins text-xl font-bold text-slate-900 dark:text-white sm:text-2xl">
                5. Intellectual Property Rights
              </h2>
              <p className="mt-4">
                All curriculum materials, lecture slides, diagrams, proprietary assessment rubrics, software assets, 
                and branding are the exclusive property of Hammet Limited or its licensors.
              </p>
              <p className="mt-3">
                You may not record, redistribute, republish, scrape, or resell Hammet course content or code libraries 
                without express written permission from Hammet.
              </p>
            </section>

            {/* 6. Acceptable Use Policy */}
            <section id="conduct" className="scroll-mt-28 rounded-2xl border border-black/[0.06] bg-white p-6 shadow-sm dark:border-white/10 dark:bg-white/[0.02] sm:p-8">
              <h2 className="font-poppins text-xl font-bold text-slate-900 dark:text-white sm:text-2xl">
                6. Acceptable Use &amp; Learner Code of Conduct
              </h2>
              <p className="mt-4">When using Hammet discussion boards, project review portals, and code playgrounds, you agree NOT to:</p>
              <ul className="mt-3 list-disc space-y-2 pl-5">
                <li>Harass, abuse, defame, or discriminate against other learners, mentors, or instructors.</li>
                <li>Upload malicious code, exploits, or viruses to interactive developer workspaces.</li>
                <li>Submit plagiarized capstone projects or engage in academic dishonesty on verified assessments.</li>
                <li>Attempt to bypass rate limits or reverse engineer the Hammet platform infrastructure.</li>
              </ul>
            </section>

            {/* 7. AI Features & Machine-Generated Outputs */}
            <section id="ai" className="scroll-mt-28 rounded-2xl border border-black/[0.06] bg-white p-6 shadow-sm dark:border-white/10 dark:bg-white/[0.02] sm:p-8">
              <h2 className="font-poppins text-xl font-bold text-slate-900 dark:text-white sm:text-2xl">
                7. AI Features &amp; Generated Content
              </h2>
              <p className="mt-4">
                Hammet includes AI-powered tutoring agents, automated code feedback engines, and assessment summarizers. 
                While we strive for high precision, AI models may occasionally produce incomplete or inaccurate outputs. 
                Learners are encouraged to critically verify AI feedback when building production-grade software.
              </p>
            </section>

            {/* 8. Passports, Verifiable Certificates & Credentials */}
            <section id="credentials" className="scroll-mt-28 rounded-2xl border border-black/[0.06] bg-white p-6 shadow-sm dark:border-white/10 dark:bg-white/[0.02] sm:p-8">
              <h2 className="font-poppins text-xl font-bold text-slate-900 dark:text-white sm:text-2xl">
                8. Digital Passports &amp; Verified Certificates
              </h2>
              <p className="mt-4">
                Learners who fulfill grading requirements and capstone projects receive tamper-resistant digital certificates 
                and verified skills records on their Hammet Digital Passport. Certificates remain verifiable as long as the 
                underlying learner account complies with our academic integrity standards.
              </p>
            </section>

            {/* 9. Limitation of Liability */}
            <section id="liability" className="scroll-mt-28 rounded-2xl border border-black/[0.06] bg-white p-6 shadow-sm dark:border-white/10 dark:bg-white/[0.02] sm:p-8">
              <h2 className="font-poppins text-xl font-bold text-slate-900 dark:text-white sm:text-2xl">
                9. Limitation of Liability
              </h2>
              <p className="mt-4">
                To the maximum extent permitted by applicable law, Hammet Limited shall not be liable for any indirect, 
                incidental, special, consequential, or punitive damages, including loss of profits, data, or career opportunities, 
                arising out of your use of or inability to use the Service.
              </p>
            </section>

            {/* 10. Termination */}
            <section id="termination" className="scroll-mt-28 rounded-2xl border border-black/[0.06] bg-white p-6 shadow-sm dark:border-white/10 dark:bg-white/[0.02] sm:p-8">
              <h2 className="font-poppins text-xl font-bold text-slate-900 dark:text-white sm:text-2xl">
                10. Termination &amp; Suspension
              </h2>
              <p className="mt-4">
                We reserve the right to suspend or terminate your account at any time for violation of these Terms, academic fraud, 
                or unauthorized platform disruption, without prior notice or liability. You may close your account at any time via 
                the Settings page.
              </p>
            </section>

            {/* 11. Governing Law */}
            <section id="governing" className="scroll-mt-28 rounded-2xl border border-black/[0.06] bg-white p-6 shadow-sm dark:border-white/10 dark:bg-white/[0.02] sm:p-8">
              <h2 className="font-poppins text-xl font-bold text-slate-900 dark:text-white sm:text-2xl">
                11. Governing Law &amp; Dispute Resolution
              </h2>
              <p className="mt-4">
                These Terms shall be governed by and construed in accordance with the laws of the Federal Republic of Nigeria, 
                without regard to conflict of law principles. Any dispute arising under these Terms shall be resolved first 
                through good-faith mediation before formal legal proceedings.
              </p>
            </section>

            {/* 12. Contact */}
            <section id="contact" className="scroll-mt-28 rounded-2xl border border-black/[0.06] bg-white p-6 shadow-sm dark:border-white/10 dark:bg-white/[0.02] sm:p-8">
              <h2 className="font-poppins text-xl font-bold text-slate-900 dark:text-white sm:text-2xl">
                12. Contact Us
              </h2>
              <p className="mt-4">
                For legal inquiries, terms clarification, or notices, please reach out to our legal department:
              </p>
              <div className="mt-4 space-y-1 rounded-xl bg-slate-100 p-4 font-mono text-xs dark:bg-white/[0.04]">
                <p><strong>Email:</strong> legal@hammetedu.com / hammetedu@gmail.com</p>
                <p><strong>Entity:</strong> Hammet Limited</p>
                <p><strong>Address:</strong> Lagos, Nigeria</p>
              </div>
            </section>
          </article>
        </div>

        {/* Footer */}
        <footer className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-black/[0.06] pt-8 text-xs text-slate-500 dark:border-white/10 dark:text-slate-400 sm:flex-row">
          <div className="flex gap-4">
            <Link href="/privacy" className="hover:text-purple-600 dark:hover:text-cyan-400">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-purple-600 dark:hover:text-cyan-400 font-semibold text-slate-800 dark:text-slate-200">Terms of Service</Link>
          </div>
          <p>© {new Date().getFullYear()} Hammet Limited. All rights reserved.</p>
        </footer>
      </div>
    </main>
  );
}

