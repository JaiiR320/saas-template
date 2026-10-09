"use client";

import { TooltipProvider } from "./components/ui/tooltip";
import { useHotkey } from "@tanstack/react-hotkeys";
import type { ReactNode } from "react";
import { Header } from "./frame/Header";
import { PageTitleRow } from "./frame/PageTitleRow";
import { PanelToggleButton } from "./panels/PanelToggleButton";
import { SideBar } from "./frame/SideBar";
import { SidePanelSlot } from "./panels/SidePanelSlot";
import type { WorkspacePages } from "./types";
import { useSidePanel } from "./panels/useSidePanel";

export type WorkspaceProps = {
  /** The pages to show, in side bar order. */
  pages: WorkspacePages;
  /**
   * The current page's ID, read from your router: the URL segment for the page, such as
   * `useSelectedLayoutSegment()` in Next.js or a `$page` param in TanStack Router.
   * An undefined or unknown ID shows the first page.
   */
  pageId: string | undefined;
  /**
   * Builds the URL for a page, used for the side bar links. Defaults to `/${pageId}`.
   * Use it when the workspace lives under a base path, such as `(id) => "/app/" + id`.
   */
  getPageHref?: (pageId: string) => string;
  /**
   * Navigates client-side to a URL from `getPageHref`, such as Next.js `router.push` or
   * TanStack Router's `(href) => router.navigate({ to: href })`. Without it, side bar links
   * load the page normally. Clicks that open a new tab or window are left to the browser.
   */
  navigate?: (href: string) => void;
  /**
   * Preloads a page when its side bar link is hovered or focused, such as Next.js
   * `router.prefetch` or TanStack Router's `(href) => router.preloadRoute({ to: href })`.
   */
  prefetch?: (href: string) => void;
  /** Content at the bottom of the side bar, below the bottom-group pages, such as an account menu. */
  sideBarFooter?: ReactNode;
};

const defaultPageHref = (pageId: string) => `/${pageId}`;

export function Workspace({
  pages,
  pageId,
  getPageHref = defaultPageHref,
  navigate,
  prefetch,
  sideBarFooter,
}: WorkspaceProps) {
  const left = useSidePanel("left");
  const right = useSidePanel("right");

  const page = pages.find((candidate) => candidate.id === pageId) ?? pages[0];
  const { center, left: leftPanel, right: rightPanel } = page.panels;
  const Center = center.content;
  const Title = center.title;

  useHotkey({ key: "B", ctrl: true }, left.toggle, {
    enabled: leftPanel !== undefined,
    ignoreInputs: true,
    requireReset: true,
    preventDefault: true,
    stopPropagation: true,
  });
  useHotkey({ key: "B", ctrl: true, alt: true }, right.toggle, {
    enabled: rightPanel !== undefined,
    ignoreInputs: true,
    requireReset: true,
    preventDefault: true,
    stopPropagation: true,
  });

  return (
    <TooltipProvider>
      {/* Every column runs the full window height with the header floating over their tops.
          Closed panels' resize handles must not cause scrolling. */}
      <div className="relative flex h-dvh overflow-hidden bg-background text-foreground">
        <Header
          leftToggle={
            leftPanel && (
              <PanelToggleButton
                side="left"
                open={left.open}
                onToggle={left.toggle}
                tooltipPlacement="bottom"
              />
            )
          }
          rightToggle={
            rightPanel && (
              <PanelToggleButton
                side="right"
                open={right.open}
                onToggle={right.toggle}
                tooltipPlacement="bottom"
              />
            )
          }
        />
        <SideBar
          pages={pages}
          currentPageId={page.id}
          getPageHref={getPageHref}
          navigate={navigate}
          prefetch={prefetch}
          footer={sideBarFooter}
        />
        <SidePanelSlot side="left" panel={leftPanel} state={left} />
        <div className="flex min-w-0 flex-1 flex-col">
          <PageTitleRow
            label={page.label}
            title={Title && <Title />}
            clearLeftToggle={leftPanel !== undefined && !left.open}
            clearRightToggle={rightPanel !== undefined && !right.open}
            animate={left.animating || right.animating}
          />
          <main className="min-h-0 flex-1 overflow-auto p-2">
            <Center />
          </main>
        </div>
        <SidePanelSlot side="right" panel={rightPanel} state={right} />
      </div>
    </TooltipProvider>
  );
}
