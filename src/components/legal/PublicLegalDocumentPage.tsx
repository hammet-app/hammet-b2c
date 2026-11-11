import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { ApiError } from "@/lib/api/api-client";
import { legalApi } from "@/lib/api/legal";
import type { PublicLegalDocument, PublicLegalDocumentType } from "@/lib/api/types/legal";
import { LegalHtmlContent } from "@/components/legal/LegalHtmlContent";

const navigation = [
  { href: "/privacy", label: "Privacy" },
  { href: "/terms", label: "Terms" },
  { href: "/cookies", label: "Cookies" },
];

export async function PublicLegalDocumentPage({
  documentType,
  title,
  description,
}: {
  documentType: PublicLegalDocumentType;
  title: string;
  description: string;
}) {
  let document: PublicLegalDocument;
  try {
    document = await legalApi.getPublishedDocument(documentType, "b2c");
  } catch (error) {
    if (error instanceof ApiError && error.notFound) notFound();
    throw error;
  }

  return (
    <main className="min-h-screen bg-slate-50 text-slate-800 dark:bg-[#0B0813] dark:text-slate-200">
      <header className="sticky top-0 z-40 border-b border-black/[0.08] bg-white/90 backdrop-blur-md dark:border-white/10 dark:bg-[#0B0813]/90">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-5 py-3.5 sm:px-8">
          <Link href="/" className="flex items-center gap-2.5">
            <Image src="/icon-512x512.png" alt="Hammet" width={28} height={28} className="rounded-lg" />
            <span className="font-poppins text-lg font-black tracking-tight text-slate-900 dark:text-white">
              Hammet <span className="text-purple-600 dark:text-purple-400">Academy</span>
            </span>
          </Link>
          <nav aria-label="Legal documents" className="flex items-center gap-3 sm:gap-5">
            {navigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-xs font-semibold text-slate-600 transition hover:text-purple-700 dark:text-slate-300 dark:hover:text-purple-300 sm:text-sm"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </header>

      <div className="mx-auto max-w-5xl px-5 py-10 sm:px-8 lg:py-14">
        <section className="rounded-3xl border border-black/[0.08] bg-white p-7 shadow-sm dark:border-white/10 dark:bg-[#140F22] sm:p-10">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-purple-700 dark:text-purple-300">
            Hammet legal
          </p>
          <h1 className="mt-3 text-3xl font-black tracking-tight text-slate-950 dark:text-white sm:text-4xl">
            {title}
          </h1>
          <p className="mt-3 max-w-3xl text-sm leading-relaxed text-slate-600 dark:text-slate-400 sm:text-base">
            {description}
          </p>
          <p className="mt-5 text-xs text-slate-500 dark:text-slate-400">
            Version {document.version} · Updated {new Date(document.updatedAt).toLocaleDateString("en", { year: "numeric", month: "long", day: "numeric", timeZone: "UTC" })}
          </p>
        </section>

        <section className="mt-6 rounded-3xl border border-black/[0.08] bg-white p-7 shadow-sm dark:border-white/10 dark:bg-[#140F22] sm:p-10">
          <LegalHtmlContent content={document.content} />
        </section>

        <div className="mt-8">
          <Link href="/" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-purple-700 dark:text-slate-300 dark:hover:text-purple-300">
            <ArrowLeft className="h-4 w-4" /> Back to Hammet
          </Link>
        </div>
      </div>
    </main>
  );
}
