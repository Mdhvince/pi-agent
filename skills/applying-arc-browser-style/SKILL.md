---
name: applying-arc-browser-style
description: >
  Apply an Arc Browser-inspired interface to any app while preserving its purpose,
  workflows, and technology stack. Use when the user requests Arc style, an
  Arc-like UI, or an Arc-inspired redesign. Covers the app frame, sidebar,
  inset content canvas, geometry, spacing, typography, controls, motion,
  optional palettes and fine grain textures, responsive behavior, and accessibility.
---

# Applying Arc Browser style

Adapt Arc's layout and interaction patterns to the app. Make the main task the
largest, clearest part of the interface. Keep navigation compact and related
controls close together. A rounded card alone does not establish this style.

## Inspect before changing

1. Read the target app's layout, shared components, design tokens, and relevant
   tests. Inspect the rendered interface when possible.
2. Identify the primary task, navigation, context controls, and secondary actions.
   Preserve routes, data, UI language, validation, and current workflow behavior.
3. Use the user's reference image when provided. Otherwise, use the patterns below.
   These are adaptation guidelines, not an official Arc design specification.
4. Briefly state which shared components will change. Start with one representative
   screen, then extend the same treatment to the requested scope.

Do not change the framework, install a UI library, or replace working components
just to reproduce the appearance.

## Establish the layout

For workspace apps, use a compact sidebar beside one dominant, inset content
canvas. The sidebar belongs to the outer frame; it is not another floating card.
Give the canvas a continuous rounded boundary and consistent outer spacing.
Its internal header shares the canvas background and texture, without a separate
flat band. Paint the surface once on the canvas and keep the internal header
transparent so the grain continues without a seam.

```text
App frame
+----------------------+----------------------------------------------+
| Sidebar              | Inset content canvas                         |
| Identity / context   | Compact page header and contextual actions   |
| Existing search      |                                              |
|                      | Main task, document, table, or results       |
| Primary destinations |                                              |
| Contextual items     |                                              |
|                      |                                              |
| Account / utilities  |                                              |
+----------------------+----------------------------------------------+
```

- Use the leading edge for navigation. Respect the app's text direction.
- Let content take the remaining space. Avoid a second full-width navigation bar
  that repeats the sidebar.
- Keep account and utility controls easy to find, separate from the main task.
- Place settings for the current view near that view, not among global links.
- Use spacing and alignment to group controls. Avoid a separate card or divider
  around every label, field, and section.
- Preserve useful reading widths inside the canvas. Let tables and editors use
  more width than prose and forms.

A sidebar is not mandatory. For a short form, storefront, or linear mobile flow,
use a compact context header and the inset canvas without invented navigation.
For marketing and reading pages, preserve document scrolling and section flow.
Use a workspace frame only where a real product view needs one.

## Map patterns to existing app behavior

| Arc pattern | App equivalent, when it exists |
| --- | --- |
| Sidebar | Primary navigation, a document list, or task controls and filters |
| Favorites | A small set of frequently used destinations or actions |
| Pinned items | Stable destinations or saved objects within the current context |
| Spaces | An existing project, team, account, or workspace switcher |
| Command bar | Existing search or action lookup in a compact input or popover |
| Peek | A short record preview that preserves the parent view |
| Split view | An existing comparison, editor-preview, or list-detail workflow |

Use only patterns that serve the app. Do not add favorites, tabs, workspaces,
command systems, or split panes as decoration. Do not copy Arc branding, browser
address bars, window controls, or browser-specific shortcuts.

## Set geometry and density

Prefer the app's existing scale. If it has none, use these starting ranges in
logical pixels or equivalent platform units, then adjust to the content.

| Element | Starting point |
| --- | --- |
| Outer frame inset | 8-12 on desktop; reduce on narrow screens |
| Sidebar width | 240-280, with enough room for real labels |
| Main canvas corner radius | 16-24 |
| Navigation rows and controls | 8-12 corner radius |
| Desktop navigation row | 32-40 minimum height; allow wrapping or expansion |
| Touch target | At least 44 by 44, including the interactive hit area |
| Compact page header | 44-56 minimum height; grow when actions wrap |
| Content padding | 20-32 on desktop; 16-20 on narrow screens |
| Spacing steps | 4, 8, 12, 16, 24, 32 |

Use a small, consistent radius scale. Smaller nested surfaces need smaller radii
that fit their padding. Reserve capsule shapes for short controls and badges;
do not make every container a pill.

Keep depth restrained. Use the frame, inset spacing, and a soft shadow where
needed to separate layers. Reserve stronger elevation for menus and dialogs.
Do not stack shadows on every nested element or depend on blur for separation.

## Palette and grain

Keep the app's palette unless the user requests a change. Preserve its current
light/dark mode even when a new palette is requested. A reference that shows dark
surfaces is not permission to switch a light app to dark mode, or the reverse.
Change mode only when explicitly requested; ask if the intended mode is unclear.

Map reference colors to existing semantic tokens instead of scattering hex values
through components. Arc supports varied themes. Adapt accents to the current mode
rather than copying every surface from a reference.

The third-party [Arc palette reference](https://www.colorpalettegenerator.ai/brands/arc-browser)
provides blue `#4F8CFF` and yellow `#FFD84D` accents. The following is an example
light adaptation, not an official Arc specification or a required palette:

| Role | Example value | Application guidance |
| --- | --- | --- |
| Page background | `#F8FAFF` | Cool near-white rather than warm cream |
| Outer frame | `#EEF2F9` | A slight cool tint around the content |
| Canvas and raised surfaces | `#FFFFFF` | Keep the main working area light |
| Decorative dividers | `#DBE1EB` | Use stronger boundaries where controls need them |
| Primary action fill | `#4F8CFF` | Pair with dark ink such as `#1C2434` |
| Links and small accent text | `#245AB9` | A deeper blue for readable text on light surfaces |
| Highlight | `#FFD84D` | Use sparingly; give highlighted labels dark ink |
| Main text | `#1C2434` | Primary content and important labels |
| Secondary text | `#505969` | Supporting copy |
| Metadata and placeholders | `#596171` | Keep small text readable over grain |

Separate filled-action colors from text colors. White on `#4F8CFF`, and `#4F8CFF`
on white, fail normal-text contrast. Adapt success, warning, and error colors to
the current surfaces while preserving their semantic meanings.

Check actual foreground/background pairs, hover states, placeholders, and inherited
opacity. Normal text needs at least 4.5:1; large text and essential non-text
indicators need at least 3:1. Include the final texture in the visual check.

If grain is requested, make it fine, static, and visible at normal viewing size.
Do not add a barely detectable layer and call the task complete. Apply it to the
frame or canvas background, not over text, images, or controls. Keep forms and
dense content easy to read. Do not lower the opacity of an entire container.

For the web, a small local SVG tile can provide seamless monochrome noise:

```svg
<svg xmlns="http://www.w3.org/2000/svg" width="256" height="256" viewBox="0 0 256 256">
  <filter id="grain" x="0" y="0" width="100%" height="100%" color-interpolation-filters="sRGB">
    <feTurbulence type="fractalNoise" baseFrequency="0.88" numOctaves="3" seed="7" stitchTiles="stitch"/>
    <feColorMatrix type="saturate" values="0"/>
  </filter>
  <rect width="100%" height="100%" filter="url(#grain)" opacity="0.12"/>
</svg>
```

Put the tile in the app's existing asset directory and use it as a repeating CSS
background image over the base surface color. Preserve it when editing background
shorthands. For visible fine grain, start around 0.08-0.16 opacity, then adjust
for the surface and rendered text contrast. Inspect at normal size, not only in a
magnified crop. Keep a fixed seed to prevent visual changes
between renders. A small pre-rendered image is also suitable.

Prefer a background layer over an overlay. If an overlay is necessary, keep it
behind content, non-interactive, and outside the accessibility tree. Do not add a
JavaScript loop, animated noise, or a new rendering dependency. Respect forced-color
and increased-contrast preferences by removing decorative texture when appropriate.
Use equivalent static background assets on native platforms. Do not add a theme or
texture picker unless the user asks for one.

For a full palette change, also inspect browser theme metadata, native control
appearance, scrollbars, menus, dialogs, alerts, and focus indicators. On the web,
keep `color-scheme` consistent with the preserved mode. Preserve established brand assets.

## Typography and controls

- Reuse a readable UI typeface already in the app or its platform. Do not require
  a particular font download.
- Keep navigation compact but readable. Start around 13-14 for desktop controls
  and 14-16 for content, without shrinking text to hide layout problems.
- Use regular weight for body text and medium or semibold for active items and
  key labels. Keep headings proportional to the task rather than oversized.
- Prefer sentence case. Keep metadata subordinate through size, weight, and
  placement. Use monospaced text only where it helps, such as code or shortcuts.
- Align icons and labels on a stable grid. Reuse one icon family and consistent
  stroke weights. Avoid unrelated decorative icons.
- Give repeated navigation items a full-row target and an explicit current state.
  On the web, use links for destinations and `aria-current` where appropriate.
- Keep primary actions visible. If secondary actions appear on hover, also show
  them on keyboard focus and provide a usable touch equivalent.
- Icon-only controls need accessible names. Tooltips must work on focus as well
  as hover; they must not be the only accessible label.

## Interaction and motion

Restyle existing interactions before adding new ones. Keep hover, focus, pressed,
selected, disabled, and loading states distinct through shape, outline, weight,
text, or a state indicator. Focus must remain visible without waiting for motion.

Use short transitions for feedback, roughly 120-180 ms. Pane and dialog transitions
can take 180-240 ms. Treat these as starting points, not exact Arc timings. Prefer
small movement and opacity changes over large slides, repeated bounce, or animation
that shifts surrounding content. Respect reduced-motion preferences.

If the app has a sidebar toggle, keep it reachable in both states. Never make
hover at the viewport edge the only way to recover navigation.

For existing previews or dialogs, keep the parent selection and scroll position.
Provide an explicit close action and, when relevant, a way to open the full view.
Modal surfaces need correct focus entry, containment, Escape handling, and focus
return. Do not trap focus in a non-modal panel or discard edits on dismissal.

Preserve normal links, deep links, and Back behavior. Do not turn navigation into
a modal solely for appearance. Keep the app's established keyboard shortcuts and
leave reserved browser and platform shortcuts alone.

## Responsive behavior

- Collapse the two-column layout when the content becomes cramped, not at an
  arbitrary device label. Allow the main region to shrink without page overflow.
- On narrow screens, use one primary column. Put secondary navigation or filters
  in an accessible drawer or disclosure only when needed.
- Reduce the outer frame before reducing usable content or text size. A nearly
  edge-to-edge canvas is appropriate on small screens.
- Keep the current context and primary action visible. Support long labels,
  localization, safe areas, and an open on-screen keyboard.
- Give each region one clear scroll owner. Separate sidebar and canvas scrolling
  can suit a desktop workspace; prefer document scrolling for linear mobile flows.
- On the web, use flexible grid or flex tracks with appropriate minimum sizes.
  Use dynamic viewport units only for genuine full-height workspaces. Do not clip
  content, focus indicators, menus, or validation messages to preserve a shape.

## Implement and verify

Change shared layout primitives and existing tokens first. Avoid a second layer
of broad CSS overrides. Keep markup, styling, and interaction logic in their
established files or components; do not embed scripts or style attributes in HTML
templates. Keep business logic out of presentation changes.

Inspect the result with real content, including long titles, dense lists, empty
results, errors, and loading states. Check a narrow phone-sized viewport, an
intermediate width, and a wide desktop view. Also check enlarged text and 200% zoom.

Verify that:

- The main task dominates; navigation remains compact and easy to locate.
- Insets, alignment, radii, and control density are consistent across screens.
- The app keeps its existing light/dark mode unless a switch was explicitly requested.
- Text, controls, and focus indicators remain readable on the final surfaces.
  Grain stays subtle, stationary, and behind content, with no interaction cost.
- Essential actions and current state are understandable without hover.
- Keyboard users can reach every action and recover from drawers and dialogs.
- Content remains reachable without accidental page-wide horizontal scrolling.
  Intentional scrolling inside a wide data table is acceptable.
- Reduced motion, form validation, and existing navigation behavior still work.
- Relevant behavior tests and available visual checks pass. Add a focused test
  if an interaction changes, rather than testing arbitrary styling constants.

Report the surfaces changed and the checks actually run. If rendering or browser
tools are unavailable, say that visual fidelity is unverified. Do not claim an
Arc match from source inspection alone.

## References

The following official guides document the interaction patterns, not the suggested
sizes, timing ranges, or optional third-party palette above. The workflow does not
require a live network connection.

- [Favorites](https://resources.arc.net/hc/en-us/articles/19230755904151-Favorites-Top-Tabs-Across-Every-Space)
- [Pinned tabs](https://resources.arc.net/hc/en-us/articles/19231060187159-Pinned-Tabs-Tabs-you-want-to-stick-around)
- [Peek](https://resources.arc.net/hc/en-us/articles/19335302900887-Peek-Preview-Sites-From-Pinned-Tabs)
- [Command bar and split view](https://start.arc.net/master-multitasking)
