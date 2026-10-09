// @vitest-environment jsdom

import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { createMemoryHistory, RouterProvider } from "@tanstack/react-router";
import { afterEach, expect, it, vi } from "vitest";
import { createAppRouter } from "./router";

(globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT: boolean }).IS_REACT_ACT_ENVIRONMENT =
  true;

let root: Root | undefined;
let container: HTMLDivElement | undefined;

afterEach(() => {
  act(() => root?.unmount());
  container?.remove();
  root = undefined;
  container = undefined;
});

async function renderRoute(path: string) {
  const history = createMemoryHistory({ initialEntries: [path] });
  const router = createAppRouter(history);
  container = document.createElement("div");
  document.body.append(container);
  root = createRoot(container);
  await act(async () => {
    await router.load();
    root!.render(<RouterProvider router={router} />);
  });
  return { history, router };
}

const currentPage = () =>
  container!.querySelector('a[aria-current="page"]')?.getAttribute("aria-label");

it.each([
  ["/", "Home"],
  ["/home", "Home"],
  ["/projects", "Projects"],
  ["/settings", "Settings"],
  ["/unknown", "Home"],
  ["/projects/42/details", "Projects"],
])("loads %s directly as %s", async (path, label) => {
  await renderRoute(path);
  expect(currentPage()).toBe(label);
});

it("navigates through real workspace links and retains collapsed panels across history changes", async () => {
  const { history } = await renderRoute("/home");
  act(() =>
    container!.querySelector<HTMLButtonElement>('button[aria-controls="left-panel"]')!.click(),
  );
  const leftPanel = container!.querySelector("#left-panel");
  expect(leftPanel?.getAttribute("aria-hidden")).toBe("true");

  await act(async () => {
    container!.querySelector<HTMLAnchorElement>('a[aria-label="Projects"]')!.click();
    await vi.waitFor(() => expect(history.location.pathname).toBe("/projects"));
  });
  expect(currentPage()).toBe("Projects");
  expect(container!.querySelector("#left-panel")).toBe(leftPanel);
  expect(leftPanel?.getAttribute("aria-hidden")).toBe("true");

  await act(async () => {
    history.back();
    await vi.waitFor(() => expect(currentPage()).toBe("Home"));
  });
  expect(leftPanel?.getAttribute("aria-hidden")).toBe("true");
  await act(async () => {
    history.forward();
    await vi.waitFor(() => expect(currentPage()).toBe("Projects"));
  });
});

it("leaves modified navigation clicks to the browser", async () => {
  const { history } = await renderRoute("/home");
  const event = new MouseEvent("click", { bubbles: true, cancelable: true, ctrlKey: true });
  act(() => container!.querySelector('a[aria-label="Projects"]')!.dispatchEvent(event));
  expect(event.defaultPrevented).toBe(false);
  expect(history.location.pathname).toBe("/home");
});
