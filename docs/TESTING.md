# Testing and Validation

Testing focuses on data loading, browser behavior, responsive layout, and production deployment.

## Pre-Commit Checklist

- [ ] Full name is **Jeevan Reddy Ragula**
- [ ] Current designation is correct
- [ ] Career dates are correct
- [ ] Products and patents are accurate
- [ ] Contact links are correct
- [ ] `data/career.json` loads with HTTP 200
- [ ] No unexpected browser-console errors
- [ ] Navigation and mobile menu work
- [ ] Terminal commands work
- [ ] Skill bars render
- [ ] IaC simulator works
- [ ] Contact-form UI works
- [ ] Desktop, tablet, and mobile layouts checked

## Manual Smoke Test

```bash
python3 -m http.server 8080
```

Then verify in browser developer tools:

```text
Console → no unexpected errors
Network → data/career.json → 200
```

Try terminal commands:

```text
help
bio
skills
products
patents
contact
clear
```

## Production Smoke Test

After deployment:

1. Open the Vercel production URL.
2. Hard refresh.
3. Check the console.
4. Verify `data/career.json` loads.
5. Test responsive layout.
6. Verify external links.
