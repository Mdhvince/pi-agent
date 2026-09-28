---
name: structuring-frontend-code
description: Frontend separation of concerns.
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
