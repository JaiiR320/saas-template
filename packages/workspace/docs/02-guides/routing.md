# Routing

The app's router owns the URL. The workspace reads the current page from `pageId` and renders each side bar entry as a link to that page's URL. A plain click calls the app's `navigate`, and hovering or focusing a link calls `prefetch`. Because the entries are real links, opening a page in a new tab and copying its address work with any router.

| Prop          | Purpose                                                                         |
| ------------- | ------------------------------------------------------------------------------- |
| `pageId`      | The current page's ID from the router. Missing or unknown shows the first page. |
| `getPageHref` | Builds a page's URL. Defaults to `/${pageId}`.                                  |
| `navigate`    | Client-side navigation to a URL from `getPageHref`.                             |
| `prefetch`    | Preloads a page's URL when its link is hovered or focused.                      |

Without `navigate`, links to other pages load their URL normally. Clicks with a modifier key, which open a new tab or window, always go to the browser. A plain left click on the current page's link does nothing.

Render the workspace where it stays mounted as the page changes, usually a layout. Panel widths and collapsed sides live in the workspace, so remounting it on every page change resets them.

## Connect a router

Keep the page definitions in a module used by the app, then adapt the router's current page and navigation methods to the workspace props. This adapter is independent of a router library:

```tsx
import { Workspace, type WorkspacePages } from "@saas-template/workspace";

type RouterState = {
  page: string | null;
  go: (options: { to: string }) => void;
};

export function RouterWorkspace({ pages, router }: { pages: WorkspacePages; router: RouterState }) {
  return (
    <Workspace
      pages={pages}
      pageId={router.page ?? undefined}
      navigate={(href) => router.go({ to: href })}
    />
  );
}
```

Pass the router's page segment as `pageId`, converting `null` to `undefined` if necessary. Wrap its navigation method in `(href) => ...` when its signature differs. Do the same for preloading, or omit `prefetch` if the router does not support it. Register routes for each generated URL, and arrange for direct requests and refreshes to resolve to the app.

The workspace does not subscribe to the router. Calling `navigate` must eventually cause the app to pass the new `pageId`. In apps with server components, define the page components and their page list on the client side because these definitions contain functions.

## Plain browser history

Apps without a router can read the first path segment with `useSyncExternalStore` and navigate with `history.pushState`. [Getting started](../01-gettingStarted.md#connect-the-url) shows a browser-only version.

## Under a base path

When the workspace lives under a prefix, build URLs with `getPageHref` and read the segment after the prefix:

```tsx
<Workspace pages={pages} pageId={segment} getPageHref={(id) => `/app/${id}`} navigate={navigate} />
```

## Deeper routes

The workspace routes only between pages. Routes within a page, such as `/reports/42`, belong to the app. Panel content reads them with the router's own hooks, and the page's link still points at the page itself. A plain left click on the current page's link leaves the deeper URL unchanged; it does not return to the page's root route.

[Back to the docs home](../README.md)
