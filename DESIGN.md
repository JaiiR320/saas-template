# Design guide

Build a calm, precise workspace with clear typography, neutral colors, and predictable interactions. The visual direction draws from [Vercel's design guidance](https://vercel.com/design.md), adapted to our application. Keep our own identity and content.

## Stack and ownership

- Use Tailwind CSS v4 for layout and styling, with semantic HTML.
- Reuse the local shadcn-style controls in `packages/workspace/src/components/ui`. Button and Tooltip use Radix for composition and accessible behavior.
- Use `cn` from `packages/workspace/src/lib/utils.ts` to combine conditional classes and resolve Tailwind conflicts. Define reusable variants with `class-variance-authority`.
- Use Lucide for standard icons. Give icon-only controls accessible names and hide decorative SVGs from assistive technology.
- Keep shared theme tokens and font setup in `packages/workspace/src/styles.css`. Import `@saas-template/workspace/styles.css` once at the app entry.
- Use `packages/workspace/components.json` for the shared shadcn configuration. Add components as they are needed.
- Do not reintroduce MUI, Emotion, or a second theme system.

## Typography

Use self-hosted Geist Sans for interface text, headings, labels, and numbers. Use Geist Mono for code, commands, paths, and technical identifiers. Apply `font-sans` and `font-mono` rather than declaring fonts in individual components.

Page headings use `text-2xl font-semibold tracking-tight`. Ordinary interface copy uses `text-sm leading-6`; longer reading content can use `text-base leading-7`. Frame titles use a consistent 20-pixel line height so panel headings and breadcrumbs align.

Use sentence case. Keep descriptions direct and useful. Group a heading and its description with a shared gap, and constrain reading text with `max-w-prose`. Establish hierarchy with size, weight, and spacing before introducing additional surfaces.

The exported `textBoxTrim` style is optional for optical alignment. Apply it to the element directly containing text. Avoid trimming clipped labels; frame titles use normal line boxes.

## Colors and themes

Use semantic utilities instead of literal colors in components. The stylesheet owns the values in this table.

| Purpose            | Utilities                            | Light                | Dark                  |
| ------------------ | ------------------------------------ | -------------------- | --------------------- |
| Main canvas        | `bg-background`                      | `#ffffff`            | `#000000`             |
| Main text          | `text-foreground`                    | `#171717`            | `#ededed`             |
| Primary action     | `bg-primary text-primary-foreground` | Dark with white text | Light with black text |
| Quiet surface      | `bg-muted`                           | `#fafafa`            | `#0a0a0a`             |
| Supporting text    | `text-muted-foreground`              | `#666666`            | `#a1a1a1`             |
| Hover or selection | `bg-accent text-accent-foreground`   | `#f2f2f2`            | `#1a1a1a`             |
| Boundaries         | `border-border`                      | `#eaeaea`            | `#292929`             |
| Keyboard focus     | `ring-ring`                          | `#0070f3`            | `#52a8ff`             |

The app shell selects dark mode by adding `.dark` to the document root. Keep theme preference and persistence in the shell. Shared controls and portaled tooltips must work in both themes.

Reserve additional color for meaningful states or data. Pair status colors with text or an icon. Check contrast when adding or changing tokens.

## Layout and surfaces

Use the existing workspace frame and preserve its aligned title rows, sidebar, and resizable panels. Keep domain content inside page and panel components; keep routing and page configuration separate from frame styling.

Use Tailwind's spacing scale, with `gap-2` for related text, `p-4` for panel content, and `p-6` for page content as starting points. Let one parent own a group's spacing. Align related headings, controls, and content to shared edges.

Prefer open space and typography over cards. Add a border or surface when it explains a real boundary, selection, or interaction. Keep corner radii restrained; shared controls use the six-pixel `--radius` token. Avoid decorative gradients, glows, glass effects, patterned backgrounds, and ornamental shadows.

Use `min-w-0` and `min-h-0` where flex children need to shrink. Give scrolling content its own overflow container. At narrow widths, preserve readable content and usable controls; adapt the layout instead of shrinking text or hiding accidental overflow.

## Controls and accessibility

Reuse Button variants for primary, outlined, and ghost actions. Use ghost icon controls in the frame and an accent surface for the selected page. Keep visible focus rings and a background-aware focus offset.

Use real links for navigation and buttons for actions. Preserve modified clicks and native browser behavior. A tooltip supplements an accessible name; it does not replace one.

Button tooltips appear after 700ms of hover. After a tooltip closes, neighboring tooltips appear immediately within a 300ms window so users can explore related controls.

Use landmarks, descriptive headings, labels, and native controls. Keep keyboard navigation usable and never communicate state through color alone. Collapsed panels remain inert and hidden from assistive technology while preserving their mounted content state.

## Motion

Default to stillness. Animate a state change when it helps the user follow the interface. Use short color transitions for controls and the existing 200ms width and padding transitions for panel toggles.

Respect `prefers-reduced-motion`, including when a transition comes from an inline style. Keep resizing immediate. Preserve panel keyboard shortcuts, keyboard resizing, and pointer behavior when changing their appearance.

Use CSS transitions for simple changes. Add Motion for React only when layout animation, enter/exit behavior, or gestures justify it. Avoid decorative pulsing, bounce, parallax, and scroll reveals that delay access to content.

## Review changes

For visual changes, inspect the affected screens in light and dark themes and at desktop and narrow widths. Check text wrapping, focus, tooltips, selection, and overflow. For frame changes, exercise navigation, panel toggles, shortcuts, and resizing.

Run checks appropriate to the change. `pnpm verify` runs formatting, lint, type checks, existing tests, and the production build. Update this guide when a shared design convention changes.
