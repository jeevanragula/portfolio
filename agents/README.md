# Career OS Agents

The Career OS uses specialized agents instead of one unrestricted agent.

## Agent pipeline

```
New career information
        ↓
01 Intake Agent
        ↓
02 Fact & Privacy Agent
        ↓
03 Career Content Agent
        ↓
04 Portfolio Sync Agent
        ↓
05 QA Agent
        ↓
06 Release Agent
        ↓
GitHub → Vercel
```

Each agent has a narrow responsibility and an explicit handoff contract.

## Agents

| Agent | Responsibility | Can change public data? |
|---|---|---|
| Intake | Normalize new information into proposed facts | No |
| Fact & Privacy | Check dates, contradictions, confidence, confidentiality | No |
| Career Content | Convert approved facts into Career OS structures | Yes, after approval |
| Portfolio Sync | Ensure the UI consumes the source-of-truth data | Yes |
| QA | Validate schema, links, rendering assumptions, content consistency | No |
| Release | Commit/push approved changes and trigger deployment | Yes, with release gate |

## Safety model

Agents must not invent:

- Job titles
- Dates
- Employers
- Responsibilities
- Metrics
- Patents
- Customer names
- Confidential architecture
- Internal company information

If information is ambiguous, the agent creates a **review item** rather than guessing.

## Operating modes

### Assisted mode

Recommended default.

The user provides new information and the agents prepare and validate the change. The user approves before public release.

### Automatic mode

Can be enabled after the workflow is trusted. Only low-risk changes with high-confidence facts should auto-release.

Examples of low-risk changes:

- Typo correction
- Link correction
- Explicitly supplied title/date update
- Reordering content already approved

Sensitive or ambiguous changes require approval.

## Shared contracts

Each agent follows the workflow contract in [career-os.yaml](../career-os.yaml).
