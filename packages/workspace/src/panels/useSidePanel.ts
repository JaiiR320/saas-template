import useMediaQuery from "@mui/material/useMediaQuery";
import { useEffect, useState } from "react";
import type { Side } from "../types";
import { theme } from "../theme";

/** Width limits for each side panel. */
export const sidePanelSizes = {
  left: { defaultWidth: 240, minWidth: 180, maxWidth: 480 },
  right: { defaultWidth: 360, minWidth: 280, maxWidth: 720 },
} satisfies Record<Side, { defaultWidth: number; minWidth: number; maxWidth: number }>;

export type SidePanelState = {
  open: boolean;
  /** Collapses or reopens the panel, animating the change. */
  toggle: () => void;
  /**
   * True from a toggle until its animation ends. Only toggles animate: a page change that
   * opens or closes the panel swaps it instantly.
   */
  animating: boolean;
  endAnimation: () => void;
  width: number;
  setWidth: (width: number) => void;
};

/** Visibility and width for one side of the frame. They outlive pages, so they carry across them. */
export function useSidePanel(side: Side, pageId: string): SidePanelState {
  const [open, setOpen] = useState(true);
  const reducedMotion = useMediaQuery("(prefers-reduced-motion: reduce)", { noSsr: true });
  const [animation, setAnimation] = useState({ pageId, active: false });
  const [width, setWidth] = useState(sidePanelSizes[side].defaultWidth);

  // Invalidate the request before rendering a different page. Remember the new page
  // even when returning quickly, so an earlier request cannot become active again.
  if (animation.pageId !== pageId || (reducedMotion && animation.active)) {
    setAnimation({ pageId, active: false });
  }
  const animating = animation.pageId === pageId && animation.active && !reducedMotion;

  useEffect(() => {
    if (!animating) return;
    // Transition events normally finish the request. Bound its lifetime when no
    // event arrives, allowing a frame of scheduling slack after the CSS duration.
    const timeout = setTimeout(() => {
      setAnimation((current) => (current === animation ? { ...current, active: false } : current));
    }, theme.transitions.duration.shorter + 50);
    return () => clearTimeout(timeout);
  }, [animation, animating]);

  return {
    open,
    toggle: () => {
      setAnimation({ pageId, active: !reducedMotion });
      setOpen((value) => !value);
    },
    animating,
    endAnimation: () => setAnimation((current) => ({ ...current, active: false })),
    width,
    setWidth,
  };
}
