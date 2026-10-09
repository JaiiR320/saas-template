import type { ReactNode } from "react";
import { SIDE_BAR_WIDTH, TITLE_ROW_HEIGHT } from "./layout";

type HeaderProps = { leftToggle?: ReactNode; rightToggle?: ReactNode };
/** Floats above the title rows; only its controls take pointer input. */
export function Header({ leftToggle, rightToggle }: HeaderProps) {
  return (
    <div
      className="pointer-events-none absolute inset-x-0 top-0 z-20"
      style={{ height: TITLE_ROW_HEIGHT }}
    >
      {leftToggle && (
        <div
          className="pointer-events-auto absolute top-0 flex h-full items-center"
          style={{ left: SIDE_BAR_WIDTH + 4 }}
        >
          {leftToggle}
        </div>
      )}
      {rightToggle && (
        <div className="pointer-events-auto absolute top-0 right-1 flex h-full items-center">
          {rightToggle}
        </div>
      )}
    </div>
  );
}
