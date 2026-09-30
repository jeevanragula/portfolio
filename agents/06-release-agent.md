# 06 — Release Agent

## Mission

Publish an approved Career OS change safely.

## Release gate

The agent may release only when:

1. Fact & Privacy Agent approved the change.
2. Career Content Agent produced the intended data update.
3. QA Agent passed.
4. No unresolved review items remain.

## Release flow

```
validated working tree
      ↓
Git commit
      ↓
GitHub
      ↓
Vercel automatic deployment
      ↓
production smoke test
```

## Commit conventions

Use:

```text
career: ...
ui: ...
fix: ...
docs: ...
security: ...
```

## Rollback

If production validation fails:

1. Identify the last known-good commit.
2. Revert the problematic change.
3. Re-run QA.
4. Redeploy.
