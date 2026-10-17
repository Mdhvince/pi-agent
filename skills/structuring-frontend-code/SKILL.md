---
name: structuring-frontend-code
description: Structure and verify frontend code. Use when writing or editing HTML, templates, CSS, or client-side JavaScript, while preserving the project's existing architecture.
---

# Frontend code structure
Use this skill when writing or editing HTML, templates, CSS, or client-side
JavaScript.

## Separation of concerns
- **JavaScript**: no JS embedded in HTML files. Use separate `.js` files linked with `<script src="...">`.
- **CSS**: no `<style>` tags, no inline `style` attributes. Use separate `.css` files linked with `<link rel="stylesheet" href="...">`.

## Template logic
- **Backend-first logic**: keep complex logic out of HTML templates (Jinja2, Django templates...).
- **View preparation**: data processing, filtering, and complex conditional logic happen in the view file; expose the processed result to the template.
- **Clean templates**: templates only handle simple variable rendering and basic display logic. Complex loops or nested conditionals in a template -> refactor that logic into the view.

## Verify the result
- Run relevant existing tests, linting, and type checks. Add a focused behavior test when an interaction changes.
- For visual or interaction changes, inspect the rendered result with realistic content at a narrow and a wide viewport. Check the affected interaction, keyboard access, focus, and overflow.
- Preserve routes, UI language, validation, and existing workflows. Use a local or approved test environment; do not exercise production writes during verification.
- Report the checks actually run. If rendering is unavailable, say that the visual result is unverified; source inspection alone does not establish that the page works.
