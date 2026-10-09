import type { ReactNode } from "react";
import { titleRowClassName, titleRowStyle } from "./layout";

type PageTitleRowProps = {
  label: string;
  title?: ReactNode;
  clearLeftToggle: boolean;
  clearRightToggle: boolean;
  animate: boolean;
};
export function PageTitleRow({
  label,
  title,
  clearLeftToggle,
  clearRightToggle,
  animate,
}: PageTitleRowProps) {
  return (
    <header
      className={titleRowClassName}
      style={titleRowStyle({ clearLeft: clearLeftToggle, clearRight: clearRightToggle, animate })}
    >
      <nav aria-label="Breadcrumb" className="min-w-0">
        <ol className="flex min-w-0 items-center gap-2">
          <li>
            {title ? <span className="text-muted-foreground">{label}</span> : <h1>{label}</h1>}
          </li>
          {title && (
            <>
              <li aria-hidden="true" className="text-muted-foreground">
                /
              </li>
              <li className="min-w-0">
                <h1 className="truncate">{title}</h1>
              </li>
            </>
          )}
        </ol>
      </nav>
    </header>
  );
}
