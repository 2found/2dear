# AGENTS.md

**2dear** — "Quà biết nói" (2dear.app): a teddy bear or an online card carrying a
letter in text and real voice, opened by scanning a QR card. Two services, each
generated from a 2build starter (release 0.2.0) and kept to its own rules.
Public repository `2found/2dear` (Apache-2.0), checked out as the `2dear`
submodule of the private kiem-lai workspace: links that start with `../` (product
requirement, prototype, platform Postgres, 2build) resolve only inside that
workspace — never copy their content into this public repo.

- **web** (`dear-web`) — Next.js + 2ui frontend (`web/`) — [web/AGENTS.md](web/AGENTS.md),
  [ARCHITECT-WEB.md](web/docs/ARCHITECT-WEB.md): read before adding a route, page,
  data fetch or cache.
- **api** (`dear-api`) — Bun + Hono REST API (`api/`) — [api/AGENTS.md](api/AGENTS.md),
  [ARCHITECTURE-API.md](api/docs/ARCHITECTURE-API.md): read before adding a module,
  route, database or external service.
- **System** — [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md): boundaries, invariants
  and key decisions between the services; read before any change that crosses
  web ↔ api or touches orders, letters, read codes, audio or payments. Next horizon
  and scaling triggers: [docs/architecture-next.md](docs/architecture-next.md).
- **Product** — [requirement](../docs/2dear/requirement.md) (cite its IDs in plans
  and tests) and the approved [design + prototype](../docs/2dear/design.md).
- **Design** — [web/DESIGN.md](web/DESIGN.md): 2ui with the 2dear theme; read before
  any visual or UI change. LoHi's root `DESIGN.md` does not apply here.
- **Deploy and release** — [RELEASE.md](RELEASE.md): 2server Apps on the `lohi-app`
  VM; read before any deploy. App files: `web/2server/deploy.yaml`,
  `api/2server/deploy.yaml`.

## Hard constraints

The parent repo's hard constraints (Drizzle only, no big-table rewrites, fuzzy
index-backed search, credentials, operational data served by the api) apply here
too. 2dear-specific invariants are numbered in
[docs/ARCHITECTURE.md § Invariants](docs/ARCHITECTURE.md#invariants); the ones
most often at risk:

- Product pages never read identity; private pages are `noindex` and never cached.
- Prices and plans come from the api; clients never compute a price.
- Letters and audio are reachable only through a valid read code (+ recipient
  phone); nothing lists them.
- `first_opened_at` is written only by a real recipient open.

## Run

```bash
cd api && bun run dev     # http://localhost:8120
cd web && pnpm dev        # http://localhost:3420 (API_URL defaults to the api above)
```

## Verify

```bash
cd api && bun run typecheck && bun run test && bun run build
cd web && pnpm run lint && pnpm run typecheck && pnpm test && pnpm run build
```

CI: [.github/workflows/check.yml](.github/workflows/check.yml) runs both lists.

## Starter updates

Each service has its own `.babysit/starter.lock.yaml`; run
`bbs starter check --dir <service> --json` and follow the service AGENTS.md.

## 2build

This repo is configured for 2build autonomous runs.

- Git: autopilot leaves work uncommitted; the lead commits once per phase and lands it on the base branch
- QA harness: `.babysit/qa.yaml` (both services; each service also has its own)
- Production release: read [RELEASE.md](RELEASE.md), then use `/bbs:release`; `--local` runs delivery from this machine when CI is unavailable. Setting up this profile does not execute a release.
- Browser: for any UI check — open a URL, click a flow, read console errors, screenshot — invoke `/bbs:browse` (or `/bbs:qa` for a full loop). These drive a real Chromium via `agent-browser`; there is no separate browser *tool* to look for, and `WebFetch` is not a substitute. One-time: `npm install -g agent-browser cloakbrowser`.
- Browser hygiene: automation uses its own browser (Chrome for Testing, Playwright or cloakbrowser), never the installed Chrome. End every browser run with the tool's own close (`agent-browser --session "$AGENT_BROWSER_SESSION" close`), never `kill`/`pkill`/`close --all`, and check what still uses a stale browser or profile clone before reaping it. See `/bbs:browse` § Browser hygiene.
- Default run: `/goal "STATUS: DONE or STATUS: BLOCKED appears" /bbs:autopilot "<task>"`
- Search: use `rg`, never `grep`. `rg -uu` includes gitignored and hidden files; skip noise with `-g '!node_modules' -g '!.git' -g '!.next'`. List files with `rg --files -uu`.

QA must prove the local target or name the blocker, and must include at least one non-happy-path case before PASS.
