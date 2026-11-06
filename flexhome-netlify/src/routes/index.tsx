import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";

const TITLE = "Armario FlexHome de Acero Multifuncional — 4 Niveles";
const DESCRIPTION =
  "Armario FlexHome de acero reforzado con 4 niveles y puertas de vidrio templado. Liquidación: $27.900 ARS con envío gratis a toda Argentina.";
const OG_IMAGE = "https://flexhomeofc.lovable.app/__l5e/assets-v1/9b016f33-21e4-403a-94f1-cb34f82ef0c4/arm-1.png";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      { property: "og:image", content: OG_IMAGE },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:image", content: OG_IMAGE },
    ],
    links: [{ rel: "stylesheet", href: "/css/tt-style.css?v=20260728" }],
  }),
  component: ProductLanding,
});

const SCRIPTS = ["/js/site-utils.js", "/products.js", "/js/product-page.js", "/js/cart.js"];

function ProductLanding() {
  useEffect(() => {
    (window as unknown as { PRODUCT_SLUG?: string }).PRODUCT_SLUG = "armario-flexhome";

    let cancelled = false;
    const added: HTMLScriptElement[] = [];

    const load = (src: string) =>
      new Promise<void>((resolve) => {
        const existing = document.querySelector<HTMLScriptElement>(
          `script[data-funnel="${src}"]`,
        );
        if (existing) return resolve();
        const s = document.createElement("script");
        s.src = src;
        s.async = false;
        s.dataset["funnel"] = src;
        s.onload = () => resolve();
        s.onerror = () => resolve();
        document.body.appendChild(s);
        added.push(s);
      });

    (async () => {
      for (const src of SCRIPTS) {
        if (cancelled) return;
        await load(src);
      }
    })();

    return () => {
      cancelled = true;
      added.forEach((s) => s.remove());
    };
  }, []);

  return <div className="phone" id="app" />;
}
