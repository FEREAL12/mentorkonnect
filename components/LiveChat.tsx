"use client";

import Script from "next/script";

/**
 * Tawk.to live chat widget.
 *
 * To connect to YOUR Tawk.to account:
 * 1. Sign up free at https://www.tawk.to
 * 2. Create a property → go to Administration → Chat Widget
 * 3. Copy your embed src URL (looks like: https://embed.tawk.to/XXXXXX/XXXXXX)
 * 4. Replace TAWK_SRC below with that URL.
 */
const TAWK_SRC = process.env.NEXT_PUBLIC_TAWK_SRC ?? "";

export function LiveChat() {
  if (!TAWK_SRC) return null;

  return (
    <Script
      id="tawk-to"
      strategy="lazyOnload"
      dangerouslySetInnerHTML={{
        __html: `
          var Tawk_API = Tawk_API || {};
          var Tawk_LoadStart = new Date();
          (function(){
            var s1 = document.createElement("script"),
                s0 = document.getElementsByTagName("script")[0];
            s1.async = true;
            s1.src = "${TAWK_SRC}";
            s1.charset = "UTF-8";
            s1.setAttribute("crossorigin", "*");
            s0.parentNode.insertBefore(s1, s0);
          })();
        `,
      }}
    />
  );
}
