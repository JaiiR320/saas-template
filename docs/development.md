# Development and documentation

Run commands from the repository root unless a command explicitly selects a package. `pnpm dev` starts the Vite app; use the URL it prints. Keep an existing development server when one is already running.

## Dependencies

`pnpm-workspace.yaml` includes `apps/*` and `packages/*` and centralizes shared versions in pnpm catalogs. Package manifests use `catalog:` for shared dependencies and `catalog:native` for TypeScript. The app references the frame with `workspace:*`.

When changing a shared version, update the catalog and the lockfile through pnpm. Package-specific dependencies belong in that package's manifest. Preserve the frame's peer dependency requirements when changing React, MUI, or Emotion usage. Neither package has a publication workflow.

## Checks

| Command             | Scope                                                                            |
| ------------------- | -------------------------------------------------------------------------------- |
| `pnpm format:check` | Runs each package's Oxfmt check.                                                 |
| `pnpm lint`         | Runs Oxlint in each package.                                                     |
| `pnpm lint:fix`     | Applies Oxlint's automatic fixes in each package.                                |
| `pnpm typecheck`    | Checks the app and the workspace source and tests.                               |
| `pnpm test`         | Runs the workspace and web app Vitest suites.                                    |
| `pnpm build`        | Builds the Vite app into `apps/web/dist`; the frame is consumed from source.     |
| `pnpm verify`       | Runs formatting checks, lint, typecheck, tests, then build, stopping on failure. |

Both packages explicitly load the root `.oxlintrc.json`. It enables correctness rules as errors, React hooks and dependency checks, and JSX accessibility checks. Test files also enable Vitest rules. Lint commands fail on warnings, and generated `dist/` output and dependencies are ignored. Type checking remains a separate command.

The interactive resize handle has a scoped exception for `jsx-a11y/prefer-tag-over-role`: its focusable `separator` role describes a movable window splitter rather than a static horizontal rule. Other accessibility checks remain enabled.

For focused changes, select a package:

```sh
pnpm --filter @saas-template/workspace test
pnpm --filter @saas-template/workspace typecheck
pnpm --filter @saas-template/web typecheck
```

The workspace tests mount the public frame in jsdom. They cover page selection, navigation callbacks, panel combinations, visibility and width retention, shortcuts, resizing, and content lifetime. For layout changes, also inspect the affected interactions in a browser; jsdom assertions do not establish visual layout or animation quality.

The web app tests use TanStack Router's memory history with the application's route tree. They check direct paths, Home fallback, nested paths, sidebar navigation, and panel preferences across back and forward navigation.

Use `pnpm verify` for changes that affect shared behavior or integration. For prose-only edits, check documentation formatting, relative links, heading targets, and examples instead of repeating unrelated application checks. Root README and `docs/` pages are outside the recursive package formatting scripts; check them explicitly with the existing formatter:

```sh
./apps/web/node_modules/.bin/oxfmt --check README.md docs
```

## Documentation ownership

The root README owns setup and entry points. These maintainer pages own repository structure and development guidance. The app README owns its routes and hosting requirements. The workspace README and `docs/` own consumer tutorials, guides, and public contracts.

Update the canonical explanation when behavior changes. Keep public API tables in the package reference and link to them from guides. Match examples to exported APIs and verify defaults and lifetimes against source and tests. Do not promise accessibility behavior that has not been implemented.

Keep the existing compact package documentation structure. Add a new page for a distinct reader task, and update its parent navigation and inbound links. Repository skills under `.agents/skills` provide reusable workflows; avoid copying their full instructions into maintainer pages.

[Back to maintainer docs](README.md)
