---
name: repo-docs
description: Write, review, or organize repository maintainer docs and package consumer docs, including updates for public behavior or API changes. Use for documentation audits and restructuring; excludes commit messages and code comments unless requested.
---

# Repository and package docs

Keep documentation proportional to this small pnpm monorepo. Give each explanation one canonical home and link to it. Preserve useful content and existing navigation rather than imposing a larger repository's directory tree.

## Choose the audience and home

- Root `README.md`: project purpose, setup, development and verification commands, and links to the app and reusable packages.
- Repository `docs/`, when needed: maintainer guidance on architecture, feature placement, contribution, and tooling. Start with a small `docs/README.md` and focused pages; create sections only when there is enough content to justify them.
- App README or app-local docs: that application's configuration, routing, customization, execution, and deployment. App-owned pages and integration belong here.
- Package `README.md`: package purpose, requirements, a minimal public-API example, and links to consumer docs.
- Package `docs/README.md`: learning path and topic navigation. Tutorials teach a sequence, guides explain independent tasks, reference specifies APIs, and troubleshooting diagnoses symptoms.

In this repository, `apps/web` owns the example app and browser-history integration. `packages/workspace` owns the reusable frame, panels, theme, and public contracts. Keep package explanations usable without knowledge of the example app.

The workspace docs already use `01-gettingStarted.md`, `02-guides/`, and `03-reference.md`. Keep that compact structure while it serves readers. A single tutorial or reference page is enough for a small package. Add directories, indexes, or troubleshooting pages only for a distinct reader need; a new option does not automatically need a new page.

Package docs use package-local relative links for essential explanations. Do not make them depend on repository-only or sibling-package docs. If a package later ships docs, verify package inclusion and explain where consumers find the installed-version docs. Do not describe a private, source-consumed package as published or invent installation and release instructions.

## Workflow

1. Read existing docs, relevant repository instructions, package manifests, public entry points, and affected implementation or tests. Verify claims about defaults, ownership, lifecycle, callbacks, keyboard behavior, constraints, and errors. Distinguish proposed behavior from implemented behavior.
2. Find the canonical pages affected by the request. For an audit, report findings and proposed changes. For authorized edits, complete the scope directly. A focused behavior change should update its affected documentation without becoming a repository-wide migration.
3. For restructuring, inventory pages and inbound links and decide what to keep, move, merge, or retire. Preserve useful tutorials and rationale, update navigation, and remove obsolete explanations once their useful content has a current home or is deliberately retired.
4. Read changed pages as a whole for flow, duplication, contradictions, and historical assumptions. Validate examples, links, heading targets, and affected API coverage. Report changed files, checks, and any unverified claims.

Edit ADRs only when requested. Preserve meaningful decision history, label proposals, and distinguish intent from implementation. Do not invent past alternatives or create design records for routine changes.

## Examples and API reference

Lead with the smallest realistic working example using public exports. Include required imports, props, and context, explain the expected result, and keep advanced cases separate. Verify APIs and dependency requirements against this repository rather than copying stale facts from another project.

Every public export needs a reference destination, not a separate file. Keep supporting types with the owning API and small cooperating APIs together. During a full package pass, reconcile reference coverage with export maps and source entry points; during a focused edit, cover only affected contracts.

For components, functions, and hooks, document applicable inputs, types, required context, defaults, outputs, callbacks and their timing, ownership, lifetime, errors, and important interactions. Include controlled and uncontrolled behavior where relevant. Document accessibility only when supported by implementation or tests.

Use prop tables when they improve lookup:

| Prop | Type | Default | Description |
| ---- | ---- | ------- | ----------- |

Explain behavior rather than repeating names. State forwarded DOM attributes without enumerating every standard attribute. Escape literal pipes in table cells, including TypeScript unions, and check that formatting preserves the columns.

## Writing and verification

Describe current behavior directly. Keep change history in PRs or release notes and add migration guidance only when needed. Retain useful rationale for current decisions. Maintainer docs should help someone decide where and how to make a change, rather than turn source files into prose inventories.

Use concrete language, consistent API terminology, sentence-case headings, and connected paragraphs. Explain purpose before mechanics. Keep exhaustive contracts in reference and link to them from guides rather than duplicating tables.

Check relative links and heading targets after moves or renames, including links in agent guidance. Type-check or run examples when practical. Use configured checks appropriate to the change; `pnpm verify` runs formatting, lint, typecheck, tests, and build when broader verification is warranted. Do not install documentation tooling or change application code merely to complete a prose edit.
