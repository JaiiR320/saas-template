# Styling and text

The workspace uses Tailwind v4 and local shadcn-style Button and Tooltip components backed by Radix. Icons come from `lucide-react`. Panel content uses HTML elements and Tailwind classes.

## Load the stylesheet

Import `@saas-template/workspace/styles.css` once in the app entry, or in the root layout for Next.js. The stylesheet supplies Tailwind, baseline styles, the frame's styles, and color tokens. Vite apps need the `@tailwindcss/vite` plugin. [Getting started](../01-gettingStarted.md) shows the configuration.

There is no JavaScript `theme` export or theme provider. The package's Button and Tooltip components are internal to the frame; apps can keep their own local shadcn components for page content.

## Typography and visual style

The theme follows [Vercel's design guidance](https://vercel.com/design.md) with self-hosted Geist Sans for text and Geist Mono for code, neutral surfaces, subtle borders, and restrained six-pixel corner radii. Use `font-sans` for interface text and `font-mono` for code or technical identifiers. Focus rings use blue so keyboard focus stays visible in both themes.

## Color tokens and dark mode

The stylesheet defines standard shadcn CSS variables such as `--background`, `--foreground`, `--primary`, `--primary-foreground`, `--muted`, `--muted-foreground`, and `--border`. Tailwind maps these to utilities such as `bg-background`, `text-foreground`, and `border-border`. The current page's side bar icon uses the primary color.

Panel content can use the same tokens:

```tsx
<p className="text-sm text-muted-foreground">No reports yet</p>
```

Override the CSS variables in app styles loaded after the workspace stylesheet to change colors across the frame and page content. Add the `dark` class to the document root to select the dark token values:

```ts
document.documentElement.classList.toggle("dark", darkMode);
```

The shell owns the user's color preference and any persistence. `Workspace` does not choose or store a color mode.

## Text trimming

The exported `textBoxTrim` style uses CSS `text-box: trim-both cap alphabetic` to trim text to its cap height and baseline. A font reserves uneven space above and below its letters, so untrimmed text can sit slightly high next to an icon. Apply trimming directly to the element containing the text:

```tsx
import { textBoxTrim } from "@saas-template/workspace";

<span className="block text-sm" style={textBoxTrim}>
  3 selected
</span>;
```

The frame's title rows use the same untrimmed 20-pixel line height for side-panel titles, breadcrumb labels, and separators. This keeps their vertical alignment consistent, including in browsers without `text-box` support.

### Where trimming applies

`text-box` applies to the element that directly contains the text, and only when that element is a block or an inline box. A flex or grid container ignores it, and child elements do not inherit it. Wrap a label inside a flex container in a text element and apply the style there.

Inline text is trimmed against the font of the block that contains it. When labels of different sizes share a line, make each label a block so each is trimmed against its own font.

### Height and clipping

Trimming removes the line-height space that some components use for their height. A component sized by its text may need padding after trimming. Text with clipped overflow can also lose the parts of letters that extend past the cap height and baseline, like the tail of a "g". Leave enough vertical space for those letters, or use an untrimmed line box for clipped labels. Browsers without `text-box` support retain the normal line-height space.

[Back to the docs home](../README.md)
