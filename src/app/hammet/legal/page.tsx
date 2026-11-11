"use client";

import { useCallback, useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import { ArrowLeft, FileText, Plus, Scale, X } from "lucide-react";
import { LegalRichTextEditor } from "@/components/hammet/LegalRichTextEditor";
import { SessionExpiredNotice } from "@/components/hammet/admin-form";
import { useAuth } from "@/lib/auth/auth-context";
import {
  createHammetLegalDocument,
  getHammetLegalDocument,
  getHammetLegalDocuments,
  patchHammetLegalDocument,
} from "@/lib/api/hammet";
import type {
  CreateLegalDocumentRequest,
  LegalDocument,
  LegalDocumentStatus,
  LegalDocumentType,
  LegalDomain,
} from "@/lib/api/types";
import { canManageLegal } from "@/lib/utils/roles";
import { sanitizeLegalHtml } from "@/lib/legal-html";

const documentTypes: { value: LegalDocumentType; label: string }[] = [
  { value: "cookie_policy", label: "Cookie policy" },
  { value: "privacy_policy", label: "Privacy policy" },
  { value: "terms_and_conditions", label: "Terms and conditions" },
];

const statusStyles: Record<LegalDocumentStatus, string> = {
  draft: "bg-slate-100 text-slate-700 dark:bg-white/[0.08] dark:text-slate-300",
  review: "bg-amber-100 text-amber-800 dark:bg-amber-400/10 dark:text-amber-200",
  published: "bg-emerald-100 text-emerald-800 dark:bg-emerald-400/10 dark:text-emerald-200",
};

export default function LegalDocumentsPage() {
  const { user, accessToken, refreshToken, isLoading: authLoading } = useAuth();
  const canManage = canManageLegal(user);
  const canChooseDomain = user?.scope === "platform";
  const [domain, setDomain] = useState<LegalDomain>("b2c");
  const [documents, setDocuments] = useState<LegalDocument[]>([]);
  const [selected, setSelected] = useState<LegalDocument | null>(null);
  const [content, setContent] = useState("");
  const [documentType, setDocumentType] = useState<LegalDocumentType>("privacy_policy");
  const [variation, setVariation] = useState("");
  const [statusFilter, setStatusFilter] = useState<LegalDocumentStatus | "all">("all");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [isNew, setIsNew] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  const loadDocuments = useCallback(async () => {
    if (!accessToken || !canManage) return;
    setLoading(true);
    setError("");
    try {
      const result = await getHammetLegalDocuments(
        { domain, status: statusFilter === "all" ? undefined : statusFilter },
        accessToken,
        refreshToken ?? (async () => null),
      );
      setDocuments(result.documents);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to load legal documents.");
    } finally {
      setLoading(false);
    }
  }, [accessToken, canManage, domain, refreshToken, statusFilter]);

  useEffect(() => {
    const timer = window.setTimeout(() => { void loadDocuments(); }, 0);
    return () => window.clearTimeout(timer);
  }, [loadDocuments]);

  const visibleDocuments = documents;

  async function openDocument(documentId: string) {
    if (!accessToken) return;
    setIsNew(false);
    setSaving(true);
    setError("");
    try {
      const document = await getHammetLegalDocument(documentId, accessToken, refreshToken ?? (async () => null));
      setSelected(document);
      setContent(document.content);
      setDomain(document.domain);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to load this document.");
    } finally {
      setSaving(false);
    }
  }

  function startNew() {
    setSelected(null);
    setContent("");
    setDocumentType("privacy_policy");
    setVariation("");
    setIsNew(true);
    setNotice("");
    setError("");
  }

  async function handleCreate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!accessToken || !hasContent(content)) {
      setError("Add document content before saving the draft.");
      return;
    }
    setSaving(true);
    setError("");
    setNotice("");
    try {
      const payload: CreateLegalDocumentRequest = {
        documentType,
        domain: user?.scope === "b2c" ? "b2c" : domain,
        variation: variation.trim() || null,
        content,
      };
      const created = await createHammetLegalDocument(payload, accessToken, refreshToken ?? (async () => null));
      setSelected(created);
      setContent(created.content);
      setIsNew(false);
      setNotice("Draft created.");
      await loadDocuments();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to create the draft.");
    } finally {
      setSaving(false);
    }
  }

  async function saveContent(): Promise<LegalDocument | null> {
    if (!accessToken || !selected) return null;
    if (content === selected.content) return selected;
    const saved = await patchHammetLegalDocument(selected.id, { content }, accessToken, refreshToken ?? (async () => null));
    setSelected(saved);
    setContent(saved.content);
    await loadDocuments();
    return saved;
  }

  async function handleSave(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isNew) return handleCreate(event);
    if (!selected || !accessToken) return;
    setSaving(true);
    setError("");
    setNotice("");
    try {
      const saved = await saveContent();
      if (saved && saved.id !== selected.id) {
        setNotice(`Revision saved as version ${saved.version} draft.`);
      } else {
        setNotice("Changes saved.");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to save changes.");
    } finally {
      setSaving(false);
    }
  }

  async function transition(status: LegalDocumentStatus) {
    if (!selected || !accessToken) return;
    setSaving(true);
    setError("");
    setNotice("");
    try {
      let current = selected;
      if (content !== selected.content) {
        current = await patchHammetLegalDocument(selected.id, { content }, accessToken, refreshToken ?? (async () => null));
        setSelected(current);
        setContent(current.content);
        await loadDocuments();
        if (current.status !== selected.status) {
          setNotice(selected.status === "published"
            ? `Revision saved as version ${current.version} draft. Submit it for review when ready.`
            : "Content was saved as a draft. Submit it for review again when ready.");
          return;
        }
      }
      const updated = await patchHammetLegalDocument(current.id, { status }, accessToken, refreshToken ?? (async () => null));
      setSelected(updated);
      setContent(updated.content);
      setNotice(status === "review" ? "Submitted for review." : status === "published" ? "Document published." : "Returned to draft.");
      await loadDocuments();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to update document status.");
    } finally {
      setSaving(false);
    }
  }

  if (!authLoading && !accessToken) return <SessionExpiredNotice />;
  if (!authLoading && !canManage) {
    return <AccessNotice />;
  }

  return (
    <main className="px-5 pb-28 pt-8 sm:px-7 sm:pt-10 lg:px-10 lg:pb-12 lg:pt-10">
      <div className="mx-auto max-w-[1400px]">
        <header className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <Link href="/hammet" className="mb-4 inline-flex items-center gap-2 text-sm text-slate-500 hover:text-purple-700 dark:text-slate-400 dark:hover:text-cyan-400"><ArrowLeft className="h-4 w-4" />Dashboard</Link>
            <p className="mb-2 text-sm font-medium text-purple-600 dark:text-cyan-400">B2C management</p>
            <h1 className="text-3xl font-semibold tracking-[-0.04em] sm:text-4xl">Legal documents</h1>
            <p className="mt-2 max-w-2xl text-sm text-slate-500 dark:text-slate-400">Create and review policies with preserved rich text formatting.</p>
          </div>
          <button type="button" onClick={startNew} className="inline-flex items-center gap-2 rounded-xl bg-[#24134F] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#321b68] dark:bg-cyan-400 dark:text-[#24134F]"><Plus className="h-4 w-4" />New document</button>
        </header>

        {notice && <div role="status" className="mb-5 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800 dark:border-emerald-400/20 dark:bg-emerald-400/10 dark:text-emerald-200">{notice}</div>}
        {error && <div role="alert" className="mb-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800 dark:border-red-400/20 dark:bg-red-400/10 dark:text-red-200">{error}</div>}

        <div className="grid items-start gap-6 xl:grid-cols-[minmax(280px,0.72fr)_minmax(0,1.6fr)]">
          <section className="overflow-hidden rounded-[24px] border border-black/[0.06] bg-white dark:border-white/[0.06] dark:bg-white/[0.03]">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-black/[0.06] p-5 dark:border-white/[0.06]">
              <div><h2 className="font-semibold">Documents</h2><p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{visibleDocuments.length} shown</p></div>
              <select aria-label="Filter by status" value={statusFilter} onChange={(event) => { setStatusFilter(event.target.value as LegalDocumentStatus | "all"); setSelected(null); setIsNew(false); }} className="rounded-lg border border-black/[0.08] bg-white px-2.5 py-2 text-xs dark:border-white/[0.08] dark:bg-[#15111f]">
                <option value="all">All statuses</option><option value="draft">Draft</option><option value="review">In review</option><option value="published">Published</option>
              </select>
            </div>
            {canChooseDomain && <div className="border-b border-black/[0.06] px-5 py-3 dark:border-white/[0.06]"><label className="flex items-center gap-3 text-xs font-medium text-slate-500 dark:text-slate-400"><span>Domain</span><select value={domain} onChange={(event) => { setDomain(event.target.value as LegalDomain); setSelected(null); setIsNew(false); }} className="rounded-lg border border-black/[0.08] bg-white px-2.5 py-2 text-sm text-slate-800 dark:border-white/[0.08] dark:bg-[#15111f] dark:text-white"><option value="b2c">B2C</option><option value="b2b">B2B</option></select></label></div>}
            {loading ? <div className="space-y-3 p-5">{Array.from({ length: 4 }, (_, index) => <div key={index} className="h-[72px] animate-pulse rounded-xl bg-purple-50 dark:bg-white/[0.04]" />)}</div> : visibleDocuments.length ? <div className="divide-y divide-black/[0.06] dark:divide-white/[0.06]">{visibleDocuments.map((document) => <button key={document.id} type="button" onClick={() => void openDocument(document.id)} className={`block w-full p-5 text-left transition hover:bg-purple-50/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-purple-500 dark:hover:bg-white/[0.04] ${selected?.id === document.id ? "bg-purple-50/70 dark:bg-white/[0.05]" : ""}`}>
              <div className="flex items-start justify-between gap-3"><span className="font-medium">{labelForType(document.documentType)}</span><span className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-semibold capitalize ${statusStyles[document.status]}`}>{document.status}</span></div>
              <div className="mt-2 flex items-center justify-between gap-3 text-xs text-slate-500 dark:text-slate-400"><span>{document.variation || "Default variation"} · v{document.version}</span><span>{new Date(document.updatedAt).toLocaleDateString()}</span></div>
            </button>)}</div> : <div className="p-8 text-center"><FileText className="mx-auto h-8 w-8 text-slate-400" /><h3 className="mt-3 font-semibold">No documents found</h3><p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Create a draft to begin the review process.</p></div>}
          </section>

          {(isNew || selected) ? <form key={selected?.id ?? "new-legal"} onSubmit={handleSave} className="min-w-0 rounded-[24px] border border-black/[0.06] bg-white p-5 dark:border-white/[0.06] dark:bg-white/[0.03] sm:p-7">
            <div className="mb-6 flex flex-wrap items-start justify-between gap-3">
              <div><p className="text-xs font-semibold uppercase tracking-[0.12em] text-purple-600 dark:text-cyan-400">{isNew ? "New draft" : `Version ${selected?.version}`}</p><h2 className="mt-1 text-xl font-semibold">{isNew ? "Create legal document" : labelForType(selected!.documentType)}</h2><p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{isNew ? "Start with a document type, then add or paste the policy content." : "Edit the content or move this document through review."}</p></div>
              <button type="button" onClick={() => { setSelected(null); setIsNew(false); }} aria-label="Close editor" className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-white/[0.06]"><X className="h-4 w-4" /></button>
            </div>

            {isNew ? <div className="mb-5 grid gap-4 sm:grid-cols-2">
              <label className="block"><span className="mb-2 block text-sm font-medium">Document type</span><select value={documentType} onChange={(event) => setDocumentType(event.target.value as LegalDocumentType)} className={fieldClass}><option value="cookie_policy">Cookie policy</option><option value="privacy_policy">Privacy policy</option><option value="terms_and_conditions">Terms and conditions</option></select></label>
              {canChooseDomain && <label className="block"><span className="mb-2 block text-sm font-medium">Domain</span><select value={domain} onChange={(event) => setDomain(event.target.value as LegalDomain)} className={fieldClass}><option value="b2c">B2C</option><option value="b2b">B2B</option></select></label>}
              <label className="block sm:col-span-2"><span className="mb-2 block text-sm font-medium">Variation <span className="font-normal text-slate-500">(optional)</span></span><input maxLength={100} value={variation} onChange={(event) => setVariation(event.target.value)} className={fieldClass} placeholder="For example: Nigeria, UK, or a future product variant" /><span className="mt-1.5 block text-xs text-slate-500 dark:text-slate-400">Leave blank for the default B2C policy.</span></label>
            </div> : <div className="mb-5 flex flex-wrap gap-x-5 gap-y-2 rounded-xl bg-slate-50 px-4 py-3 text-xs text-slate-500 dark:bg-white/[0.04] dark:text-slate-400"><span>Domain: <strong className="font-medium text-slate-700 dark:text-slate-200">{selected?.domain.toUpperCase()}</strong></span><span>Variation: <strong className="font-medium text-slate-700 dark:text-slate-200">{selected?.variation || "Default"}</strong></span><span>Status: <strong className="font-medium capitalize text-slate-700 dark:text-slate-200">{selected?.status}</strong></span></div>}

            <LegalRichTextEditor key={selected?.id ?? "new-editor"} content={content} onChange={setContent} onPreview={() => setShowPreview(true)} />

            {!isNew && selected && <div className="mt-4 flex flex-wrap gap-x-5 gap-y-1 text-xs text-slate-500 dark:text-slate-400"><span>Created by: {shortId(selected.createdBy)}</span><span>Last edited by: {shortId(selected.updatedBy)}</span>{selected.reviewedBy && <span>Reviewed by: {shortId(selected.reviewedBy)}</span>}</div>}

            <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-black/[0.06] pt-5 dark:border-white/[0.06]">
              <div className="flex flex-wrap gap-2">
                {selected?.status === "draft" && <button type="button" disabled={saving} onClick={() => void transition("review")} className={secondaryButtonClass}>Submit for review</button>}
                {selected?.status === "review" && <><button type="button" disabled={saving} onClick={() => void transition("draft")} className={secondaryButtonClass}>Return to draft</button><button type="button" disabled={saving} onClick={() => void transition("published")} className={secondaryButtonClass}>Publish</button><span className="basis-full text-xs text-slate-500 dark:text-slate-400">Publishing requires an admin other than the creator and last editor.</span></>}
                {selected?.status === "published" && <span className="self-center text-xs text-slate-500 dark:text-slate-400">Saving edits creates a new draft version.</span>}
              </div>
              <div className="flex w-full justify-end gap-2 sm:w-auto"><button type="button" onClick={() => { setSelected(null); setIsNew(false); }} className="rounded-xl border border-black/[0.08] px-4 py-2.5 text-sm font-semibold dark:border-white/[0.1]">Cancel</button><button type="submit" disabled={saving || !hasContent(content)} className="rounded-xl bg-[#24134F] px-5 py-2.5 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50 dark:bg-cyan-400 dark:text-[#24134F]">{saving ? "Saving…" : isNew ? "Save draft" : "Save changes"}</button></div>
            </div>
          </form> : <section className="flex min-h-[360px] items-center justify-center rounded-[24px] border border-dashed border-black/[0.12] bg-white/50 p-8 text-center dark:border-white/[0.12] dark:bg-white/[0.02]"><div><Scale className="mx-auto h-9 w-9 text-purple-500 dark:text-cyan-300" /><h2 className="mt-4 text-lg font-semibold">Select a document to review</h2><p className="mt-2 max-w-sm text-sm leading-6 text-slate-500 dark:text-slate-400">Choose a document from the list or create a new draft to start writing.</p></div></section>}
        </div>
      </div>

      {showPreview && <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setShowPreview(false); }}><section role="dialog" aria-modal="true" aria-labelledby="legal-preview-title" className="max-h-[90vh] w-full max-w-4xl overflow-hidden rounded-2xl bg-white shadow-2xl dark:bg-[#15111f]"><header className="flex items-center justify-between border-b border-black/[0.07] px-6 py-4 dark:border-white/[0.08]"><div><h2 id="legal-preview-title" className="font-semibold">Document preview</h2><p className="text-xs text-slate-500 dark:text-slate-400">This is how the formatted content will look.</p></div><button type="button" onClick={() => setShowPreview(false)} aria-label="Close preview" className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-white/[0.06]"><X className="h-4 w-4" /></button></header><article className="legal-preview-content prose prose-slate max-w-none overflow-y-auto px-7 py-8 dark:prose-invert" dangerouslySetInnerHTML={{ __html: sanitizeLegalHtml(content) }} /></section></div>}
    </main>
  );
}

const fieldClass = "w-full rounded-xl border border-black/[0.08] bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-purple-400 focus:ring-4 focus:ring-purple-500/10 dark:border-white/[0.08] dark:bg-white/[0.04] dark:focus:border-cyan-400 dark:focus:ring-cyan-400/10";
const secondaryButtonClass = "rounded-xl border border-purple-200 px-4 py-2.5 text-sm font-semibold text-purple-800 transition hover:bg-purple-50 disabled:opacity-50 dark:border-purple-300/20 dark:text-purple-200 dark:hover:bg-purple-400/10";

function labelForType(type: LegalDocumentType): string {
  return documentTypes.find((item) => item.value === type)?.label ?? "Legal document";
}

function shortId(id: string | null): string {
  return id ?? "Unavailable";
}

function hasContent(html: string): boolean {
  return html.replace(/<[^>]*>/g, "").replace(/&nbsp;|&#160;/gi, " ").trim().length > 0;
}

function AccessNotice() {
  return <div className="px-5 py-12 sm:px-7 lg:px-10"><div className="mx-auto max-w-3xl rounded-2xl border border-black/[0.06] bg-white p-8 dark:border-white/[0.06] dark:bg-white/[0.03]"><h1 className="text-2xl font-semibold">Legal access required</h1><p className="mt-2 text-sm text-slate-500 dark:text-slate-400">This page is available to B2C legal administrators and platform administrators.</p><Link href="/hammet" className="mt-5 inline-flex text-sm font-semibold text-purple-700 dark:text-cyan-400">Back to dashboard</Link></div></div>;
}
