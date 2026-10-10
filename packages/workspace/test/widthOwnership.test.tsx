// @vitest-environment jsdom

import { act, useState } from "react";
import { createRoot } from "react-dom/client";
import { expect, it, vi } from "vitest";
import { Workspace, type WorkspacePages } from "../src";

(globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT: boolean }).IS_REACT_ACT_ENVIRONMENT =
  true;

it("resizes locally while retaining panel width and content state across page changes", () => {
  const centerRender = vi.fn();
  const rightRender = vi.fn();
  function Center() {
    centerRender();
    return <p>Main content</p>;
  }
  function Right() {
    rightRender();
    return <p>Tools</p>;
  }
  function Left() {
    const [count, setCount] = useState(0);
    return <button onClick={() => setCount((value) => value + 1)}>Count {count}</button>;
  }
  const panels = {
    center: { content: Center },
    left: { title: "Items", content: Left },
    right: { title: "Tools", content: Right },
  };
  const pages: WorkspacePages = [
    { id: "a", label: "A", icon: "A", panels },
    { id: "b", label: "B", icon: "B", panels },
    { id: "c", label: "C", icon: "C", panels: { center: { content: Center } } },
  ];
  const container = document.createElement("div");
  document.body.append(container);
  const root = createRoot(container);
  const render = (pageId: string, key = "workspace") =>
    act(() => root.render(<Workspace key={key} pages={pages} pageId={pageId} />));
  const handle = () =>
    container.querySelector<HTMLElement>('[role="separator"][aria-controls="left-panel"]')!;
  const counter = () => container.querySelector<HTMLButtonElement>("#left-panel button")!;
  try {
    render("a");
    act(() => counter().click());
    centerRender.mockClear();
    rightRender.mockClear();
    act(() => handle().dispatchEvent(new KeyboardEvent("keydown", { key: "End", bubbles: true })));
    expect(handle().getAttribute("aria-valuenow")).toBe("480");
    expect(counter().textContent).toBe("Count 1");
    expect(centerRender).not.toHaveBeenCalled();
    expect(rightRender).not.toHaveBeenCalled();

    render("b");
    expect(handle().getAttribute("aria-valuenow")).toBe("480");
    expect(counter().textContent).toBe("Count 1");
    render("c");
    expect(container.querySelector("#left-panel button")).toBeNull();
    render("a");
    expect(handle().getAttribute("aria-valuenow")).toBe("480");
    expect(counter().textContent).toBe("Count 0");
    render("a", "fresh-workspace");
    expect(handle().getAttribute("aria-valuenow")).toBe("240");
  } finally {
    act(() => root.unmount());
    container.remove();
  }
});
