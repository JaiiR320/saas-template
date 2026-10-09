# Architecture and feature placement

The repository separates an application from its reusable frame. `apps/web` chooses pages, supplies their content, and connects the URL to the current page. `packages/workspace` lays out those pages and owns navigation presentation, breadcrumbs, side-panel interactions, and the shared theme.

The app imports `@saas-template/workspace` through a pnpm workspace dependency. The package exports TypeScript source, which Vite bundles as part of the application. It has no independent build artifact, server, or domain data layer.

## Where behavior belongs

| Change                                                                 | Owner                             | Reason                                                                       |
| ---------------------------------------------------------------------- | --------------------------------- | ---------------------------------------------------------------------------- |
| Page content, application data, and page-specific controls             | `apps/web`                        | The application defines what users do inside the frame.                      |
| Page list, labels, icons, and panel combinations                       | `apps/web/src/pages/index.tsx`    | The application chooses its navigation and content.                          |
| Route definitions, browser history, and router integration             | `apps/web/src/router.tsx`         | The frame receives routing values and callbacks rather than owning a router. |
| Reusable frame layout, panel resizing, collapse controls, or shortcuts | `packages/workspace`              | These behaviors should apply consistently to consuming pages.                |
| Frame theme and shared typography defaults                             | `packages/workspace/src/theme.ts` | The package applies its theme inside `Workspace`.                            |

Keep application-specific behavior near its consumers. Move behavior into the workspace package when it expresses a reusable frame responsibility, with a contract that other pages can use. Compare actual callers before adding configuration or a shared abstraction.

## State and routing ownership

`apps/web/src/App.tsx` mounts TanStack Router's `RouterProvider`. The code-based route tree in `apps/web/src/router.tsx` derives page routes from the app's page list. Matched route metadata selects the frame's `pageId`; TanStack Router owns browser history. The app's [routing notes](../apps/web/README.md#routes) describe URL matching and sidebar navigation.

The frame resolves `pageId` against the supplied pages. An undefined or unknown ID displays the first page without rewriting the URL. Sidebar links use real `href` values; the optional navigation callback handles plain clicks, while modified clicks remain browser actions. See the package's [routing guide](../packages/workspace/docs/02-guides/routing.md) for consumer integration.

The root route keeps one `Workspace` mounted across page changes. `Workspace` owns left and right visibility, while each persistent `SidePanelSlot` owns its width. These values carry across page changes and reset when the frame remounts. Resizing updates its slot without rerendering center or opposite-panel content. Page components own their content state. Collapsing a side panel keeps its content mounted; navigating to a page without that panel removes its content. Use an app-owned provider when page content needs shared state that must outlive those components.

The current app has no persistence, authentication, remote fetching, or backend. Add those as application requirements rather than assuming the placeholder pages implement them.

## Motion ownership and reuse

CSS handles panel width and title-padding transitions. The internal [useTransitionEnabled](../packages/workspace/src/motion/useTransitionEnabled.ts) module decides when transitions are permitted through one interface: `useTransitionEnabled(resetKey: string | number): boolean`. It is not exported through the package's public entry point.

Pass a stable key that changes when a layout update should happen instantly. `Workspace` passes the selected page ID to suppress navigation motion. `ResizablePanel` passes its width to suppress pointer resizing, keyboard resizing, and double-click reset. Changing visibility alone leaves the key unchanged, so collapse and reopen can animate. The resizer combines its permission with the frame's permission and disables transitions while dragging.

On mount or a key change, the module returns `false` before layout commits. Two nested animation-frame callbacks allow the reset layout to paint before permission returns. Live reduced-motion preferences always disable permission. Key changes and unmount cancel pending callbacks, and request identity checks prevent an obsolete callback from restoring motion after rapid navigation. A toggle during this brief suppression applies instantly.

The returned boolean means "transitions are allowed," not "an animation is running." Callers use it to select a CSS transition or `none`; they do not report transition completion. There is no animation latch, duration timer, or fallback timeout. Keep duration and easing in presentation styles.

This module earns reuse because navigation and resizing need the same reset timing, motion preference, and cleanup rules. Reuse it internally for another instant layout reset with a stable string or number key. Do not pass a changing timestamp or toggle state, which would continually suppress the motion being requested. Add a public export only when a consumer needs the contract; content retention during exit is a separate responsibility.

The public frame tests cover initial suppression, navigation during toggles, rapid return to an earlier page, size changes, reduced motion, and pending-frame cleanup. Use browser verification for actual paint timing, visible reversals, and animation quality; jsdom checks establish transition permission and resulting state.

## Changing the public contract

The package's public entry point is `packages/workspace/src/index.ts`. Consumers should import through `@saas-template/workspace` rather than internal source paths. For contract changes, check the app and package tests, then update the affected consumer guide and reference together.

Keep frame behavior testable through the public `Workspace` interface. Internal helpers can change without becoming new public exports. Check keyboard handling, content lifetime, and routing behavior when moving those responsibilities.

[Back to maintainer docs](README.md)
