# Design System — 2dear web

The design authority for every visual or UI change. Components come from **2ui**
(`@tofound/ui`, exact-pinned in `package.json`); 2dear owns the brand through the
2ui host theme. The approved prototype and its decisions are in
[../../docs/2dear/design.md](../../docs/2dear/design.md) and
[../../docs/2dear/prototype/](../../docs/2dear/prototype/) — port screens from
there. LoHi's root `DESIGN.md` palette does **not** apply to 2dear.

## Tokens

Defined once in [app/globals.css](app/globals.css): raw values on `:root`, mapped
to Tailwind through `@theme inline` after the 2ui imports (2ui `UI_GUIDE.md`,
"Install and theme contract"). Values mirror the prototype's `theme.css`.

| Token | Utility | Use |
| --- | --- | --- |
| `--background` / `--foreground` | `bg-background text-foreground` | Page ground (white) and text (`#141416`) |
| `--primary` | `bg-primary text-primary-foreground` | The one cranberry action per screen (`#c8213a`) |
| `--muted-foreground` | `text-muted-foreground` | Secondary text (6.3:1 on white) |
| `--accent` / `--accent-foreground` | `bg-accent text-accent-foreground` | Soft brand tint |
| `--destructive` | `text-destructive` | Errors and destructive actions |
| `--border`, `--input`, `--ring` | `border-border`, `ring-ring` | Lines, inputs, focus |
| `--surface-0…3` | `bg-surface-2` … | 2ui raised list/row grounds |
| `--color-brand-25…900` | `bg-brand-500` … | Brand scale for 2ui and illustration |
| `--paper`, `--paper-2` | `bg-paper` | "Giấy kem" letter theme only |
| `--radius` (0.875rem) | `rounded-lg` (`-sm`, `-md`, `-xl` derived) | Corners |
| `--font-sans` (Inter) | `font-sans` | All UI and headings |
| `--font-serif` (Newsreader) | `font-serif` | Letter body; one `<em>` in a heading |

Playwrite VN (greeting and signature only) is added with the letter page.

## Rules

- **Reuse 2ui before building.** Button, Input/Textarea, RadioGroup, Checkbox,
  SegmentedControl, Alert, Card, Tag, Dialog, `useConfirm`, StackSheet,
  FloatingSheet, `toast`, Breadcrumb, Accordion cover the prototype. Build a
  2dear component under `modules/shared/ui/` only when none fits (illustrations,
  the QR card), and never fork a 2ui component.
- **Reference tokens; never hardcode** a hex, rgb, radius or font family in a
  component. Need a new value? Add a token here and in `globals.css` first.
- **One red thing per screen**: the primary action. SegmentedControl uses the white
  pill on grey (design.md), neutral notes use `Alert variant="default"`.
- **Light only for the MVP** (prototype decision, design.md). Dark mode is a later
  product decision, not a per-screen choice.
- Accessible by default: semantic elements, visible focus, text contrast ≥ 4.5:1,
  touch targets ≥ 44px, no information by color alone.
- Every data view designs its loading, empty and error states.
- Mobile-first; works at 360px wide without horizontal scroll and inside the Zalo,
  Facebook and TikTok in-app browsers (O1).
- Copy is Vietnamese, short and specific; error messages say what happened and
  what to do.

Deviating from these rules needs an explicit product decision recorded here.
