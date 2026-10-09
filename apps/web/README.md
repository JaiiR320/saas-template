# Web app

A Vite React app demonstrating `@saas-template/workspace` with placeholder content. Home has both side panels, Projects has a left panel, and Settings has only center content and appears at the bottom of the sidebar.

## Run

From the repository root:

```sh
pnpm install
pnpm dev
```

Open the URL printed by Vite. To work on pages, edit `src/pages/index.tsx`. Define panel components at module scope and use them in the `WorkspacePages` list. For panel definitions and shared state examples, see the package's [pages guide](../../packages/workspace/docs/02-guides/pages.md).

## Routes

`src/App.tsx` mounts TanStack Router's `RouterProvider`. `src/router.tsx` defines the route tree in code from the page list in `src/pages/index.tsx`. The supplied pages correspond to `/home`, `/projects`, and `/settings`. `/` and unknown first path segments display Home without redirecting or changing the address. Each page accepts additional path segments, so `/projects/details` still selects Projects. Search parameters and hashes do not determine the page.

The root route keeps `Workspace` mounted across navigation, preserving panel widths and visibility. Route metadata supplies the selected page ID. Plain sidebar clicks call `router.navigate`; TanStack Router handles browser back and forward. Sidebar hover and focus call `router.preloadRoute`. The current pages load eagerly and have no route loaders, so preloading does not fetch page data. Modified link clicks keep browser behavior.

When adding a page, use a stable, unique, URL-safe ID in `src/pages/index.tsx`; the router creates its route from that list. This app uses code-based routes without a file route generator. To introduce a base path, configure the router and the frame's `getPageHref` integration together. A hosting base also needs matching Vite asset configuration. See the package [routing guide](../../packages/workspace/docs/02-guides/routing.md) for the frame's router contract.

## Production build and hosting

From the repository root:

```sh
pnpm build
pnpm --filter @saas-template/web preview
```

The build output is `apps/web/dist`. Preview serves the built app locally for inspection.

Deploy the output to a static host configured to serve `index.html` for application paths such as `/projects` and `/settings`, while still serving asset requests normally. Without that fallback, directly opening or refreshing a page path can fail even when sidebar navigation works. The current configuration assumes hosting at the origin root. No hosting provider or deployment automation is configured.

[Back to the repository README](../../README.md)
