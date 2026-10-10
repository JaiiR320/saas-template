# SaaS template

A pnpm monorepo with a reusable React and Tailwind app frame and a Vite app containing Home, Projects, and Settings placeholders. The frame provides navigation, breadcrumbs, and collapsible, resizable side panels. The app supplies page content and browser-history routing through TanStack Router.

## Run locally

Use pnpm `12.4.2`, as declared in `package.json`, and a Node.js version supported by the installed Vite release. The current Vite dependency requires Node.js `20.19+` in the 20.x line or `22.12+`.

```sh
pnpm install
pnpm dev
```

Open the URL printed by Vite. `Ctrl+B` toggles the left panel and `Ctrl+Alt+B` toggles the right when available. Resize a side panel by dragging its interior edge or focusing that edge and using the arrow keys.

## Structure

- [Web app](apps/web/README.md): edit `apps/web/src/pages/index.tsx` for page content and panel combinations, or `apps/web/src/router.tsx` for routing.
- [Workspace package](packages/workspace/README.md): edit `packages/workspace` for reusable frame behavior, panel interactions, and color tokens. Its [consumer docs](packages/workspace/docs/README.md) explain the public API.
- [Maintainer docs](docs/README.md): package ownership, feature placement, development checks, and documentation maintenance.

Both packages are private. The app consumes the workspace package directly from TypeScript source through `workspace:*`; there is no separate library build or publishing workflow. This repository has no genome browser dependencies.

## Verify and build

```sh
pnpm verify
```

`pnpm verify` runs formatting checks, lint, type checking, package tests, and the production build. See [development checks](docs/development.md#checks) for focused commands.

`pnpm build` creates the Vite app in `apps/web/dist`. `pnpm --filter @saas-template/web preview` serves that build locally. For hosting, see the app's [deployment notes](apps/web/README.md#production-build-and-hosting), including the fallback required for browser-history routes.
