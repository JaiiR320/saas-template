---
name: react-best-practices
description: Use when writing, refactoring, or reviewing React/TypeScript components and hooks for correctness, maintainability, composition, or performance. Excludes styling-only work and non-React TypeScript.
---

# React best practices

Implement the current requirement with the smallest correct React design. Inspect nearby components, consumers, installed versions, and package scripts before changing a contract. Keep changes focused; ordinary component work does not need an architecture or performance audit.

## Working rules

- Derive values from current props and state during rendering. Keep state at the lowest common owner of the interactions using it.
- Effects synchronize external systems. Keep interaction logic in handlers, declare reactive dependencies, and clean up resources.
- Keep mounted instances independent. Make controlled values and initial-only defaults explicit.
- Prefer domain callbacks and composition. Extract shared behavior after comparing real callers.
- Express valid states and public contracts with types; infer straightforward internals.
- Memoization must never be required for correctness. Check compiler configuration and identify expensive work before adding optimization complexity.
- Reuse existing MUI components, fetching infrastructure, and workspace packages where their contracts fit. Do not introduce libraries just because an example uses them.
- Match APIs to installed React, MUI, TypeScript, and build-tool versions. Follow local package ownership and import conventions.

Read only the references relevant to the change:

- [State and effects](references/state-and-effects.md) for state ownership, prop updates, resets, refs, subscriptions, and cleanup.
- [Component design](references/component-design.md) for composition, responsibilities, shared APIs, and provider scope.
- [TypeScript contracts](references/typescript-contracts.md) for props, events, Context, reducers, and generics.
- [React performance](references/react-performance.md) for rendering, responsiveness, fetching, and bundle loading.

## Verification

Use configured package checks. This pnpm monorepo exposes root `lint`, `typecheck`, `test`, `build`, and `verify` scripts. Select relevant package checks for focused edits and follow repository requirements for full verification. Check affected behavior, including current props, cleanup, and independent instances when relevant. Report optimization evidence and measurement limits without claiming an unmeasured speedup.

During review, report concrete risks with preferred replacements. During design discussion, edit only when asked. Examples illustrate decisions; adapt them to actual callers and local conventions.

## Attribution

Composition and performance guidance incorporates rewritten material from [Vercel Engineering's agent skills](https://github.com/vercel-labs/agent-skills). The imported composition and React performance skills each declared `license: MIT`, `metadata.author: vercel`, and version `1.0.0`; these declarations are retained here. No separate license text or copyright notice was present in the imported directories. This consolidated skill is maintained locally.
