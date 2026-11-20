"use client";

import { useEffect, useRef, useState } from "react";
import { Bold, Heading2, Heading3, Italic, Link2, List, ListOrdered, Quote, Eye, PenLine } from "lucide-react";

type Props = {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  onUploadMedia: (file: File) => Promise<string>;
};

function escapeAttribute(value: string) {
  return value.replaceAll("&", "&amp;").replaceAll('"', "&quot;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
}

const toolbar = [
  { label: "Bold", icon: Bold, command: "bold" },
  { label: "Italic", icon: Italic, command: "italic" },
  { label: "Heading 2", icon: Heading2, command: "formatBlock", argument: "<h2>" },
  { label: "Heading 3", icon: Heading3, command: "formatBlock", argument: "<h3>" },
  { label: "Bulleted list", icon: List, command: "insertUnorderedList" },
  { label: "Numbered list", icon: ListOrdered, command: "insertOrderedList" },
  { label: "Quote", icon: Quote, command: "formatBlock", argument: "<blockquote>" },
  { label: "Add link", icon: Link2, command: "createLink" },
];

export function BlogContentEditor({ value, onChange, disabled = false, onUploadMedia }: Props) {
  const editorRef = useRef<HTMLDivElement>(null);
  const [preview, setPreview] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== value) editorRef.current.innerHTML = value;
  }, [value, preview]);

  function runCommand(command: string, argument?: string) {
    editorRef.current?.focus();
    document.execCommand(command, false, argument);
    if (editorRef.current) onChange(editorRef.current.innerHTML);
  }

  function insertUploadedMedia(url: string, file: File) {
    const editor = editorRef.current;
    if (!editor) return;
    editor.focus();
    const range = document.createRange();
    range.selectNodeContents(editor);
    range.collapse(false);
    const selection = window.getSelection();
    selection?.removeAllRanges();
    selection?.addRange(range);
    const safeUrl = escapeAttribute(url);
    const html = file.type.startsWith("video/")
      ? `<figure><video controls preload="metadata" src="${safeUrl}"></video></figure><p><br></p>`
      : `<figure><img src="${safeUrl}" alt="${escapeAttribute(file.name)}"><figcaption>${escapeAttribute(file.name)}</figcaption></figure><p><br></p>`;
    document.execCommand("insertHTML", false, html);
    onChange(editor.innerHTML);
  }

  async function handleUpload(file: File) {
    setUploading(true);
    try {
      const url = await onUploadMedia(file);
      insertUploadedMedia(url, file);
    } catch {
      // The parent reports the upload error in the editor form.
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className={`overflow-hidden rounded-2xl border border-slate-200 bg-white dark:border-white/10 dark:bg-[#15101f] ${disabled ? "opacity-70" : ""}`}>
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 px-3 py-2 dark:border-white/10">
        <div className="flex flex-wrap items-center gap-1" aria-label="Text formatting">
          {toolbar.map(({ label, icon: Icon, command, argument }) => (
            <button key={label} type="button" disabled={disabled || preview} onMouseDown={(event) => event.preventDefault()} onClick={() => {
              if (command === "createLink") {
                const href = window.prompt("Paste the link address");
                if (href && (href.startsWith("https://") || href.startsWith("http://") || href.startsWith("mailto:"))) runCommand(command, href);
              } else {
                runCommand(command, argument);
              }
            }} aria-label={label} title={label} className="flex h-10 w-10 items-center justify-center rounded-lg text-slate-600 transition hover:bg-purple-50 hover:text-purple-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 disabled:opacity-40 dark:text-slate-300 dark:hover:bg-white/10 dark:hover:text-cyan-300">
              <Icon className="h-4 w-4" aria-hidden="true" />
            </button>
          ))}
          <label className="flex h-10 cursor-pointer items-center gap-2 rounded-lg px-3 text-sm font-medium text-purple-700 transition hover:bg-purple-50 focus-within:ring-2 focus-within:ring-purple-500 dark:text-cyan-300 dark:hover:bg-white/10">
            <PenLine className="h-4 w-4" aria-hidden="true" />
            <span>{uploading ? "Uploading…" : "Add photo/video"}</span>
            <input className="sr-only" type="file" accept="image/jpeg,image/png,image/webp,image/gif,video/mp4,video/webm" disabled={disabled || uploading || preview} onChange={(event) => { const file = event.target.files?.[0]; if (file) void handleUpload(file); event.currentTarget.value = ""; }} />
          </label>
        </div>
        <button type="button" onClick={() => setPreview((current) => !current)} aria-pressed={preview} className="flex min-h-10 items-center gap-2 rounded-lg border border-slate-200 px-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 dark:border-white/10 dark:text-slate-200 dark:hover:bg-white/5">
          {preview ? <PenLine className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          {preview ? "Continue writing" : "Preview"}
        </button>
      </div>

      {preview ? (
        <iframe title="Article preview" sandbox="" srcDoc={`<!doctype html><html><head><meta name="viewport" content="width=device-width, initial-scale=1"><style>body{font:16px/1.75 system-ui,sans-serif;color:#334155;padding:24px;max-width:760px;margin:auto}h2,h3{line-height:1.25;color:#3b0764}img,video{max-width:100%;height:auto;border-radius:14px}blockquote{border-left:4px solid #06b6d4;padding-left:16px;color:#3b0764}figcaption{color:#64748b;text-align:center;font-size:13px}a{color:#5b21b6}</style></head><body>${value}</body></html>`} className="min-h-[360px] w-full bg-white dark:bg-[#15101f]" />
      ) : (
        <div ref={editorRef} contentEditable={!disabled} role="textbox" aria-label="Article content" aria-multiline="true" data-placeholder="Start writing your article… Use the toolbar to format text or add media." onInput={(event) => onChange(event.currentTarget.innerHTML)} className="min-h-[360px] px-5 py-4 text-[15px] leading-7 text-slate-800 outline-none empty:before:cursor-text empty:before:text-slate-400 empty:before:content-[attr(data-placeholder)] dark:text-slate-100" />
      )}
    </div>
  );
}
