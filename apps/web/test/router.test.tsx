// @vitest-environment jsdom

import { createMemoryHistory, createRouter, RouterProvider } from "@tanstack/react-router";
import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, expect, it, vi } from "vitest";
import { router } from "../src/router";

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

async function mount(path: string) {
  const history = createMemoryHistory({ initialEntries: [path] });
  const testRouter = createRouter({ routeTree: router.options.routeTree, history });
  container = document.createElement("div");
  document.body.append(container);
  root = createRoot(container);
  await act(async () => {
    await testRouter.load();
    root?.render(<RouterProvider router={testRouter} />);
  });
  return testRouter;
}

it.each([
  ["/", "Home"],
  ["/home", "Home"],
  ["/projects", "Projects"],
  ["/settings", "Settings"],
  ["/missing", "Home"],
  ["/projects/42?tab=details#top", "Projects"],
])("selects the expected page for %s without changing the URL", async (path, label) => {
  const testRouter = await mount(path);
  expect(container!.querySelector('nav [aria-current="page"]')?.getAttribute("aria-label")).toBe(
    label,
  );
  expect(testRouter.state.location.href).toBe(path);
  expect(container!.querySelector("main")?.textContent).toContain(label);
});

it("builds page links that match index routes without wildcard ambiguity", async () => {
  const testRouter = await mount("/home");
  const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
  try {
    for (const to of ["/home", "/projects", "/settings"] as const) {
      const location = testRouter.buildLocation({ to });
      expect(testRouter.matchRoutes(location.pathname).at(-1)?.routeId).toBe(`${to}/`);
    }
    expect(warn).not.toHaveBeenCalled();
  } finally {
    warn.mockRestore();
  }
});

it("navigates from sidebar links and keeps panel preferences through back and forward", async () => {
  const testRouter = await mount("/home");
  const nav = container!.querySelector("nav");
  const clickPage = async (label: string) => {
    await act(async () =>
      container!.querySelector<HTMLAnchorElement>(`nav a[aria-label="${label}"]`)!.click(),
    );
  };
  const leftToggle = () =>
    container!.querySelector<HTMLButtonElement>('button[aria-controls="left-panel"]');

  act(() => leftToggle()!.click());
  await clickPage("Projects");
  expect(testRouter.state.location.pathname).toBe("/projects");
  expect(leftToggle()?.getAttribute("aria-expanded")).toBe("false");

  await clickPage("Settings");
  expect(testRouter.state.location.pathname).toBe("/settings");
  expect(leftToggle()).toBeNull();

  await act(async () => {
    testRouter.history.back();
    await vi.waitFor(() => expect(testRouter.state.location.pathname).toBe("/projects"));
  });
  expect(leftToggle()?.getAttribute("aria-expanded")).toBe("false");
  expect(container!.querySelector("nav")).toBe(nav);

  await act(async () => {
    testRouter.history.forward();
    await vi.waitFor(() => expect(testRouter.state.location.pathname).toBe("/settings"));
  });
  expect(container!.querySelector("main")?.textContent).toContain("Settings");
});
