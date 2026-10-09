import { Workspace } from "@saas-template/workspace";
import {
  createRootRoute,
  createRoute,
  createRouter,
  useMatches,
  useRouter,
} from "@tanstack/react-router";
import { pages } from "./pages";

function WorkspaceLayout() {
  const router = useRouter();
  const pageId = useMatches({
    select: (matches) =>
      matches.findLast((match) => match.staticData.workspacePageId)?.staticData.workspacePageId,
  });

  return (
    <Workspace
      pages={pages}
      pageId={pageId}
      navigate={(href) => void router.navigate({ to: href })}
      prefetch={(href) => void router.preloadRoute({ to: href })}
    />
  );
}

const rootRoute = createRootRoute({ component: WorkspaceLayout });
const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  staticData: { workspacePageId: pages[0].id },
});

const pageRoutes = pages.map((page) => {
  const route = createRoute({
    getParentRoute: () => rootRoute,
    path: page.id,
    staticData: { workspacePageId: page.id },
  });

  // Match the bare page with its index; the splat keeps that page selected for deeper paths.
  return route.addChildren([
    createRoute({ getParentRoute: () => route, path: "/" }),
    createRoute({ getParentRoute: () => route, path: "$" }),
  ]);
});

const fallbackRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "$",
  staticData: { workspacePageId: pages[0].id },
});

const routeTree = rootRoute.addChildren([indexRoute, ...pageRoutes, fallbackRoute]);

export const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }

  interface StaticDataRouteOption {
    workspacePageId?: (typeof pages)[number]["id"];
  }
}
