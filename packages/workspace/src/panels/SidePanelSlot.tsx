import { useState } from "react";
import { ResizablePanel } from "./ResizablePanel";
import { SidePanel } from "./SidePanel";
import type { Side, SidePanel as SidePanelDefinition } from "../types";
import type { SidePanelState } from "./useSidePanel";

/** Width policy belongs to the persistent slot that owns each side's size. */
const sidePanelSizes = {
  left: { defaultWidth: 240, minWidth: 180, maxWidth: 480 },
  right: { defaultWidth: 360, minWidth: 280, maxWidth: 720 },
} satisfies Record<Side, { defaultWidth: number; minWidth: number; maxWidth: number }>;

type SidePanelSlotProps = {
  side: Side;
  /** The current page's panel on this side, if it has one. */
  panel: SidePanelDefinition | undefined;
  state: SidePanelState;
};

/**
 * One side of the frame. The slot stays mounted when the page has no panel on this side, so
 * its width carries across pages. Content unmounts when absent. Page changes swap it
 * instantly; only the panel toggle animates it.
 */
export function SidePanelSlot({ side, panel, state }: SidePanelSlotProps) {
  const [width, setWidth] = useState(sidePanelSizes[side].defaultWidth);
  return (
    <ResizablePanel
      id={`${side}-panel`}
      side={side}
      open={panel !== undefined && state.open}
      width={width}
      onWidthChange={setWidth}
      animate={state.animating}
      onAnimationEnd={state.endAnimation}
      {...sidePanelSizes[side]}
      resizeLabel={`Resize ${side} panel`}
    >
      {panel && (
        <SidePanel title={panel.title} side={side}>
          <panel.content />
        </SidePanel>
      )}
    </ResizablePanel>
  );
}
