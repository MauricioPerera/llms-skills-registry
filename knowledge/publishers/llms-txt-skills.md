---
type: Publisher
title: llms-txt-skills (the standard itself)
description: The spec publishes its own knowledge - 6 concepts covering the standard, adoption ladder, trust model, executable skills and consumption paths - plus a custom validator skill. Signed freshness attestations included.
origin: https://mauricioperera.github.io/llms-txt-skills
verify: project
timestamp: 2026-07-10
---

# llms-txt-skills

The standard dogfoods itself: its GitHub Pages publishes a 6-concept OKF
bundle (what the standard is, adoption ladder L0-L3, trust model, executable
skills, publishing, consuming) with `search_knowledge`/`get_concept`/
`list_concepts`, a custom `validate_skill_line` skill, a demo-signed index,
and signed knowledge-freshness attestations gated in CI.

## Consume

Project page (origin-collapse applies): consume via the root origin — its
skills are aggregated there — or locally:

```
git clone https://github.com/MauricioPerera/llms-txt-skills
npx -y @rckflr/mcpwasm --serve ./llms-txt-skills/docs
```

## Topics

The llms.txt Skills standard, RFC v0.10, extensions v0.5/v0.4, freshness.
