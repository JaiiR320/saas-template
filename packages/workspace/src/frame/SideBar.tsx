import { buttonVariants } from "../components/ui/button";
import { Tooltip, TooltipTrigger, TooltipContent } from "../components/ui/tooltip";
import { cn } from "../lib/utils";
import type { MouseEvent, ReactNode } from "react";
import { SIDE_BAR_WIDTH } from "./layout";
import type { WorkspacePage } from "../types";

type SideBarProps = {
  pages: readonly WorkspacePage[];
  currentPageId: string;
  getPageHref: (pageId: string) => string;
  navigate: ((href: string) => void) | undefined;
  prefetch: ((href: string) => void) | undefined;
  footer: ReactNode;
};

/** Lets the browser handle clicks that open a new tab or window, download, or use another button. */
function isPlainLeftClick(event: MouseEvent<HTMLAnchorElement>) {
  return (
    event.button === 0 &&
    !event.metaKey &&
    !event.ctrlKey &&
    !event.shiftKey &&
    !event.altKey &&
    !event.currentTarget.target
  );
}

export function SideBar({
  pages,
  currentPageId,
  getPageHref,
  navigate,
  prefetch,
  footer,
}: SideBarProps) {
  const pageLink = (page: WorkspacePage) => {
    const current = page.id === currentPageId;
    const href = getPageHref(page.id);
    return (
      <Tooltip key={page.id}>
        <TooltipTrigger asChild>
          {/* A real link, so opening in a new tab and copying the address work with any router. */}
          <a
            className={cn(
              buttonVariants({ variant: "ghost", size: "icon" }),
              "text-muted-foreground",
              current && "bg-accent text-accent-foreground",
            )}
            href={href}
            aria-label={page.label}
            aria-current={current ? "page" : undefined}
            onClick={(event: MouseEvent<HTMLAnchorElement>) => {
              if (!isPlainLeftClick(event)) return;
              if (current) {
                event.preventDefault();
              } else if (navigate) {
                event.preventDefault();
                navigate(href);
              }
            }}
            onMouseEnter={() => prefetch?.(href)}
            onFocus={() => prefetch?.(href)}
          >
            {page.icon}
          </a>
        </TooltipTrigger>
        <TooltipContent side="right">{page.label}</TooltipContent>
      </Tooltip>
    );
  };

  return (
    <nav
      aria-label="Workspace"
      className="flex shrink-0 flex-col items-center gap-1 border-r border-border p-1"
      style={{ width: SIDE_BAR_WIDTH }}
    >
      {pages.filter((page) => page.placement !== "bottom").map(pageLink)}
      <div className="flex-1" />
      {pages.filter((page) => page.placement === "bottom").map(pageLink)}
      {footer}
    </nav>
  );
}
