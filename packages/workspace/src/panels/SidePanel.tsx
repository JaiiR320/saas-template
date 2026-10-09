import { useId, type ReactNode } from "react";
import { titleRowClassName, titleRowStyle } from "../frame/layout";

type SidePanelProps = { title: string; side: "left" | "right"; children: ReactNode };
export function SidePanel({ title, side, children }: SidePanelProps) {
  const titleId = useId();
  return (
    <aside aria-labelledby={titleId} className="flex min-h-0 flex-1 flex-col">
      <div
        className={titleRowClassName}
        style={titleRowStyle({ clearLeft: side === "left", clearRight: side === "right" })}
      >
        <h2 id={titleId} className="truncate font-medium">
          {title}
        </h2>
      </div>
      <div className="flex min-h-0 flex-1 flex-col">{children}</div>
    </aside>
  );
}
