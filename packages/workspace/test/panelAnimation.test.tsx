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
    icon: "H",
    panels: {
      center: { content: () => null },
      left: { title: "Items", content: () => null },
    },
  },
  { id: "settings", label: "Settings", icon: "S", panels: { center: { content: () => null } } },
];

let root: Root | undefined;
let container: HTMLDivElement | undefined;

afterEach(() => {
  act(() => root?.unmount());
  container?.remove();
  root = undefined;
  container = undefined;
  vi.useRealTimers();
  vi.unstubAllGlobals();
});

function render(pageId = "home") {
  if (!container) {
    container = document.createElement("div");
    document.body.append(container);
    root = createRoot(container);
  }
  act(() => root?.render(<Workspace pages={pages} pageId={pageId} />));
}

function toggle() {
  act(() =>
    container!.querySelector<HTMLButtonElement>('button[aria-controls="left-panel"]')!.click(),
  );
}

function transition() {
  return getComputedStyle(container!.querySelector("#left-panel")!).transition;
}

it("makes navigation instant during a toggle and does not revive it on returning", () => {
  render();
  toggle();
  toggle();
  expect(transition()).toContain("width");
  render("settings");
  expect(transition()).toBe("none");
  render();
  expect(transition()).toBe("none");
  expect(getComputedStyle(container!.querySelector("#left-panel")!).width).toBe("240px");
});

it("bounds animation when the browser does not dispatch transition events", () => {
  vi.useFakeTimers();
  render();
  toggle();
  act(() => vi.advanceTimersByTime(100));
  toggle();
  act(() => vi.advanceTimersByTime(150));
  expect(transition()).toContain("width");
  act(() => vi.advanceTimersByTime(100));
  expect(transition()).toBe("none");
});

it("does not let a cancelled earlier transition stop a rapid toggle reversal", () => {
  vi.useFakeTimers();
  render();
  toggle();
  toggle();
  act(() => {
    const event = new Event("transitioncancel", { bubbles: true });
    Object.assign(event, { propertyName: "width" });
    container!.querySelector("#left-panel")!.dispatchEvent(event);
  });
  expect(transition()).toContain("width");
  act(() => vi.advanceTimersByTime(250));
  expect(transition()).toBe("none");
});

it("does not retain animation requests while reduced motion is enabled", () => {
  let reduced = true;
  const listeners = new Set<() => void>();
  vi.stubGlobal("matchMedia", (query: string) => ({
    media: query,
    get matches() {
      return reduced;
    },
    addEventListener: (_type: string, listener: () => void) => listeners.add(listener),
    removeEventListener: (_type: string, listener: () => void) => listeners.delete(listener),
  }));
  render();
  toggle();
  expect(transition()).toBe("none");
  act(() => {
    reduced = false;
    listeners.forEach((listener) => listener());
  });
  expect(transition()).toBe("none");
  toggle();
  expect(transition()).toContain("width");
  act(() => {
    reduced = true;
    listeners.forEach((listener) => listener());
  });
  expect(transition()).toBe("none");
  act(() => {
    reduced = false;
    listeners.forEach((listener) => listener());
  });
  expect(transition()).toBe("none");
});
