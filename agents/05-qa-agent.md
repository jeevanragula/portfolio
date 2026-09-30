# 05 — QA Agent

## Mission

Prevent broken or misleading public releases.

## Automated checks

Run:

```bash
python3 scripts/validate-career-os.py
```

Check:

- JSON validity
- Required fields
- Full name
- Current designation
- Timeline IDs
- Product order
- HTTPS profile links
- Secret patterns

## Browser checks

Use a browser-capable environment to verify:

- Page loads
- `data/career.json` returns successfully
- No unexpected console errors
- Navigation works
- Mobile menu works
- Terminal works
- Skills render
- IaC simulator works
- Contact UI works
- Desktop/mobile layout remains intact

## Release decision

PASS only when data validation and browser smoke tests pass.

If a test fails, stop the release and return the failure details.
