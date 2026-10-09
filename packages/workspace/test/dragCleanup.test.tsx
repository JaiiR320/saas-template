// @vitest-environment jsdom

import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, expect, it, vi } from "vitest";
import { Workspace, type WorkspacePages } from "../src";

(globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT: boolean }).IS_REACT_ACT_ENVIRONMENT =
  true;

const pages: WorkspacePages = [
  {
    id: "home",
    label: "Home",
    icon: <span>H</span>,
    panels: {
      left: { title: "Projects", content: () => <p>Projects</p> },
      center: { content: () => <p>Home</p> },
    },
  },
];

let root: Root | undefined;
let container: HTMLDivElement | undefined;
let originalBodyStyle: string | null;

afterEach(() => {
  act(() => root?.unmount());
  root = undefined;
  container?.remove();
  container = undefined;
  if (originalBodyStyle === null) document.body.removeAttribute("style");
  else if (originalBodyStyle !== undefined) document.body.setAttribute("style", originalBodyStyle);
  vi.unstubAllGlobals();
});

function setup() {
  originalBodyStyle = document.body.getAttribute("style");
  container = document.createElement("div");
  document.body.append(container);
  root = createRoot(container);
  act(() => root?.render(<Workspace pages={pages} pageId="home" navigate={() => {}} />));
  const handle = container.querySelector<HTMLElement>(
    '[role="separator"][aria-controls="left-panel"]',
  )!;
  let captured = false;
  // Scope the jsdom capture adapter to this handle, leaving the prototype untouched.
  const release = vi.fn(() => {
    captured = false;
    pointer(handle, "lostpointercapture");
  });
  Object.assign(handle, {
    setPointerCapture: () => {
      captured = true;
    },
    hasPointerCapture: () => captured,
    releasePointerCapture: release,
  });
  return { handle, release };
}

function pointer(handle: HTMLElement, type: string, clientX = 240, pointerId = 1) {
  const event = new MouseEvent(type, { bubbles: true, button: 0, clientX });
  Object.defineProperty(event, "pointerId", { value: pointerId });
  act(() => handle.dispatchEvent(event));
}

it.each(["pointerup", "pointercancel", "lostpointercapture", "blur", "unmount"])(
  "restores body inline values and priority after %s and cancels queued resizing",
  (ending) => {
    const { handle, release } = setup();
    document.body.style.setProperty("cursor", "crosshair", "important");
    document.body.style.setProperty("user-select", "text", "important");
    const frames = new Map<number, FrameRequestCallback>();
    vi.stubGlobal(
      "requestAnimationFrame",
      vi.fn((callback: FrameRequestCallback) => {
        frames.set(17, callback);
        return 17;
      }),
    );
    const cancel = vi.fn((id: number) => frames.delete(id));
    vi.stubGlobal("cancelAnimationFrame", cancel);

    pointer(handle, "pointerdown");
    expect(document.body.style.cursor).toBe("col-resize");
    expect(document.body.style.userSelect).toBe("none");
    pointer(handle, "pointermove", 320);
    expect(handle.getAttribute("aria-valuenow")).toBe("240");

    if (ending === "unmount") {
      act(() => root?.unmount());
      root = undefined;
    } else if (ending === "blur") {
      act(() => window.dispatchEvent(new Event("blur")));
    } else pointer(handle, ending, 300);

    expect(cancel).toHaveBeenCalledWith(17);
    expect(frames.size).toBe(0);
    expect(release).toHaveBeenCalledTimes(1);
    expect(document.body.style.getPropertyValue("cursor")).toBe("crosshair");
    expect(document.body.style.getPropertyPriority("cursor")).toBe("important");
    expect(document.body.style.getPropertyValue("user-select")).toBe("text");
    expect(document.body.style.getPropertyPriority("user-select")).toBe("important");
    if (ending !== "unmount") {
      expect(handle.getAttribute("aria-valuenow")).toBe(ending === "pointerup" ? "300" : "240");
      pointer(handle, "pointermove", 400);
      expect(frames.size).toBe(0);
    }
  },
);

it("removes temporary body properties and ignores interruption from another pointer", () => {
  const { handle } = setup();
  document.body.style.removeProperty("cursor");
  document.body.style.removeProperty("user-select");
  pointer(handle, "pointerdown");
  pointer(handle, "pointercancel", 240, 2);
  expect(document.body.style.cursor).toBe("col-resize");
  pointer(handle, "pointercancel");
  expect(document.body.style.getPropertyValue("cursor")).toBe("");
  expect(document.body.style.getPropertyValue("user-select")).toBe("");
});
