---
type: Publisher
title: KDD (Knowledge Driven Development)
description: A real pre-existing OKF bundle with 40 concepts about the KDD methodology - contracts, validators, project templates. Also aggregated at the root origin under the kdd scope.
origin: https://mauricioperera.github.io/KDD
verify: project
timestamp: 2026-07-10
---

# KDD

Knowledge Driven Development: a methodology where project knowledge lives as
an OKF bundle and drives contracts and validation. Its 40 concepts are
published as a searchable, hash-pinned knowledge base.

## Consume

Directly from the root origin (aggregated under the `kdd` scope):

```
npx -y @rckflr/mcpwasm https://mauricioperera.github.io
# -> kdd__search_knowledge, kdd__list_concepts
```

Or locally with the full bundle (includes get_concept):

```
git clone https://github.com/MauricioPerera/KDD
npx -y @rckflr/mcpwasm --serve ./KDD
```

## Topics

KDD methodology, OKF contracts, project initialization, validation.
