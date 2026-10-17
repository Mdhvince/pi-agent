---
name: structuring-frontend-code
description: Structure and verify frontend code. Use when writing or editing HTML, server templates, CSS, JavaScript, TypeScript, or frontend components. Apply rules for the project's stack and preserve its existing architecture.
---

# Frontend code structure
## Identify the stack
- Inspect project instructions, nearby components or templates, and the build setup before choosing file boundaries.
- Follow the project's established conventions. Apply the rules below only to the matching part of the application, including in mixed-stack projects.
- Do not restructure unrelated code to impose a preferred layout.

## Plain HTML and server-rendered templates
- Keep application JavaScript and reusable CSS in separate asset files, loaded through the project's existing build or static-file system. Avoid embedded scripts, `<style>` blocks, and inline styles unless required by the project's framework or existing conventions.
- For Jinja2, Django, and similar server templates, prepare data and complex business logic in the project's existing views or services. Keep templates focused on rendering and simple presentation logic.

## Component frameworks
- For React, Vue, Svelte, and similar frameworks, preserve the project's component structure, event handlers, data flow, and styling approach.
- Keep JSX/TSX, single-file components, scoped styles, or CSS-in-JS when the project uses them. Do not extract separate `.js` or `.css` files merely to apply the plain-HTML rules.
- Keep complex business logic in the layers already used by the project. Do not introduce a backend view layer or move ordinary component rendering logic out of components to satisfy server-template rules.

## Verify the result
- Run relevant existing tests, linting, and type checks. Add a focused behavior test when an interaction changes.
- For visual or interaction changes, inspect the rendered result with realistic content at a narrow and a wide viewport. Check the affected interaction, keyboard access, focus, and overflow.
- Preserve routes, UI language, validation, and existing workflows. Use a local or approved test environment; do not exercise production writes during verification.
- Report the checks actually run. If rendering is unavailable, say that the visual result is unverified; source inspection alone does not establish that the page works.
