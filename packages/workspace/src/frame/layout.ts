import type { CSSProperties } from "react";

export const TITLE_ROW_HEIGHT = 48;
export const SIDE_BAR_WIDTH = 49;
export const TOGGLE_CLEARANCE = 52;
export const titleRowClassName =
  "flex shrink-0 items-center box-content border-b border-border text-sm leading-5 motion-reduce:transition-none!";

/**
 * The top row of each column. The rows line up so their bottom borders form one line.
 * Enable transitions so content slides clear of the header's toggles with the panel;
 * suppress them for navigation so destination padding is applied instantly.
 */
export function titleRowStyle({
  clearLeft = false,
  clearRight = false,
  animate = false,
} = {}): CSSProperties {
  return {
    height: TITLE_ROW_HEIGHT,
    paddingLeft: clearLeft ? TOGGLE_CLEARANCE : 12,
    paddingRight: clearRight ? TOGGLE_CLEARANCE : 12,
    transition: animate ? "padding 200ms cubic-bezier(0.4, 0, 0.2, 1)" : "none",
  };
}
