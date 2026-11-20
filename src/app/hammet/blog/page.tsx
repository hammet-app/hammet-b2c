"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { ArrowLeft, BookOpenText, Check, FileText, LoaderCircle, Plus, Search, Trash2 } from "lucide-react";
import { useAuth } from "@/lib/auth/auth-context";
import { apiClient } from "@/lib/api/api-client";
import { canManageBlog } from "@/lib/utils/roles";
import { BlogContentEditor } from "@/components/layout/hammet/BlogContentEditor";

type Post = {
  id: string; title: string; slug: string; excerpt: string | null; content: string;
  cover_image_url: string | null; cover_image_alt: string | null; cover_image_caption: string | null;
  author_name: string; category: string | null; tags: string[]; featured: boolean;
  author_role: string | null; author_bio: string | null; author_photo_url: string | null;
  author_linkedin: string | null; author_x: string | null;
  seo_title: string | null; seo_description: string | null; status: "draft" | "published";
  published_at: string | null; updated_at: string;
};
type FormPost = Omit<Post, "id" | "status" | "published_at" | "updated_at">;
type PostsResult = { posts: Post[]; total: number };
type StatusFilter = "all" | "draft" | "published";

const emptyPost = (author = ""): FormPost => ({
  title: "", slug: "", excerpt: "", content: "", cover_image_url: "", cover_image_alt: "",
  cover_image_caption: "", author_name: author, author_role: "", author_bio: "", author_photo_url: "",
  author_linkedin: "", author_x: "", category: "", tags: [], featured: false,
  seo_title: "", seo_description: "",
});

const fieldClass = "mt-1.5 min-h-11 w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/15 dark:border-white/10 dark:bg-[#15101f] dark:text-white";
const primaryButton = "inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-[#24134F] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#321b68] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-2 disabled:cursor-wait disabled:opacity-60 dark:bg-cyan-400 dark:text-[#24134F] dark:hover:bg-cyan-300";
const secondaryButton = "inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 dark:border-white/10 dark:bg-white/[0.03] dark:text-slate-200 dark:hover:bg-white/[0.07]";

export default function BlogAdminPage() {
  const { user, accessToken, refreshToken } = useAuth();
  const canWrite = canManageBlog(user);
  const [posts, setPosts] = useState<Post[]>([]);
  const [form, setForm] = useState<FormPost>(emptyPost());
  const [editing, setEditing] = useState<Post | null>(null);
  const [showEditor, setShowEditor] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [filter, setFilter] = useState<StatusFilter>("all");
  const [search, setSearch] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<Post | null>(null);
  const [slugEdited, setSlugEdited] = useState(false);

  const refresh = useCallback(async () => {
    if (!accessToken) return;
    const response = await apiClient.get<PostsResult>("/hammet/blog/admin?page_size=100", accessToken, { onRefresh: refreshToken ?? (async () => null) });
    setPosts(response.posts);
  }, [accessToken, refreshToken]);

  useEffect(() => {
    if (!accessToken || !canWrite) return;
    let active = true;
    apiClient.get<PostsResult>("/hammet/blog/admin?page_size=100", accessToken, { onRefresh: refreshToken ?? (async () => null) })
      .then((response) => { if (active) setPosts(response.posts); })
      .catch((e: unknown) => { if (active) setError(e instanceof Error ? e.message : "Unable to load posts."); })
      .finally(() => { if (active) setIsLoading(false); });
    return () => { active = false; };
  }, [accessToken, canWrite, refreshToken]);

  const counts = useMemo(() => ({
    all: posts.length,
    draft: posts.filter((post) => post.status === "draft").length,
    published: posts.filter((post) => post.status === "published").length,
  }), [posts]);
  const visiblePosts = useMemo(() => posts.filter((post) => {
    const matchesStatus = filter === "all" || post.status === filter;
    const query = search.trim().toLowerCase();
    const matchesSearch = !query || `${post.title} ${post.slug} ${post.category ?? ""}`.toLowerCase().includes(query);
    return matchesStatus && matchesSearch;
  }), [filter, posts, search]);

  if (!canWrite) return <main className="mx-auto max-w-3xl p-8"><h1 className="text-2xl font-semibold">Blog access required</h1><p className="mt-2 text-slate-500 dark:text-slate-400">Ask a platform administrator to grant blog access.</p></main>;

  function update<K extends keyof FormPost>(key: K, value: FormPost[K]) {
    setForm((previous) => ({ ...previous, [key]: value }));
  }

  function startNewPost() {
    setError("");
    setNotice("");
    setEditing(null);
    setForm(emptyPost(user?.fullName ?? ""));
    setSlugEdited(false);
    setShowEditor(true);
  }

  function openPost(post: Post) {
    const values = Object.fromEntries(Object.entries(post).filter(([key]) => !["id", "status", "published_at", "updated_at"].includes(key))) as FormPost;
    setEditing(post);
    setForm(values);
    setSlugEdited(true);
    setError("");
    setNotice("");
    setShowEditor(true);
  }

  function closeEditor() {
    if (busy) return;
    setShowEditor(false);
    setEditing(null);
    setForm(emptyPost(user?.fullName ?? ""));
    setError("");
  }

  async function uploadMedia(file: File, destination: "cover" | "author" | "inline"): Promise<string> {
    if (!accessToken) throw new Error("Your session has expired. Sign in and try again.");
    setBusy(true);
    setError("");
    try {
      const signed = await apiClient.post<{ signed_url: string; public_url: string }>("/hammet/blog/upload-url", { content_type: file.type }, accessToken, { onRefresh: refreshToken ?? (async () => null) });
      const response = await fetch(signed.signed_url, { method: "PUT", headers: { "Content-Type": file.type, "x-upsert": "false" }, body: file });
      if (!response.ok) throw new Error(`Upload failed (${response.status}). Please try again.`);
      if (destination === "cover") update("cover_image_url", signed.public_url);
      if (destination === "author") update("author_photo_url", signed.public_url);
      return signed.public_url;
    } catch (e) {
      const message = e instanceof Error ? e.message : "The file could not be uploaded.";
      setError(message);
      throw e;
    } finally {
      setBusy(false);
    }
  }

  async function save(status?: "draft" | "published") {
    if (!accessToken) return;
    const hasArticleContent = form.content.replace(/<[^>]*>/g, "").trim() || /<(img|video)\b/i.test(form.content);
    if (!hasArticleContent) {
      setError("Add some article text or media before saving.");
      return;
    }
    setBusy(true);
    setError("");
    setNotice("");
    try {
      const payload = { ...form, status };
      const saved = editing
        ? await apiClient.patch<Post>(`/hammet/blog/admin/${editing.id}`, payload, accessToken, { onRefresh: refreshToken ?? (async () => null) })
        : await apiClient.post<Post>("/hammet/blog", payload, accessToken, { onRefresh: refreshToken ?? (async () => null) });
      if (!editing) setEditing(saved);
      if (status && saved.status !== status) await apiClient.patch(`/hammet/blog/admin/${saved.id}`, { status }, accessToken, { onRefresh: refreshToken ?? (async () => null) });
      await refresh();
      setEditing(null);
      setShowEditor(false);
      setNotice(status === "published" ? "Your post is published." : status === "draft" ? "Draft saved." : "Changes saved.");
      setForm(emptyPost(user?.fullName ?? ""));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unable to save the post. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  async function changeStatus(post: Post, status: "draft" | "published") {
    if (!accessToken) return;
    setBusy(true);
    setError("");
    setNotice("");
    try {
      await apiClient.patch(`/hammet/blog/admin/${post.id}`, { status }, accessToken, { onRefresh: refreshToken ?? (async () => null) });
      await refresh();
      setNotice(status === "published" ? `“${post.title}” is published.` : `“${post.title}” is now a draft.`);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unable to update the post.");
    } finally {
      setBusy(false);
    }
  }

  async function deletePost() {
    if (!accessToken || !deleteTarget) return;
    setBusy(true);
    setError("");
    try {
      await apiClient.delete(`/hammet/blog/admin/${deleteTarget.id}`, undefined, accessToken, { onRefresh: refreshToken ?? (async () => null) });
      setNotice(`“${deleteTarget.title}” was deleted.`);
      if (editing?.id === deleteTarget.id) {
        setShowEditor(false);
        setEditing(null);
      }
      setDeleteTarget(null);
      await refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unable to delete the post.");
      setDeleteTarget(null);
    } finally {
      setBusy(false);
    }
  }

  const header = (
    <header className="mb-7 flex flex-wrap items-end justify-between gap-4">
      <div>
        <p className="mb-1.5 text-sm font-semibold text-purple-700 dark:text-cyan-300">Publishing</p>
        <h1 className="text-3xl font-semibold tracking-[-0.04em] text-slate-950 sm:text-4xl dark:text-white">Hammet Journal</h1>
        <p className="mt-2 max-w-xl text-sm leading-6 text-slate-500 dark:text-slate-400">Write, manage and publish articles for the public journal.</p>
      </div>
      {!showEditor && <button type="button" onClick={startNewPost} className={primaryButton}><Plus className="h-4 w-4" /> Write a post</button>}
    </header>
  );

  return (
    <div className="px-5 pb-28 pt-8 sm:px-7 sm:pt-10 lg:px-10 lg:pb-12 lg:pt-10">
      <div className="mx-auto max-w-[1120px]">
        {header}
        {error && <div role="alert" className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800 dark:border-red-400/20 dark:bg-red-400/10 dark:text-red-200">{error}</div>}
        {notice && !showEditor && <div role="status" className="mb-5 flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800 dark:border-emerald-400/20 dark:bg-emerald-400/10 dark:text-emerald-200"><Check className="h-4 w-4" />{notice}</div>}

        {showEditor ? (
          <form className="space-y-5" onSubmit={(event) => { event.preventDefault(); void save(); }}>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <button type="button" onClick={closeEditor} className={`${secondaryButton} min-h-10`}><ArrowLeft className="h-4 w-4" /> Back to posts</button>
              <span className={`rounded-full px-3 py-1.5 text-xs font-semibold ${editing?.status === "published" ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-400/10 dark:text-emerald-300" : "bg-amber-50 text-amber-700 dark:bg-amber-400/10 dark:text-amber-300"}`}>{editing?.status === "published" ? "Published" : "Draft"}</span>
            </div>

            <section className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-7 dark:border-white/10 dark:bg-white/[0.03]">
              <div className="mb-5"><h2 className="text-lg font-semibold text-slate-950 dark:text-white">Article basics</h2><p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Start with a clear title and a short summary.</p></div>
              <div className="space-y-4">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">Title<span className="ml-1 text-red-500">*</span><input required autoFocus maxLength={200} value={form.title} placeholder="Give your article a title" onChange={(event) => { const title = event.target.value; update("title", title); if (!slugEdited) update("slug", title.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")); }} className={fieldClass} /></label>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">Article address<span className="ml-1 text-red-500">*</span><div className="mt-1.5 flex min-h-11 items-center rounded-xl border border-slate-200 bg-slate-50 focus-within:border-purple-500 focus-within:ring-2 focus-within:ring-purple-500/15 dark:border-white/10 dark:bg-white/[0.04]"><span className="pl-3.5 text-sm text-slate-400">/blog/</span><input required value={form.slug} onChange={(event) => { setSlugEdited(true); update("slug", event.target.value); }} className="min-w-0 flex-1 bg-transparent px-2 py-2.5 text-sm outline-none" placeholder="your-article-title" /></div></label>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">Short summary<textarea rows={3} maxLength={300} value={form.excerpt ?? ""} onChange={(event) => update("excerpt", event.target.value)} placeholder="A sentence or two to help readers decide what to read." className={`${fieldClass} resize-y`} /><span className="mt-1 block text-right text-xs font-normal text-slate-400">{(form.excerpt ?? "").length}/300</span></label>
                <div className="grid gap-4 sm:grid-cols-2"><label className="block text-sm font-medium text-slate-700 dark:text-slate-200">Author<span className="ml-1 text-red-500">*</span><input required maxLength={160} value={form.author_name} onChange={(event) => update("author_name", event.target.value)} className={fieldClass} /></label><label className="block text-sm font-medium text-slate-700 dark:text-slate-200">Category<input value={form.category ?? ""} onChange={(event) => update("category", event.target.value)} placeholder="e.g. AI and careers" className={fieldClass} /></label></div>
              </div>
            </section>

            <section className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-7 dark:border-white/10 dark:bg-white/[0.03]">
              <div className="mb-5"><h2 className="text-lg font-semibold text-slate-950 dark:text-white">Write your article</h2><p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Use the formatting buttons as you write. Add photos or videos directly into your article.</p></div>
              <BlogContentEditor key={editing?.id ?? "new-post"} value={form.content} onChange={(content) => update("content", content)} disabled={busy} onUploadMedia={(file) => uploadMedia(file, "inline")} />
              <p className="mt-2 text-xs text-slate-400">Article content is cleaned automatically before it appears publicly.</p>
            </section>

            <section className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-7 dark:border-white/10 dark:bg-white/[0.03]">
              <div className="mb-5"><h2 className="text-lg font-semibold text-slate-950 dark:text-white">Cover image</h2><p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Choose the image shown on the journal card and article header.</p></div>
              <div className="grid gap-5 md:grid-cols-[minmax(0,1fr)_220px] md:items-start">
                <div className="space-y-4"><label className="block text-sm font-medium text-slate-700 dark:text-slate-200">Choose image<input type="file" accept="image/jpeg,image/png,image/webp,image/gif" disabled={busy} onChange={(event) => { const file = event.target.files?.[0]; if (file) void uploadMedia(file, "cover"); event.currentTarget.value = ""; }} className="mt-1.5 block min-h-11 w-full cursor-pointer rounded-xl border border-slate-200 bg-white text-sm text-slate-600 file:mr-4 file:min-h-11 file:border-0 file:bg-purple-50 file:px-4 file:font-semibold file:text-purple-800 hover:file:bg-purple-100 dark:border-white/10 dark:bg-[#15101f] dark:text-slate-300 dark:file:bg-white/10 dark:file:text-cyan-200" /></label><label className="block text-sm font-medium text-slate-700 dark:text-slate-200">Image description<input value={form.cover_image_alt ?? ""} onChange={(event) => update("cover_image_alt", event.target.value)} placeholder="Describe the image for screen readers" className={fieldClass} /></label><label className="block text-sm font-medium text-slate-700 dark:text-slate-200">Caption (optional)<input value={form.cover_image_caption ?? ""} onChange={(event) => update("cover_image_caption", event.target.value)} className={fieldClass} /></label></div>
                <div className="flex aspect-video items-center justify-center overflow-hidden rounded-xl border border-dashed border-slate-300 bg-slate-50 dark:border-white/15 dark:bg-white/[0.03]">{form.cover_image_url ? <Image src={form.cover_image_url} alt={form.cover_image_alt || "Cover image preview"} width={640} height={360} unoptimized className="h-full w-full object-cover" /> : <div className="px-4 text-center text-sm text-slate-400"><FileText className="mx-auto mb-2 h-6 w-6" />Image preview</div>}</div>
              </div>
            </section>

            <details className="group rounded-2xl border border-slate-200 bg-white dark:border-white/10 dark:bg-white/[0.03]">
              <summary className="cursor-pointer list-none px-5 py-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 sm:px-7"><span className="font-semibold text-slate-900 dark:text-white">Author profile and publishing options</span><span className="ml-2 text-sm text-slate-500">Optional details</span></summary>
              <div className="space-y-5 border-t border-slate-200 px-5 py-5 sm:px-7 dark:border-white/10">
                <div className="grid gap-4 sm:grid-cols-2"><label className="block text-sm font-medium text-slate-700 dark:text-slate-200">Author title<input value={form.author_role ?? ""} onChange={(event) => update("author_role", event.target.value)} placeholder="e.g. Researcher" className={fieldClass} /></label><label className="block text-sm font-medium text-slate-700 dark:text-slate-200">Author photo<input type="file" accept="image/jpeg,image/png,image/webp,image/gif" disabled={busy} onChange={(event) => { const file = event.target.files?.[0]; if (file) void uploadMedia(file, "author"); event.currentTarget.value = ""; }} className="mt-1.5 block min-h-11 w-full cursor-pointer rounded-xl border border-slate-200 bg-white text-sm text-slate-600 file:mr-4 file:min-h-11 file:border-0 file:bg-purple-50 file:px-4 file:font-semibold file:text-purple-800 dark:border-white/10 dark:bg-[#15101f] dark:text-slate-300 dark:file:bg-white/10 dark:file:text-cyan-200" /></label></div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">Author bio<textarea rows={3} value={form.author_bio ?? ""} onChange={(event) => update("author_bio", event.target.value)} className={`${fieldClass} resize-y`} /></label>
                <div className="grid gap-4 sm:grid-cols-2"><label className="block text-sm font-medium text-slate-700 dark:text-slate-200">LinkedIn URL<input type="url" value={form.author_linkedin ?? ""} onChange={(event) => update("author_linkedin", event.target.value)} className={fieldClass} /></label><label className="block text-sm font-medium text-slate-700 dark:text-slate-200">X profile URL<input type="url" value={form.author_x ?? ""} onChange={(event) => update("author_x", event.target.value)} className={fieldClass} /></label></div>
                <label className="flex min-h-11 items-center gap-3 text-sm font-medium text-slate-700 dark:text-slate-200"><input type="checkbox" checked={form.featured} onChange={(event) => update("featured", event.target.checked)} className="h-4 w-4 rounded border-slate-300 text-purple-700 focus:ring-purple-500" />Feature this post on the journal</label>
                <div className="grid gap-4 sm:grid-cols-2"><label className="block text-sm font-medium text-slate-700 dark:text-slate-200">Search title<input maxLength={60} value={form.seo_title ?? ""} onChange={(event) => update("seo_title", event.target.value)} className={fieldClass} /><span className="mt-1 block text-xs font-normal text-slate-400">Up to 60 characters</span></label><label className="block text-sm font-medium text-slate-700 dark:text-slate-200">Search description<input maxLength={160} value={form.seo_description ?? ""} onChange={(event) => update("seo_description", event.target.value)} className={fieldClass} /><span className="mt-1 block text-xs font-normal text-slate-400">Up to 160 characters</span></label></div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">Tags<input value={form.tags.join(", ")} onChange={(event) => update("tags", event.target.value.split(",").map((tag) => tag.trim()).filter(Boolean))} placeholder="AI, careers, research" className={fieldClass} /><span className="mt-1 block text-xs font-normal text-slate-400">Separate tags with commas.</span></label>
              </div>
            </details>

            <div className="sticky bottom-3 z-10 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white/95 p-3 shadow-lg backdrop-blur dark:border-white/10 dark:bg-[#171021]/95">
              <button type="button" onClick={closeEditor} disabled={busy} className={secondaryButton}>Cancel</button>
              <div className="flex flex-wrap gap-2"><button type="submit" disabled={busy} className={secondaryButton}>{busy ? <LoaderCircle className="h-4 w-4 animate-spin" /> : null}{editing?.status === "published" ? "Save changes" : "Save draft"}</button><button type="button" disabled={busy} onClick={() => void save("published")} className={primaryButton}>{busy ? <LoaderCircle className="h-4 w-4 animate-spin" /> : null}{editing?.status === "published" ? "Save and publish" : "Publish post"}</button></div>
            </div>
          </form>
        ) : (
          <>
            <div className="mb-5 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
              <div className="flex flex-wrap gap-2" role="group" aria-label="Filter posts by status">
                {(["all", "draft", "published"] as const).map((status) => <button key={status} type="button" aria-pressed={filter === status} onClick={() => setFilter(status)} className={`min-h-10 rounded-xl px-4 text-sm font-semibold capitalize transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 ${filter === status ? "bg-purple-100 text-purple-900 dark:bg-purple-400/15 dark:text-purple-100" : "text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-white/5"}`}>{status === "all" ? "All posts" : status}{" "}<span className="text-xs opacity-70">{counts[status]}</span></button>)}
              </div>
              {posts.length > 0 && <label className="relative block w-full sm:max-w-xs"><Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" /><span className="sr-only">Search posts</span><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search posts" className={`${fieldClass} pl-9`} /></label>}
            </div>

            {isLoading ? <div className="space-y-3" aria-label="Loading posts">{Array.from({ length: 4 }).map((_, index) => <div key={index} className="h-24 animate-pulse rounded-2xl bg-purple-50 dark:bg-[#21183A]" />)}</div> : posts.length === 0 && !error ? (
              <section className="rounded-[28px] border border-dashed border-purple-200 bg-white px-6 py-14 text-center dark:border-purple-400/20 dark:bg-white/[0.03] sm:px-12">
                <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-purple-50 text-purple-700 dark:bg-purple-400/10 dark:text-cyan-300"><BookOpenText className="h-7 w-7" /></span>
                <h2 className="mt-5 text-xl font-semibold tracking-tight text-slate-950 dark:text-white">Your journal starts here</h2>
                <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500 dark:text-slate-400">Write your first article, save it as a draft while you work, or publish it for everyone to read.</p>
                <button type="button" onClick={startNewPost} className={`${primaryButton} mt-6`}><Plus className="h-4 w-4" /> Write your first post</button>
              </section>
            ) : error && posts.length === 0 ? (
              <section className="rounded-2xl border border-red-200 bg-white px-6 py-12 text-center dark:border-red-400/20 dark:bg-white/[0.03]"><h2 className="font-semibold text-slate-900 dark:text-white">Your posts could not be loaded</h2><p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Check your connection, then try again.</p><button type="button" onClick={() => { setIsLoading(true); setError(""); void refresh().catch((e: unknown) => setError(e instanceof Error ? e.message : "Unable to load posts.")).finally(() => setIsLoading(false)); }} className={`${secondaryButton} mt-4`}>Try again</button></section>
            ) : visiblePosts.length === 0 ? (
              <section className="rounded-2xl border border-slate-200 bg-white px-6 py-12 text-center dark:border-white/10 dark:bg-white/[0.03]">{search ? <Search className="mx-auto h-6 w-6 text-slate-400" /> : <BookOpenText className="mx-auto h-6 w-6 text-slate-400" />}<h2 className="mt-3 font-semibold text-slate-900 dark:text-white">{search ? "No matching posts" : `No ${filter} posts yet`}</h2><p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{search ? "Try another search or clear your filters." : "Write a post and save it here as a draft or publish it when it is ready."}</p><div className="mt-4 flex flex-wrap justify-center gap-2">{search && <button type="button" onClick={() => { setSearch(""); setFilter("all"); }} className={`${secondaryButton} min-h-10`}>Clear filters</button>}<button type="button" onClick={startNewPost} className={`${primaryButton} min-h-10`}><Plus className="h-4 w-4" />Write a post</button></div></section>
            ) : (
              <section aria-label="Blog posts" className="overflow-hidden rounded-2xl border border-slate-200 bg-white dark:border-white/10 dark:bg-white/[0.03]">
                <ul className="divide-y divide-slate-100 dark:divide-white/[0.06]">{visiblePosts.map((post) => <li key={post.id} className="flex flex-col gap-4 p-4 transition hover:bg-purple-50/30 sm:flex-row sm:items-center sm:justify-between sm:px-5 dark:hover:bg-white/[0.025]">
                  <div className="flex min-w-0 items-start gap-3.5">{post.cover_image_url ? <Image src={post.cover_image_url} alt="" width={72} height={56} unoptimized className="h-14 w-[72px] shrink-0 rounded-lg object-cover" /> : <span className="flex h-14 w-[72px] shrink-0 items-center justify-center rounded-lg bg-purple-50 text-purple-500 dark:bg-purple-400/10 dark:text-cyan-300"><FileText className="h-5 w-5" /></span>}<div className="min-w-0"><div className="flex flex-wrap items-center gap-2"><h2 className="truncate font-semibold text-slate-950 dark:text-white">{post.title || "Untitled post"}</h2><span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${post.status === "published" ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-400/10 dark:text-emerald-300" : "bg-amber-50 text-amber-700 dark:bg-amber-400/10 dark:text-amber-300"}`}>{post.status === "published" ? "Published" : "Draft"}</span>{post.featured && <span className="rounded-full bg-purple-50 px-2.5 py-1 text-[11px] font-semibold text-purple-700 dark:bg-purple-400/10 dark:text-purple-200">Featured</span>}</div><p className="mt-1 truncate text-xs text-slate-500 dark:text-slate-400">/blog/{post.slug}{post.category ? ` · ${post.category}` : ""}</p><p className="mt-1 text-xs text-slate-400">Updated {new Date(post.updated_at).toLocaleDateString()}</p></div></div>
                  <div className="flex flex-wrap items-center gap-2 sm:justify-end"><button type="button" disabled={busy} onClick={() => openPost(post)} className={`${secondaryButton} min-h-10 px-3.5 disabled:opacity-50`}>Edit</button>{post.status === "draft" ? <button type="button" disabled={busy} onClick={() => void changeStatus(post, "published")} className="inline-flex min-h-10 items-center justify-center rounded-xl bg-emerald-600 px-3.5 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:opacity-50">Publish</button> : <button type="button" disabled={busy} onClick={() => void changeStatus(post, "draft")} className={`${secondaryButton} min-h-10 px-3.5 disabled:opacity-50`}>Unpublish</button>}<button type="button" disabled={busy} onClick={() => setDeleteTarget(post)} aria-label={`Delete ${post.title}`} className="flex h-10 w-10 items-center justify-center rounded-xl text-slate-400 transition hover:bg-red-50 hover:text-red-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 disabled:opacity-50 dark:hover:bg-red-400/10 dark:hover:text-red-300"><Trash2 className="h-4 w-4" /></button></div>
                </li>)}</ul>
              </section>
            )}
          </>
        )}
      </div>

      {deleteTarget && <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/50 p-4" onKeyDown={(event) => { if (event.key === "Escape" && !busy) setDeleteTarget(null); }} onMouseDown={(event) => { if (event.target === event.currentTarget && !busy) setDeleteTarget(null); }}><section role="alertdialog" aria-modal="true" aria-labelledby="delete-post-title" aria-describedby="delete-post-description" className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-white/10 dark:bg-[#191323]"><h2 id="delete-post-title" className="text-lg font-semibold text-slate-950 dark:text-white">Delete this post?</h2><p id="delete-post-description" className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300"><strong>{deleteTarget.title}</strong> will be removed from your blog manager. This can’t be undone.</p><div className="mt-6 flex justify-end gap-3"><button type="button" autoFocus disabled={busy} onClick={() => setDeleteTarget(null)} className={secondaryButton}>Keep post</button><button type="button" disabled={busy} onClick={() => void deletePost()} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-red-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-red-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 disabled:opacity-50">{busy && <LoaderCircle className="h-4 w-4 animate-spin" />}Delete post</button></div></section></div>}
    </div>
  );
}
