# 2dear — Next-generation architecture

Horizon: Christmas 2026 sale (open before 5/12, deliver by 24/12) and Đợt 2 in
January 2027 (source: [requirement §7](../../docs/2dear/requirement.md#7-lộ-trình)) ·
current: [ARCHITECTURE.md](ARCHITECTURE.md) · measured load: unmeasured (nothing
deployed) · updated 2026-11-11

## For the owner

- **Hôm nay:** chưa có gì chạy thật. Thiết kế MVP là hai dịch vụ nhỏ (trang web và
  API) chạy chung máy chủ với LoHi và 2Novel, dùng chung cơ sở dữ liệu Postgres
  nhưng tách riêng một database. Với vài trăm đơn mùa Giáng sinh, cấu hình này
  thừa sức.
- **Thứ hỏng trước, và khi nào:** không phải tải. Rủi ro lớn nhất là máy chủ dùng
  chung: một sự cố hay một lần deploy của LoHi/2Novel có thể làm 2dear ngừng đúng
  tuần cao điểm.
- **Không an toàn ngay bây giờ:** chưa có. Database `dear` đã tạo ngày 11/11 trên
  Postgres dùng chung với 2Novel, nên tự có lịch sao lưu 12 giờ một lần. Trước khi mở
  bán vẫn phải thử khôi phục một lần có cả database `dear`.
- **Kế hoạch:** (1) dựng đủ MVP trên máy chủ chung; (2) chỉ tách máy riêng khi 2dear
  hoặc hàng xóm chiếm phần đáng kể CPU giờ cao điểm; (3) chỉ thêm hàng đợi việc nền
  khi nhắc viết thư, SMS hay TTS làm chậm request.
- **Làm ngay:** giữ các "đường nối" bên dưới (audio để ngoài database, job nhắc có
  khóa, mọi URL lấy từ config).
- **Bạn cần chốt:**

  | Câu hỏi | Mặc định nếu không trả lời | Giá nếu mặc định sai | Chốt trước |
  | --- | --- | --- | --- |
  | Mức gián đoạn chấp nhận được mùa Giáng sinh | best effort, một máy (assumed 2026-11-11) | mất đơn trong giờ sự cố | 1/12 |
  | Số đơn kỳ vọng đợt Giáng sinh | ≤ 500 đơn, ≤ 50 lượt mở thư/giờ lúc đỉnh (assumed 2026-11-11) | sai cỡ máy; vẫn đổi được bằng config | 1/12 |
  | 2dear ở lại repo này hay thành repo riêng | thư mục `2dear/` trong repo này | chuyển repo sau tốn một lần tách lịch sử | trước khi có người thứ hai làm |

## Drivers

| Driver | Load shape | Multiplier at horizon | Source |
| --- | --- | --- | --- |
| Product pages + ads/story traffic (PD1, H3) | read-heavy, viewer-identical | spikes after a post | assumed (requirement §2, 2026-11-11) |
| Studio recording upload (S1) | large-file write, few per order | ≤ 500 orders | assumed |
| Letter open on 4G in in-app browsers (O1, O6) | read, latency-sensitive, audio bytes | 24/12 evening peak | assumed |
| SePay webhook, reminders, SMS (C3, S6, C4) | async side effects | per order | requirement |
| AI draft and TTS (S3, S1) | slow third-party calls | per letter | requirement |

## Headroom: today → horizon

| Component | Peak today | Limit | Headroom | At horizon | Breaks? | Evidence |
| --- | --- | --- | --- | --- | --- | --- |
| dear-web, dear-api | unmeasured | 0.5 CPU, 384/256 MB each (`*/2server/deploy.yaml`) | unmeasured | unmeasured | not expected | deploy.yaml 2026-11-11 |
| Shared VM `lohi-app` (e2-standard-2) | TODO(2build): CPU/memory peak of lohi-app — `2srv` / monitoring App | 2 vCPU | unmeasured | unmeasured | unknown | — |

## Stage inventory

| Track | Stage | Status | Evidence |
| --- | --- | --- | --- |
| Safety | Recoverable data | partial | `dear` lives in the platform Postgres (GCS pgBackRest every 12 h, WAL, weekly restore check, `platform/TRANSLATE-DB-MIGRATION.md`); no drill yet since `dear` exists |
| Safety | Database not internet-reachable, app role without DDL | in place (shared App) | `platform/postgres.yaml` roles; ports not published |
| Safety | Alerts reach a person | partial | monitoring App exists; no 2dear rules |
| Safety | Observability floor | partial | starter request log with request ID; no route/duration dashboard |
| Safety | Secrets out of the repo | in place | VM secret references only |
| Load | Edge cache | absent | product pages are cacheable by design (invariant 1); no rule yet |
| Load | Isolate neighbours / own VM | absent | shares `lohi-app` (D2) |
| Load | Background jobs | absent | reminders planned in-process |
| Availability | Health checks, zero-downtime deploys | in place | 2server readiness + blue/green, `healthPath` set |

## Findings

| Id | Severity | Finding | Evidence | Smallest fix | Stage |
| --- | --- | --- | --- | --- | --- |
| F1 | high | One shared VM for the whole sale window | D2 | Freeze LoHi/2Novel infra changes 20–25/12; know the restore steps | Isolate neighbours |
| F2 | medium | No restore drill has run since `dear` was created (2026-11-11) | weekly check Sun 03:00 UTC | Confirm the next weekly check (or `2srv app postgres check-backup --apply`) restores `dear` before opening sales | Safety |
| F3 | medium | Web health check hits `/` (rendered page) | `2srv validate` advisory 2026-11-11 | Add a static `/healthz` route when the first real page lands | Remove waste |

## Next-gen design

The MVP design in [ARCHITECTURE.md](ARCHITECTURE.md#components) is the horizon
design; no further component is needed for the Christmas horizon.
**Stays the same:** two services, one origin, api as the only writer, shared
Postgres App.

## Roadmap

| Stage | Trigger | Prerequisites | Change | Watch for | Cost | Rollback | Verify | Status |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Edge cache for product pages | origin share of `/qua/*` GETs > 30 % in 2 of 3 daily peaks | invariant 1 holds; purge on catalog write | Cloudflare cache rule for `/qua/*` and `/` | private page cached | config | delete rule | `cf-cache-status: HIT` on `/qua/*`, MISS on private pages | seam ready |
| Background jobs (Postgres queue, `SKIP LOCKED`) | p95 of checkout/Studio requests > 1 s from SMS/TTS calls in 2 of 3 days | idempotent handlers | move reminders, SMS, TTS to a jobs table + worker | jobs failing silently | code | run inline again | oldest job age alert | waiting for trigger |
| Own VM for 2dear | 2dear or a neighbour > 50 % of `lohi-app` CPU at peak in 2 of 3 days, or owner requires isolation for 20–25/12 | URLs and DB URL from config | new 2server VM, move both Apps | DNS / data move | tens USD/month (TODO(2build): price e2-small at decision time) | move Apps back | readiness + HTTPS on new VM | waiting for trigger |

TODO(2build): CPU share per App on `lohi-app` is not collected per product — add to the monitoring App before the own-VM trigger can be read.

## Seams to keep now

| Seam | For stage | Check | Status |
| --- | --- | --- | --- |
| Product pages read no identity | Edge cache | invariant 1; no `cookies()` in `/qua` modules | to keep |
| Audio in object storage, never in Postgres | Own VM, more instances | api stores only object keys | to keep |
| Scheduled reminders take a DB lock | More instances | job claims rows with `FOR UPDATE SKIP LOCKED` | to build |
| `API_URL`, `DATABASE_URL`, bucket from env | Own VM | `src/lib/env.ts` in both services | to keep |

## Not yet

| Idea | Why not now | Trigger |
| --- | --- | --- |
| Redis cache | no repeated hot reads measured | DB CPU > 70 % from repeated reads |
| Second api replica | in-process reminder job; tiny load | owner availability target under an hour a month |
| Separate Postgres cluster | shared App isolates by database and role | neighbour load on Postgres measured at peak |
| Video story rendering server | out of MVP (F6) | Đợt 2 ticket |

## Verify next

| Fact | Why not read | Settles it |
| --- | --- | --- |
| `2dear.app` zone active in Cloudflare | no access from this session | founder / `2srv plan -f web/2server/deploy.yaml` |
| `lohi-app` CPU and memory peaks | not measured here | monitoring App or `2srv server` stats |
| Container upstream names `up_prod-dear-*` | follows 2Novel's `up_prod-*` pattern; not planned yet | `2srv plan` |

## Open risks

See [ARCHITECTURE.md § Open risks](ARCHITECTURE.md#open-risks).
