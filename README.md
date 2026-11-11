# 2dear

**Quà biết nói** — [2dear.app](https://2dear.app): a teddy bear or an online card that
carries a letter in text and real voice. The recipient scans the QR card, enters
their phone number and opens the letter in the browser; no app to install.

| Service | Stack | Local |
| --- | --- | --- |
| [`web/`](web/) | Next.js App Router, React 19, Tailwind 4, [2ui](https://www.npmjs.com/package/@tofound/ui) | `cd web && pnpm install && pnpm dev` → http://localhost:3420 |
| [`api/`](api/) | Bun, Hono, Zod | `cd api && bun install && bun run dev` → http://localhost:8120 |

Architecture: [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md). Contributor and agent
rules: [AGENTS.md](AGENTS.md). Deploy and release: [RELEASE.md](RELEASE.md)
(2server). Generated from the [2build starters](https://2found.dev/docs/2build/starters/index.md).

Licensed under the [Apache License 2.0](LICENSE).
