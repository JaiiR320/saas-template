# Routing

The app's router owns the URL. The workspace reads the current page from `pageId` and renders each side bar entry as a link to that page's URL. A plain click calls the app's `navigate`, and hovering or focusing a link calls `prefetch`. Because the entries are real links, opening a page in a new tab and copying its address work with any router.

| Prop          | Purpose                                                                         |
| ------------- | ------------------------------------------------------------------------------- |
| `pageId`      | The current page's ID from the router. Missing or unknown shows the first page. |
| `getPageHref` | Builds a page's URL. Defaults to `/${pageId}`.                                  |
| `navigate`    | Client-side navigation to a URL from `getPageHref`.                             |
| `prefetch`    | Preloads a page's URL when its link is hovered or focused.                      |

Without `navigate`, links load their URL normally. Clicks with a modifier key, which open a new tab or window, always go to the browser. A plain left click on the current page's link does nothing.

Render the workspace where it stays mounted as the page changes, usually a layout. Panel widths and collapsed sides live in the workspace, so remounting it on every page change resets them.

## Next.js App Router

Render the workspace from a client component inside a layout, and read the page from the segment below that layout with `useSelectedLayoutSegment`. Define `pages` in a client module as well: page definitions contain components, which a Server Component cannot pass to a Client Component.

```tsx
// app/(workspace)/WorkspaceShell.tsx
"use client";

import { Workspace } from "@saas-template/workspace";
import { useRouter, useSelectedLayoutSegment } from "next/navigation";
import { pages } from "./pages";

export function WorkspaceShell() {
  const router = useRouter();
  const segment = useSelectedLayoutSegment();
  return (
    <Workspace
      pages={pages}
      pageId={segment ?? undefined}
      navigate={(href) => router.push(href)}
      prefetch={(href) => router.prefetch(href)}
    />
  );
}
```

Render `<WorkspaceShell />` from `app/(workspace)/layout.tsx`. Give each page a route so its URL resolves, such as `app/(workspace)/[page]/page.tsx` returning `null`. Import `@saas-template/workspace/styles.css` once in the root layout, configure Tailwind v4's PostCSS integration, and add `@saas-template/workspace` to `transpilePackages`.

## TanStack Router

The template app uses code-based routes in `apps/web/src/router.tsx`. It exports a `router` singleton and `createAppRouter(history?)`, which accepts a custom history for tests. The root route renders a shared `WorkspaceShell`, so the workspace stays mounted when the URL changes and keeps its panel state.

The route tree includes `/`, `/$page`, and a required `$detail` segment with a nested `$` catchall. The index shows the first page. The page param selects a workspace page, and unknown IDs fall back to the first page. The catchall accepts deeper paths such as `/projects/42` without rewriting the URL.

In the shell, read the page param and adapt the workspace's URL callbacks to TanStack Router's typed destination and params:

```tsx
const pageFromHref = (href: string) => decodeURIComponent(href.slice(1));

<Workspace
  pages={pages}
  pageId={page}
  navigate={(href) => {
    void router.navigate({ to: "/$page", params: { page: pageFromHref(href) } });
  }}
  prefetch={(href) => {
    void router.preloadRoute({ to: "/$page", params: { page: pageFromHref(href) } });
  }}
/>;
```

This adapter assumes the workspace's default `/${pageId}` URLs. Adjust it alongside `getPageHref` if your app uses a prefix. The workspace package itself has no router dependency.

## Plain browser history

Apps without a router can read the first path segment with `useSyncExternalStore` and navigate with `history.pushState`. [Getting started](../01-gettingStarted.md#connect-the-url) shows a complete consumer example. The template app uses TanStack Router instead.

## Under a base path

When the workspace lives under a prefix, build URLs with `getPageHref` and read the segment after the prefix:

```tsx
<Workspace pages={pages} pageId={segment} getPageHref={(id) => `/app/${id}`} navigate={navigate} />
```

## Deeper routes

The workspace routes only between pages. Routes within a page, such as `/reports/42`, belong to the app. Panel content reads them with the router's own hooks, and the page's link still points at the page itself. A plain left click on the current page's link leaves the deeper URL unchanged; it does not return to the page's root route.

[Back to the docs home](../README.md)
