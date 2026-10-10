# Reference

## Exports

| Export                                                   | Kind      | Purpose                                                    |
| -------------------------------------------------------- | --------- | ---------------------------------------------------------- |
| [`Workspace`](#workspace)                                | Component | Renders the frame and the current page.                    |
| [`WorkspaceProps`](#workspace)                           | Type      | Props for `Workspace`.                                     |
| [`WorkspacePage`](#workspacepage)                        | Type      | One page definition.                                       |
| [`WorkspacePages`](#workspacepages)                      | Type      | A non-empty list of pages.                                 |
| [`CenterPanel`, `SidePanel`](#centerpanel-and-sidepanel) | Types     | Panel definitions within a page.                           |
| [`textBoxTrim`](#textboxtrim)                            | Style     | `{ textBox: "trim-both cap alphabetic" }` for custom text. |

The CSS entry is `@saas-template/workspace/styles.css`. Import it once in the app entry. Colors use standard shadcn CSS variables, with dark values under `.dark`. There is no JavaScript `theme` export.

## `Workspace`

Renders the side bar, the current page's panels, and the header with the panel toggles. It fills the window (`100dvh`), is a client component, and uses the stylesheet imported by the app.

| Prop            | Type                         | Default                | Description                                                                 |
| --------------- | ---------------------------- | ---------------------- | --------------------------------------------------------------------------- |
| `pages`         | `WorkspacePages`             | Required               | Pages in side bar order.                                                    |
| `pageId`        | `string \| undefined`        | Required               | The current page's ID. Missing or unknown shows the first page.             |
| `getPageHref`   | `(pageId: string) => string` | `` (id) => `/${id}` `` | Builds the URL for each side bar link.                                      |
| `navigate`      | `(href: string) => void`     | None                   | Called with a link's URL on a plain click. Without it, links load normally. |
| `prefetch`      | `(href: string) => void`     | None                   | Called with a link's URL when the link is hovered or focused.               |
| `sideBarFooter` | `ReactNode`                  | None                   | Rendered at the bottom of the side bar, below the bottom-group pages.       |

`pageId` is controlled by the app. There is no internal selected-page state or page-change callback. `getPageHref` runs for every page link during rendering and should return a URL without side effects. `navigate` runs synchronously in the click handler after the default navigation is prevented; it receives the generated URL, not the page ID. Its return value is ignored.

`prefetch` runs on every mouse entry and focus, including for the current page. Calls are not cached or debounced, and its return value is ignored. Callback errors are not caught by the workspace. There is no required router, hotkey provider, or domain context.

The workspace never changes the URL itself. Clicks with a modifier key and clicks on links with a `target` are left to the browser, and a plain left click on the current page's link does nothing. See [Routing](02-guides/routing.md) for router setups.

The side panels have the element IDs `left-panel` and `right-panel`, which their toggles reference with `aria-controls`. Render one workspace per document. `Workspace` does not forward extra DOM attributes, children, or a ref, and it has no theme or panel-state override props.

## `WorkspacePage`

| Field       | Type                                                           | Description                                                                             |
| ----------- | -------------------------------------------------------------- | --------------------------------------------------------------------------------------- |
| `id`        | `string`                                                       | Names the page and usually forms its URL segment. Keep it stable, unique, and URL-safe. |
| `label`     | `string`                                                       | The side bar link's accessible name and tooltip, and the first breadcrumb.              |
| `icon`      | `ReactNode`                                                    | The side bar icon.                                                                      |
| `placement` | `"top" \| "bottom"`                                            | The side bar group. Defaults to `"top"`.                                                |
| `panels`    | `{ center: CenterPanel; left?: SidePanel; right?: SidePanel }` | The page's panels. Only `center` is required.                                           |

## `WorkspacePages`

`readonly [WorkspacePage, ...WorkspacePage[]]`. The type requires at least one page so the first page can always serve as the fallback. This is a TypeScript constraint, not runtime validation. An empty list supplied from untyped code fails when the workspace reads the selected page's panels. Duplicate IDs are not rejected; keep IDs unique.

## `CenterPanel` and `SidePanel`

| Type          | Field     | Type            | Description                                                 |
| ------------- | --------- | --------------- | ----------------------------------------------------------- |
| `CenterPanel` | `title`   | `ComponentType` | Optional. Rendered in the breadcrumbs after the page label. |
| `CenterPanel` | `content` | `ComponentType` | The center panel's content.                                 |
| `SidePanel`   | `title`   | `string`        | Shown in the panel's title row.                             |
| `SidePanel`   | `content` | `ComponentType` | The panel's content, below its title row.                   |

Content and title components receive no props. See [Pages and panels](02-guides/pages.md) for sharing state between them.

## Side panel behavior

CSS transitions are enabled after the initial layout has painted. Navigation and size changes suppress transitions until the reset layout has painted, so page swaps and resizing remain instant. A toggle during that brief suppression also applies instantly. Transition completion and interruption do not control panel state.

| Side  | Default width | Minimum | Maximum |
| ----- | ------------- | ------- | ------- |
| Left  | 240 px        | 180 px  | 480 px  |
| Right | 360 px        | 280 px  | 720 px  |

The workspace registers `Ctrl+B` to toggle the left panel and `Ctrl+Alt+B` to toggle the right. A shortcut is enabled only when the current page supplies that panel. It ignores text-entry fields and editable content, fires once per key press, and prevents the browser's default action when handled. Bindings use Control on every platform. No hotkey provider is required in the consumer.

Dragging a panel's interior edge resizes it. With the edge focused, Left and Right arrow keys move the interior edge by 16 pixels. Right widens the left panel and narrows the right panel; Left does the reverse. Home sets the minimum, and End sets the maximum. These keys prevent their default browser action. Double-clicking the edge restores the default width.

The header toggles collapse and reopen panels with a short width animation, which reduced-motion settings turn off. Changing pages opens or closes panels instantly. A collapsed panel keeps its content mounted but is inert and hidden from assistive technology. When a page does not supply that panel, its slot stays mounted and its content unmounts. Both sides initially open when supplied by the page. The workspace owns widths and visibility for each side, not for each page. Widths and collapsed sides last until the workspace unmounts; there is no persistence or controlled panel-state API. Shared content component identities preserve state across pages that supply that side, while changing component identity remounts content.

## `textBoxTrim`

A readonly style object with the value `{ textBox: "trim-both cap alphabetic" }`. Spread it into an element's `style` prop or a compatible CSS style declaration. It has no inputs or callbacks. Apply it to the element directly containing text; it is not inherited. Browsers without support retain their normal text layout. See [Text trimming](02-guides/styling.md#text-trimming).

[Back to the docs home](README.md)
