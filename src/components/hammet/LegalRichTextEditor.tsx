"use client";

import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import { TableKit } from "@tiptap/extension-table";
import {
  Bold, Italic, Link2, List, ListOrdered,
  Redo2, Table2, Underline as UnderlineIcon, Undo2,
} from "lucide-react";

type Props = {
  content: string;
  onChange: (html: string) => void;
  onPreview: () => void;
};

export function LegalRichTextEditor({ content, onChange, onPreview }: Props) {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({ link: false, underline: false }),
      Underline,
      Link.configure({ openOnClick: false, autolink: true, linkOnPaste: true }),
      TableKit.configure({ table: { resizable: true }, tableCell: {}, tableHeader: {}, tableRow: {} }),
    ],
    content,
    onUpdate: ({ editor: current }) => onChange(current.getHTML()),
    editorProps: {
      attributes: {
        class: "legal-editor-content prose prose-slate max-w-none min-h-[360px] px-5 py-4 text-slate-800 outline-none dark:prose-invert dark:text-slate-100",
        "aria-label": "Legal document content",
      },
    },
  });

  function setLink() {
    if (!editor) return;
    const current = editor.getAttributes("link").href as string | undefined;
    const href = window.prompt("Enter a web address or email link", current ?? "https://");
    if (href === null) return;
    if (!href.trim()) {
      editor.chain().focus().unsetLink().run();
      return;
    }
    editor.chain().focus().setLink({ href: href.trim() }).run();
  }

  const buttonClass = "inline-flex h-9 min-w-9 items-center justify-center gap-1 rounded-lg border border-black/[0.07] px-2 text-sm text-slate-600 transition hover:bg-purple-50 hover:text-purple-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 disabled:opacity-40 dark:border-white/[0.08] dark:text-slate-300 dark:hover:bg-white/[0.08] dark:hover:text-white";

  return (
    <div className="overflow-hidden rounded-2xl border border-black/[0.08] bg-white dark:border-white/[0.1] dark:bg-[#15111f]">
      <div className="flex flex-wrap items-center gap-1.5 border-b border-black/[0.06] bg-slate-50/80 p-2 dark:border-white/[0.06] dark:bg-white/[0.025]" role="toolbar" aria-label="Text formatting">
        <select
          aria-label="Text style"
          value={editor?.isActive("heading", { level: 2 }) ? "h2" : editor?.isActive("heading", { level: 1 }) ? "h1" : "p"}
          onChange={(event) => {
            if (event.target.value === "p") editor?.chain().focus().setParagraph().run();
            if (event.target.value === "h1") editor?.chain().focus().toggleHeading({ level: 1 }).run();
            if (event.target.value === "h2") editor?.chain().focus().toggleHeading({ level: 2 }).run();
          }}
          className="h-9 rounded-lg border border-black/[0.07] bg-white px-2 text-sm dark:border-white/[0.08] dark:bg-[#15111f]"
        >
          <option value="p">Paragraph</option><option value="h1">Heading 1</option><option value="h2">Heading 2</option>
        </select>
        <span className="mx-1 h-6 w-px bg-black/10 dark:bg-white/10" aria-hidden="true" />
        <ToolbarButton title="Bold" pressed={editor?.isActive("bold")} onClick={() => editor?.chain().focus().toggleBold().run()}><Bold className="h-4 w-4" /></ToolbarButton>
        <ToolbarButton title="Italic" pressed={editor?.isActive("italic")} onClick={() => editor?.chain().focus().toggleItalic().run()}><Italic className="h-4 w-4" /></ToolbarButton>
        <ToolbarButton title="Underline" pressed={editor?.isActive("underline")} onClick={() => editor?.chain().focus().toggleUnderline().run()}><UnderlineIcon className="h-4 w-4" /></ToolbarButton>
        <ToolbarButton title="Add or edit link" onClick={setLink}><Link2 className="h-4 w-4" /></ToolbarButton>
        <span className="mx-1 h-6 w-px bg-black/10 dark:bg-white/10" aria-hidden="true" />
        <ToolbarButton title="Bulleted list" pressed={editor?.isActive("bulletList")} onClick={() => editor?.chain().focus().toggleBulletList().run()}><List className="h-4 w-4" /></ToolbarButton>
        <ToolbarButton title="Numbered list" pressed={editor?.isActive("orderedList")} onClick={() => editor?.chain().focus().toggleOrderedList().run()}><ListOrdered className="h-4 w-4" /></ToolbarButton>
        <ToolbarButton title="Insert table" onClick={() => editor?.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()}><Table2 className="h-4 w-4" /></ToolbarButton>
        <div className="ml-auto flex items-center gap-1.5">
          <ToolbarButton title="Undo" onClick={() => editor?.chain().focus().undo().run()} disabled={!editor?.can().undo()}><Undo2 className="h-4 w-4" /></ToolbarButton>
          <ToolbarButton title="Redo" onClick={() => editor?.chain().focus().redo().run()} disabled={!editor?.can().redo()}><Redo2 className="h-4 w-4" /></ToolbarButton>
          <button type="button" onClick={onPreview} className={`${buttonClass} ml-1 px-3 font-medium`}>Preview</button>
        </div>
      </div>
      <EditorContent editor={editor} />
      <p className="border-t border-black/[0.06] px-4 py-2 text-xs text-slate-500 dark:border-white/[0.06] dark:text-slate-400">Paste text from Word or another editor to keep supported headings, emphasis, links, lists, and tables. Images are not included.</p>
    </div>
  );
}

function ToolbarButton({
  title, children, onClick, pressed, disabled,
}: {
  title: string; children: React.ReactNode; onClick: () => void; pressed?: boolean; disabled?: boolean;
}) {
  return <button type="button" title={title} aria-label={title} aria-pressed={pressed} disabled={disabled} onClick={onClick} className={`inline-flex h-9 min-w-9 items-center justify-center rounded-lg border px-2 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 disabled:opacity-40 ${pressed ? "border-purple-200 bg-purple-100 text-purple-800 dark:border-purple-400/20 dark:bg-purple-400/15 dark:text-purple-200" : "border-black/[0.07] text-slate-600 hover:bg-purple-50 hover:text-purple-800 dark:border-white/[0.08] dark:text-slate-300 dark:hover:bg-white/[0.08] dark:hover:text-white"}`}>{children}</button>;
}
