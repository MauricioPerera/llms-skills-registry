# llms-skills registry

The publisher directory of the [llms-txt-skills](https://mauricioperera.github.io/llms-txt-skills/)
ecosystem — and the answer to *"how does an agent FIND the sites that publish
skills?"*.

The design is the ecosystem's thesis applied to itself: **the registry is a
publisher too**. Each registered origin is one OKF markdown concept under
[`knowledge/publishers/`](knowledge/publishers/); the whole directory is
served as a hash-pinned, searchable knowledge base that **any MCP agent can
query** — no server, no central API, no gatekeeper beyond a pull request.

```bash
git clone https://github.com/MauricioPerera/llms-skills-registry
npx -y @rckflr/mcpwasm --serve ./llms-skills-registry
# -> search_knowledge("payments demo")  -> the publisher that serves it
# -> list_concepts()                    -> every registered origin
```

The registry is also aggregated at the root origin under the `registry`
scope, so agents get it with zero setup:

```bash
npx -y @rckflr/mcpwasm https://mauricioperera.github.io
# -> registry__search_knowledge, registry__list_concepts
```

## Trust: the registry doesn't trust its entries either

CI re-verifies **every registered origin live** — on each push and weekly
(`scripts/verify-publishers.mjs`): the origin's `llms.txt` must be alive
with executable skills, and every declared `tool_sha256` must match the
bytes actually served. A dead or dishonest publisher turns the badge red.

The registry itself is validated by the standard's own
[GitHub Action](https://github.com/MauricioPerera/llms-txt-skills#github-action)
plus the snapshot drift check.

## Register your origin

1. Publish skills on your site (fastest path: the
   [llms-skills-template](https://github.com/MauricioPerera/llms-skills-template)).
2. Open a PR adding ONE file: `knowledge/publishers/<your-origin>.md` with
   frontmatter:

   ```markdown
   ---
   type: Publisher
   title: <name>
   description: <one line - this is what agents find when they search>
   origin: https://<your-origin>
   verify: root          # root | project | none
   timestamp: 2026-07-10
   ---

   # <name>

   What you publish, topics covered, and how to consume it.
   ```

   `verify: root` for origins consumable directly; `verify: project` for
   GitHub project pages (paths resolve against the page directory);
   `verify: none` skips live verification (discouraged).
3. Run the two build commands and commit the regenerated artifacts:

   ```bash
   npx -y @rckflr/llms-skills memory knowledge
   npx -y @rckflr/llms-skills publish
   ```

CI verifies your origin live before the PR merges. That's the whole process.

## License

MIT.
