# SaaS template

A pnpm workspace with a reusable React app frame and a small Vite app containing placeholder pages.

## Run

```sh
pnpm install
pnpm dev
```

Open the URL printed by Vite. Home, Projects, and Settings demonstrate different panel combinations. `Ctrl+B` toggles the left panel and `Ctrl+Alt+B` toggles the right when available.

## Structure

- `packages/workspace`: the generic frame, panel behavior, theme, tests, and [consumer docs](packages/workspace/docs/README.md).
- `apps/web`: placeholder pages and code-based TanStack Router routes in `src/router.tsx`. Start here to customize the app.

The workspace package is a standalone copy. Changes here do not update the genomebrowser repository.

## Check

```sh
pnpm verify
```

`pnpm build` creates the Vite app in `apps/web/dist`. `pnpm --filter @saas-template/web preview` serves that build locally.
