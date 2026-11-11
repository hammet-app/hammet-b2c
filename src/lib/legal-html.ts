const allowedTags = new Set([
  "A", "B", "BLOCKQUOTE", "BR", "CAPTION", "CODE", "DD", "DL", "DT",
  "EM", "H1", "H2", "H3", "H4", "H5", "H6", "HR", "I", "LI", "OL",
  "P", "PRE", "S", "SUB", "SUP", "STRONG", "TABLE", "TBODY", "TD",
  "TH", "THEAD", "TR", "U", "UL",
]);

const dangerousTags = new Set(["SCRIPT", "STYLE", "IFRAME", "OBJECT", "SVG", "MATH"]);

/** Restricts local preview markup to the same rich content supported by the API. */
export function sanitizeLegalHtml(html: string): string {
  if (typeof window === "undefined") return "";
  const document = new DOMParser().parseFromString(html, "text/html");

  function clean(parent: ParentNode) {
    for (const node of Array.from(parent.childNodes)) {
      if (node.nodeType !== Node.ELEMENT_NODE) continue;
      const element = node as HTMLElement;
      const tag = element.tagName;

      if (dangerousTags.has(tag)) {
        element.remove();
        continue;
      }

      clean(element);
      if (!allowedTags.has(tag)) {
        element.replaceWith(...Array.from(element.childNodes));
        continue;
      }

      for (const attribute of Array.from(element.attributes)) {
        const name = attribute.name.toLowerCase();
        if (tag === "A" && ["href", "title"].includes(name)) continue;
        if (["TD", "TH"].includes(tag) && ["colspan", "rowspan"].includes(name)) continue;
        element.removeAttribute(attribute.name);
      }

      if (tag === "A") {
        const href = element.getAttribute("href")?.trim();
        if (href && !href.startsWith("#")) {
          try {
            const protocol = new URL(href, window.location.origin).protocol;
            if (!["http:", "https:", "mailto:"].includes(protocol)) element.removeAttribute("href");
          } catch {
            element.removeAttribute("href");
          }
        }
        element.setAttribute("rel", "noopener noreferrer");
      }
    }
  }

  clean(document.body);
  return document.body.innerHTML;
}
