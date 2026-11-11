# 2dear — Release profile

Contract: [2build release profile](../2build/skills/release/references/project-profile.md).
Nothing is deployed yet (2026-11-11); every `TODO(2build):` must be resolved before
the stage that needs it. This file grants no release permission.

| Field | Value |
| --- | --- |
| Identity/scope | Public repository `2found/2dear` (Apache-2.0, base `main`), checked out as the `2dear` submodule of kiem-lai. Two release units: `dear-api` (`api/`) then `dear-web` (`web/`); api first when a release changes a contract both use. A release here updates the kiem-lai submodule pointer only when the parent delivery is in scope. |
| Authority | Land on `main` of `2found/2dear` (Foreman commits once per phase). Production deploy only on an explicit owner request. Workflow suspension: N/A — no workflow deploys 2dear. |
| Version | TODO(2build): version source and tag template (e.g. `2dear-v<semver>` from `web/package.json`) — decided at the first production release. Both `package.json` are `0.x` starter values today. |
| Changelog | TODO(2build): changelog file (`CHANGELOG.md`) and baseline tag — created with the first release. |
| Verification | `cd api && bun run typecheck && bun run test && bun run build`; `cd web && pnpm run lint && pnpm run typecheck && pnpm test && pnpm run build`. Smoke: api `GET /readyz` 200 and an unknown route 404 envelope; web `/` 200 and `/missing` 404. |
| Normal executor | `.github/workflows/check.yml` runs the Verification commands (jobs `api`, `web`) on every push and pull request. It verifies only: no workflow builds images or deploys. |
| Local executor | The verification commands above, then image build + `2srv deploy` (Deploy row). This is the only path today. |
| Execution map | verify (local, per service) → build image `docker build --platform linux/amd64 -t <image>:<tag> .` in `<service>/` → push to `asia-southeast1-docker.pkg.dev/lohi-dev-lohi/docker/dear-<service>` → `2srv deploy -f 2server/deploy.yaml --image <image>:<tag> --apply` in `<service>/` → `2srv app dear-<service> get` shows healthy. TODO(2build): wrap this in `infra/gce/deploy.sh` like 2Novel's once the first deploy has been run by hand. |
| GitHub | N/A — no GitHub release for 2dear until a version policy exists. |
| Distribution | N/A — web app and API, no package published. |
| Deploy | 2server Apps `dear-api` and `dear-web` on GCE VM `lohi-app` (`lohi-dev-lohi`, `asia-southeast1-a`); public origin `https://2dear.app` (`/api` → `dear-api`). Config: `api/2server/deploy.yaml`, `web/2server/deploy.yaml`. Connection: the private, ignored `.2server/connection.json` of the kiem-lai checkout (`--connection ../../.2server/connection.json` from a service folder). No dev environment. Database: `dear` on the platform Postgres App (shared with 2Novel); VM secrets of app `dear-api`: `DATABASE_URL` (`dear_app`, DML only) and `MIGRATION_DATABASE_URL` (`dear_migrator`, used only in `preDeploy.secrets`). Migrations: none yet; with the first table, an api `preDeploy` Drizzle migration (5 s lock timeout) — DB changes survive a traffic rollback. Rollback: `2srv` traffic rollback to the previous image. TODO(2build): the `2dear.app` Cloudflare zone and the Google OAuth client must exist before the first deploy — founder. |
| Hypercare | TODO(2build): window and thresholds — proposal: 30 min after deploy, check `2srv app dear-api logs` 5xx and readiness every 5 min; any 5xx burst or failed readiness → roll back. |
| Local follow-up | N/A — no CLI or package to install. |
