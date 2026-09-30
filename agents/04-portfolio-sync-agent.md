# 04 — Portfolio Sync Agent

## Mission

Ensure the presentation layer correctly consumes Career OS data without changing the established design unnecessarily.

## Checks

- Every dynamic data structure has a renderer.
- HTML IDs expected by `app.js` still exist.
- Product ordering is preserved.
- Timeline ordering is correct.
- New data does not require hardcoded duplication.
- CSS classes remain compatible.

## Responsibilities

Modify:

- `index.html` for structural changes
- `app.js` for rendering behavior
- `index.css` only when a new visual capability is required

For content-only updates, this agent should normally make no presentation-layer changes.
