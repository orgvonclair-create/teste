import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import {
  clearStaleAssetFlag,
  installStaleAssetRecovery,
  isStaleAssetError,
  reloadForStaleAssets,
} from "../lib/chunk-recovery";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  const refreshPage = () => {
    const url = new URL(window.location.href);
    url.searchParams.set("_refresh", Date.now().toString());
    window.location.replace(url.toString());
  };

  useEffect(() => {
    if (isStaleAssetError(error) && reloadForStaleAssets()) return;
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              reset();
              router.invalidate();
              refreshPage();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Armario FlexHome de Acero Multifuncional — 4 Niveles" },
      { name: "description", content: "Armario FlexHome de acero reforzado con 4 niveles y puertas de vidrio templado. Liquidación: $27.900 ARS con envío gratis a toda Argentina." },
      { name: "author", content: "Lovable" },
      { property: "og:title", content: "Armario FlexHome de Acero Multifuncional — 4 Niveles" },
      { property: "og:description", content: "Armario FlexHome de acero reforzado con 4 niveles y puertas de vidrio templado. Liquidación: $27.900 ARS con envío gratis a toda Argentina." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:site", content: "@Lovable" },
      { name: "twitter:title", content: "Armario FlexHome de Acero Multifuncional — 4 Niveles" },
      { name: "twitter:description", content: "Armario FlexHome de acero reforzado con 4 niveles y puertas de vidrio templado. Liquidación: $27.900 ARS con envío gratis a toda Argentina." },
      { property: "og:image", content: "https://flexhomeofc.lovable.app/__l5e/assets-v1/9b016f33-21e4-403a-94f1-cb34f82ef0c4/arm-1.png" },
      { name: "twitter:image", content: "https://flexhomeofc.lovable.app/__l5e/assets-v1/9b016f33-21e4-403a-94f1-cb34f82ef0c4/arm-1.png" },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
      { rel: "icon", href: "/favicon.png", type: "image/png" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="es-AR">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  useEffect(() => {
    installStaleAssetRecovery();
    // App booted fine, so allow a future recovery reload if a deploy happens later.
    clearStaleAssetFlag();
  }, []);


  return (
    <QueryClientProvider client={queryClient}>
      {/* Required: nested routes render here. Removing <Outlet /> breaks all child routes. */}
      <Outlet />
    </QueryClientProvider>
  );
}
