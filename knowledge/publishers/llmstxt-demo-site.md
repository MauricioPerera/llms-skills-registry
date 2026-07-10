---
type: Publisher
title: llmstxt-demo-site (Workers demo)
description: The original demo publisher on Cloudflare Workers - executable skills including a POST write skill (create_payment against a real D1 stock), plus origin memory. Consumed by the reference gateway's CI.
origin: https://llmstxt-demo-site.rckflr.workers.dev
verify: root
timestamp: 2026-07-10
---

# llmstxt-demo-site.rckflr.workers.dev

The first live publisher of the ecosystem and the gateway's field-test
target: `sum_numbers`, `server_time` (uses `host.fetchOrigin`), and the
write-skill demo (`create_payment`/`refund_payment` against a real D1
database) exercised by mcpwasm's production-integration CI job.

## Consume

```
npx -y @rckflr/mcpwasm https://llmstxt-demo-site.rckflr.workers.dev
```

## Topics

Demo skills, sandboxed execution, origin-scoped fetch, write operations.
