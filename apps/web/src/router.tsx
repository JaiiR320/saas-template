import { Workspace } from "@saas-template/workspace";
import {
  createRootRoute,
  createRoute,
  createRouter,
  Outlet,
  useParams,
  useRouter,
  type RouterHistory,
} from "@tanstack/react-router";
import { pages } from "./pages";

const pageFromHref = (href: string) => decodeURIComponent(href.slice(1));

/** The shared root keeps panel widths and visibility alive across page navigation. */
function WorkspaceShell() {
  const router = useRouter();
  const { page } = useParams({ strict: false });
  return (
    <>
      <Workspace
        pages={pages}
        pageId={page}
        getPageHref={(page) => router.buildLocation({ to: "/$page", params: { page } }).href}
        navigate={(href) => {
          void router.navigate({ to: "/$page", params: { page: pageFromHref(href) } });
        }}
        prefetch={(href) => {
          void router.preloadRoute({ to: "/$page", params: { page: pageFromHref(href) } });
        }}
      />
      <Outlet />
    </>
  );
}

const rootRoute = createRootRoute({ component: WorkspaceShell });
const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: () => null,
});
const pageRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "$page",
  component: Outlet,
});
// Domain screens can replace this catch-all with their own nested routes later.
const detailRoute = createRoute({
  getParentRoute: () => pageRoute,
  path: "$detail",
  component: Outlet,
});
const detailTailRoute = createRoute({
  getParentRoute: () => detailRoute,
  path: "$",
  component: () => null,
});
const routeTree = rootRoute.addChildren([
  indexRoute,
  pageRoute.addChildren([detailRoute.addChildren([detailTailRoute])]),
]);

export function createAppRouter(history?: RouterHistory) {
  return createRouter({ routeTree, history, defaultPreload: "intent" });
}

export const router = createAppRouter();

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}
