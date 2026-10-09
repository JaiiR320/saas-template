import {
  type KeyboardEvent,
  type PointerEvent,
  type ReactNode,
  type RefObject,
  type TransitionEvent,
  useEffect,
  useRef,
  useState,
} from "react";

type ResizablePanelProps = {
  id: string;
  /** Which edge of the workspace the panel is anchored to. The handle sits on the opposite edge. */
  side: "left" | "right";
  open: boolean;
  /** Owned by the caller so the width can outlive this panel, such as across page changes. */
  width: number;
  onWidthChange: (width: number) => void;
  /** Animate the next open or close. When false, the panel opens and closes instantly. */
  animate: boolean;
  /** Called when an open or close animation finishes or is interrupted. */
  onAnimationEnd: () => void;
  /** Restored by double-clicking the handle. */
  defaultWidth: number;
  minWidth: number;
  maxWidth: number;
  /** Accessible name for the resize handle. */
  resizeLabel: string;
  children: ReactNode;
};

type Drag = {
  pointerId: number;
  target: HTMLElement;
  startX: number;
  startWidth: number;
  pendingX: number;
  frame: number | null;
};

const KEYBOARD_STEP = 16;

function endDrag(drag: RefObject<Drag | null>) {
  const active = drag.current;
  if (!active) return;
  // Clear first: releasing capture can synchronously dispatch lostpointercapture.
  drag.current = null;
  if (active.frame !== null) cancelAnimationFrame(active.frame);
  if (active.target.hasPointerCapture(active.pointerId)) {
    active.target.releasePointerCapture(active.pointerId);
  }
  document.body.style.removeProperty("cursor");
  document.body.style.removeProperty("user-select");
}

/**
 * A side panel the user can resize by dragging its interior edge or with the arrow keys
 * on that edge. Opening and closing animate its width when `animate` is set. A closed panel stays mounted so its
 * contents keep their state, but it is inert and hidden from assistive technology.
 */
export function ResizablePanel({
  id,
  side,
  open,
  width,
  onWidthChange,
  animate,
  onAnimationEnd,
  defaultWidth,
  minWidth,
  maxWidth,
  resizeLabel,
  children,
}: ResizablePanelProps) {
  const [resizing, setResizing] = useState(false);
  const drag = useRef<Drag | null>(null);
  // Dragging toward the workspace center widens the panel.
  const direction = side === "left" ? 1 : -1;
  const clamp = (value: number) => Math.min(maxWidth, Math.max(minWidth, value));
  const setWidth = (value: number) => onWidthChange(clamp(value));

  const applyPendingWidth = () => {
    const active = drag.current;
    if (!active) return;
    setWidth(active.startWidth + (active.pendingX - active.startX) * direction);
  };

  // Window blur and unmount can interrupt a drag without a pointerup.
  useEffect(() => {
    const onBlur = () => {
      endDrag(drag);
      setResizing(false);
    };
    window.addEventListener("blur", onBlur);
    return () => {
      window.removeEventListener("blur", onBlur);
      endDrag(drag);
    };
  }, []);

  const stopDrag = () => {
    endDrag(drag);
    setResizing(false);
  };

  const onPointerDown = (event: PointerEvent<HTMLElement>) => {
    if (event.button !== 0 || drag.current) return;
    event.preventDefault();
    event.currentTarget.setPointerCapture(event.pointerId);
    drag.current = {
      pointerId: event.pointerId,
      target: event.currentTarget,
      startX: event.clientX,
      startWidth: width,
      pendingX: event.clientX,
      frame: null,
    };
    // Keep the resize cursor and prevent text selection while the pointer leaves the handle.
    document.body.style.cursor = "col-resize";
    document.body.style.userSelect = "none";
    setResizing(true);
  };

  const onPointerMove = (event: PointerEvent<HTMLElement>) => {
    const active = drag.current;
    if (!active || active.pointerId !== event.pointerId) return;
    active.pendingX = event.clientX;
    // Resize at most once per frame; the browser re-renders on every width change.
    if (active.frame !== null) return;
    active.frame = requestAnimationFrame(() => {
      active.frame = null;
      applyPendingWidth();
    });
  };

  const onPointerUp = (event: PointerEvent<HTMLElement>) => {
    const active = drag.current;
    if (!active || active.pointerId !== event.pointerId) return;
    active.pendingX = event.clientX;
    applyPendingWidth();
    stopDrag();
  };

  const onKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    const keyDirection = { ArrowLeft: -1, ArrowRight: 1 }[event.key];
    if (keyDirection !== undefined) {
      event.preventDefault();
      setWidth(width + keyDirection * direction * KEYBOARD_STEP);
    } else if (event.key === "Home" || event.key === "End") {
      event.preventDefault();
      setWidth(event.key === "Home" ? minWidth : maxWidth);
    }
  };

  const panelWidth = clamp(width);

  // Ignore transitions from the contents and the handle, and the visibility transition.
  const endWidthAnimation = (event: TransitionEvent<HTMLElement>) => {
    if (event.target === event.currentTarget && event.propertyName === "width") onAnimationEnd();
  };

  return (
    <div
      id={id}
      inert={!open}
      aria-hidden={!open}
      onTransitionEnd={endWidthAnimation}
      onTransitionCancel={endWidthAnimation}
      className="relative shrink-0 motion-reduce:transition-none!"
      style={{
        width: open ? panelWidth : 0,
        visibility: open ? "visible" : "hidden",
        // Visibility flips immediately on open and after the width animation on close.
        transition:
          !animate || resizing
            ? "none"
            : `width 200ms cubic-bezier(0.4, 0, 0.2, 1), visibility 0ms linear ${open ? 0 : 200}ms`,
      }}
    >
      {/* Clips the full-width contents while the panel animates, so they slide instead of reflowing. */}
      <div
        className={`flex h-full overflow-hidden ${side === "left" ? "justify-end" : "justify-start"}`}
      >
        <div
          className={`flex min-h-0 shrink-0 flex-col border-border ${side === "left" ? "border-r" : "border-l"}`}
          style={{ width: panelWidth }}
        >
          {children}
        </div>
      </div>
      <div
        role="separator"
        aria-orientation="vertical"
        aria-label={resizeLabel}
        aria-controls={id}
        aria-valuenow={panelWidth}
        aria-valuemin={minWidth}
        aria-valuemax={maxWidth}
        tabIndex={0}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={stopDrag}
        onLostPointerCapture={stopDrag}
        onDoubleClick={() => setWidth(defaultWidth)}
        onKeyDown={onKeyDown}
        // An 8px hit area centered on the panel border.
        className={`absolute inset-y-0 z-1 w-2 cursor-col-resize touch-none outline-none after:absolute after:inset-y-0 after:left-[3px] after:w-0.5 after:transition-colors after:duration-150 hover:after:bg-border focus-visible:after:bg-border active:after:bg-primary ${side === "left" ? "-right-1" : "-left-1"}`}
      />
    </div>
  );
}
