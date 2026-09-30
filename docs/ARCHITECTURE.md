# Portfolio Architecture

## Goal

Keep career information independently maintainable while preserving the existing visual design.

## Source of Truth

`data/career.json` is the authoritative website-facing career data. It contains profile information, role history, products, patents, skills, open source, contact information, and terminal commands.

## Presentation Layer

- **index.html** — stable page structure and semantic DOM.
- **index.css** — visual design system and responsive layout.
- **app.js** — loads career data and renders it into the existing DOM, plus browser interactions.

Career facts should not be maintained in multiple places.

## Data Flow

```
career.json → fetch() → app.js → existing DOM → index.css
```

## Career Timeline

Use real transition dates so the website communicates progression. For example, the current data records the transition from Principal Software Engineer to Architect in October 2024.

## Deployment

The site is static:

```
GitHub → Vercel → Browser
                     ↓
              career.json
```

No application server or database is required.
