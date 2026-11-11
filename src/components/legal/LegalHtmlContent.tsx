"use client";

import type { ClipboardEvent, KeyboardEvent, MouseEvent } from "react";

function blockCopy(event: ClipboardEvent<HTMLElement> | MouseEvent<HTMLElement>) {
  event.preventDefault();
}

function blockCopyShortcut(event: KeyboardEvent<HTMLElement>) {
  if ((event.ctrlKey || event.metaKey) && ["c", "x", "a"].includes(event.key.toLowerCase())) {
    event.preventDefault();
  }
}

export function LegalHtmlContent({ content }: { content: string }) {
  return (
    <article
      className="legal-content prose prose-slate max-w-none select-none dark:prose-invert prose-headings:font-bold prose-a:text-purple-700 dark:prose-a:text-purple-300"
      onCopy={blockCopy}
      onCut={blockCopy}
      onContextMenu={blockCopy}
      onKeyDown={blockCopyShortcut}
      tabIndex={0}
      aria-label="Legal document content"
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
}
