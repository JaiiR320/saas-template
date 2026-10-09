# Pages and panels

A page is a `WorkspacePage` definition. It names the page, gives it a side bar icon, and lists the content for each of its panels. The workspace decides where those panels go, how wide they are, and when they animate.

## Choose a page's panels

Every page has a center panel. Add a left panel for navigation within the page, such as a list of saved items, and a right panel for a tool that works alongside the page, such as an assistant.

```tsx
import type { WorkspacePage } from "@saas-template/workspace";

function ReportList() {
  return <p>Saved reports</p>;
}
function OpenReportName() {
  return "Untitled report";
}
function ReportView() {
  return <p>Choose a report</p>;
}

const reportsPage: WorkspacePage = {
  id: "reports",
  label: "Reports",
  icon: <span aria-hidden="true">R</span>,
  panels: {
    left: { title: "Saved reports", content: ReportList },
    center: { title: OpenReportName, content: ReportView },
  },
};
```

A side panel is absent when the current page does not supply it, and collapsed when the page supplies it but the user has hidden it. An absent panel is closed and has no toggle. A collapsed panel's toggle stays in the header so the user can reopen it.

Side panels have fixed size limits. The left panel opens at 240 pixels and resizes between 180 and 480. The right panel opens at 360 pixels and resizes between 280 and 720. Users resize a panel by dragging its interior edge, the border facing the center panel, or by focusing that edge and pressing the arrow keys, Home, or End. Double-clicking the edge restores the default width. Widths and collapsed sides last until the workspace unmounts; they are not saved between visits.

`Ctrl+B` toggles the left panel and `Ctrl+Alt+B` toggles the right panel. Each shortcut applies only when the current page supplies that panel. Shortcuts ignore text inputs, textareas, selects, and editable content, and holding a key does not repeatedly toggle a panel.

## Write panel content

Define panel content and title components outside the rendering component so their identities stay stable. Creating a new component function during each render causes React to remount it. Panel content components take no props. They read what they need from the app's stores, context, or router hooks, the same way any component in the app would.

Render text through MUI `Typography`. The workspace theme trims `Typography` text so it centers correctly; [Styling and text](styling.md) explains why.

The center panel supplies scrolling and 8 pixels of padding. Side-panel content supplies its own scrolling and padding. For a side panel with a long list, use a container that can shrink inside the frame:

```tsx
import Box from "@mui/material/Box";

function ProjectList() {
  return (
    <Box sx={{ flexGrow: 1, minHeight: 0, overflow: "auto", p: 1.5 }}>
      {/* Render the project list here. */}
    </Box>
  );
}
```

The center `title` is a component rather than a string, so it can read the same live state as its content.

## Share state between panels

A page's panels render in separate parts of the frame and receive no props. Keep state they share, such as the open report, in a store or a context provider above `Workspace`. For example, use React context above the frame:

```tsx
import { createContext, useContext, useState } from "react";
import { Workspace, type WorkspacePages } from "@saas-template/workspace";

type ReportState = { name: string | null; open: (name: string) => void };
const ReportContext = createContext<ReportState | null>(null);

function useReport() {
  const report = useContext(ReportContext);
  if (!report) throw new Error("Report components require ReportContext");
  return report;
}

function ReportList() {
  const { open } = useReport();
  return <button onClick={() => open("First report")}>Open report</button>;
}

function OpenReportName() {
  return useReport().name ?? "Untitled report";
}

function ReportView() {
  const { name } = useReport();
  return <p>{name ?? "Choose a report"}</p>;
}

const pages: WorkspacePages = [
  {
    id: "reports",
    label: "Reports",
    icon: <span aria-hidden="true">R</span>,
    panels: {
      left: { title: "Saved reports", content: ReportList },
      center: { title: OpenReportName, content: ReportView },
    },
  },
];

export function App() {
  const [name, open] = useState<string | null>(null);
  return (
    <ReportContext.Provider value={{ name, open }}>
      <Workspace pages={pages} pageId="reports" />
    </ReportContext.Provider>
  );
}
```

## Reuse a panel across pages

Each side of the frame stays mounted while the user moves between pages. When two pages supply the same content component for a side, React keeps that component mounted, so its state, such as an unsent message, carries from one page to the other. Pass the same component, not a new wrapper, to get this behavior. Moving through a page with no panel on that side unmounts the content, so its state resets.

Use one stable `AssistantPanel` component in both pages' `right.content` fields. The panel's title can differ without changing that component's identity. Center content follows React's component identity rules too; there is no separate per-page state cache.

## Order pages in the side bar

Pages appear in the side bar in list order. Set `placement: "bottom"` to move a page to the bottom group, which suits settings and help pages. Use the workspace's `sideBarFooter` prop for controls below the bottom group that are not pages, such as an account menu.

The first page in the list is the fallback. The workspace shows it when `pageId` is missing or names no page, so the `WorkspacePages` type requires at least one page.

[Back to the docs home](../README.md)
