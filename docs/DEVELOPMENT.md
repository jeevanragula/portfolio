# Development Guide

## Prerequisites

- Git
- Python 3 or another static HTTP server
- Modern browser
- Node.js is optional

## Clone and Start

```bash
git clone https://github.com/jeevanragula/portfolio.git
cd portfolio
python3 -m http.server 8080
```

Open **http://localhost:8080**.

Or, with Node.js:

```bash
npx serve .
```

## Development Workflow

1. Make the change in the appropriate source file.
2. Put career/profile changes in `data/career.json`.
3. Run the local server.
4. Check the browser console.
5. Test desktop and mobile layouts.
6. Follow [TESTING.md](TESTING.md).
7. Commit with a focused message.
8. Push to GitHub.
9. Verify the Vercel deployment.

## Content Changes

Prefer `data/career.json`. Avoid hardcoding the same career fact in HTML and JavaScript.

## UI Changes

Preserve the existing dark/glassmorphism design, cyan/violet accents, responsive behavior, and reusable CSS classes unless a redesign is explicitly requested.

## Adding a New Career Section

1. Add the data model to `data/career.json`.
2. Add a stable HTML container.
3. Add rendering logic in `app.js`.
4. Add styles in `index.css`.
5. Test desktop and mobile.
6. Update architecture documentation if needed.
