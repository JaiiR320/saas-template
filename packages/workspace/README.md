# @saas-template/workspace

A full-window app frame for React. The workspace draws a side bar of pages, resizable and collapsible left and right panels, and a center panel with breadcrumbs. Each page supplies its panels' content; the workspace places, sizes, and animates them. It has no domain code, so any app can use it. The placeholder app in `apps/web` demonstrates the frame.

```tsx
import { Workspace, type WorkspacePages } from "@saas-template/workspace";
import { Home } from "lucide-react";
import "@saas-template/workspace/styles.css";

const pages: WorkspacePages = [
  {
    id: "home",
    label: "Home",
    icon: <Home />,
    panels: { center: { content: () => <p>Hello</p> } },
  },
];

export function App() {
  return <Workspace pages={pages} pageId="home" />;
}
```

The package is private to this repository and is consumed from source. It needs React and React DOM compatible with `^19.2.0`. Import `@saas-template/workspace/styles.css` once in the app entry and configure Tailwind v4 with `@tailwindcss/vite` for Vite apps. The frame uses local shadcn-style Button and Tooltip components backed by Radix, with Lucide icons. See [Getting started](docs/01-gettingStarted.md) for setup.

## Documentation

- [Docs home](docs/README.md): the learning path and topic list.
- [Getting started](docs/01-gettingStarted.md): build a workspace with pages and routing.
- [Reference](docs/03-reference.md): props, types, and exports.
- [Glossary](glossary.md): the workspace's terms, such as frame, title row, and page link.
