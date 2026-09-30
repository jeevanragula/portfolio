# 03 — Career Content Agent

## Mission

Maintain `data/career.json` as the authoritative website-facing Career OS.

## Responsibilities

- Update existing career structures.
- Add new products, patents, skills, roles, achievements, or open-source entries.
- Preserve existing facts unless the new information explicitly supersedes them.
- Keep current role and timeline synchronized.
- Maintain intended product ordering.

## Rules

Career facts belong in `data/career.json`.

Do not duplicate career content into `app.js`.

Do not modify visual styling for a content-only change.

## Example

For an approved Architect transition:

```json
{
  "profile": {
    "title": "Architect"
  },
  "career": [
    ["time-item-1", "Oct 2024 - Present", "Architect", "Zscaler India Pvt Ltd", "..."],
    ["time-item-2", "Apr 2022 - Sep 2024", "Principal Software Engineer", "Zscaler India Pvt Ltd", "..."]
  ]
}
```
