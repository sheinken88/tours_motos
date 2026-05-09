"use client";

import { useEffect } from "react";

/**
 * Updates the document's <html lang> attribute to match the active locale.
 * SSR sets a default lang in app/layout.tsx; this fixes it post-hydration
 * when the client-side route resolves a different locale than the default.
 */
export function HtmlLang({ code }: { code: string }) {
  useEffect(() => {
    document.documentElement.lang = code;
  }, [code]);
  return null;
}
