# Jeevan Reddy Ragula — Portfolio

Personal portfolio and **Career OS presentation layer** for Jeevan Reddy Ragula.

This is a lightweight static website built with HTML, CSS, JavaScript, and JSON. The existing dark/glass/cyan/violet visual design is intentionally framework-free.

## Architecture

```
Career OS / Career Data
        ↓
data/career.json
        ↓
app.js
        ↓
index.html + index.css
        ↓
GitHub
        ↓
Vercel
```

**Source of truth:** career and profile content belongs in `data/career.json`. Avoid duplicating career facts across HTML and JavaScript.

## Project Structure

```text
portfolio/
├── data/
│   └── career.json
├── docs/
│   ├── ARCHITECTURE.md
│   ├── DEVELOPMENT.md
│   ├── TESTING.md
│   ├── CONTRIBUTING.md
│   └── SECURITY.md
├── index.html
├── index.css
├── app.js
└── README.md
```

## Requirements

- Git
- Python 3 or another static HTTP server
- Modern browser

No Node.js, npm, framework, or build tool is required.

## Run Locally

The page loads `data/career.json` with `fetch()`, so use an HTTP server instead of opening `index.html` directly.

### Python

```bash
git clone https://github.com/jeevanragula/portfolio.git
cd portfolio
python3 -m http.server 8080
```

Open **http://localhost:8080**.

### Node.js (optional)

```bash
npx serve .
```

## Build

There is currently **no build step**. The repository itself is the deployable static artifact.

## Update Career Information

For career/profile changes, update:

```text
data/career.json
```

Examples:

- Designation or promotion
- Role history and dates
- Product ownership
- Architecture responsibilities
- Technologies
- Patents
- Open-source contributions
- Achievements
- Contact/profile information

The browser renderer consumes this data at runtime.

## Deployment

The intended flow is:

```text
git push → GitHub → Vercel → Production
```

When the repository is connected to Vercel, production-branch pushes can trigger deployment automatically.

## Documentation

- [Architecture](docs/ARCHITECTURE.md) — source-of-truth and rendering architecture
- [Development](docs/DEVELOPMENT.md) — local development workflow
- [Testing](docs/TESTING.md) — validation and smoke tests
- [Contributing](docs/CONTRIBUTING.md) — contribution and change guidelines
- [Security](docs/SECURITY.md) — secrets and public-information guidance

## License

Personal portfolio project. Unless otherwise stated, content and branding are © Jeevan Reddy Ragula.
