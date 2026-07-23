# Orbit — Text-Scale & Browser-Zoom Verification + Authoring Guidance

## Context

The Orbit visual refresh (`docs/superpowers/specs/2026-07-21-orbit-core-visual-refresh-design.md`,
`docs/superpowers/plans/2026-07-21-orbit-core-visual-refresh.md`) introduced a
runtime-tunable `--orbit-text-scale` multiplier consumed by font-size, control-height,
icon-size and section-index tokens. The user asked for two things:

1. Confirm the scale system actually works across **all** Orbit components (not just
   the ones the refresh plan touched), and that it holds up under real **browser zoom**
   — both the standard page-zoom (`Ctrl +`/`-`, scales the whole rendered page) and the
   font-size-only zoom some browsers/OSes expose (scales only `rem`/`em`-derived values).
2. Document how to build new Orbit components so this class of regression can't
   reappear later.

## Audit finding

A full grep-based audit of every component stylesheet under
`projects/orbit/src/lib/components/**/*.css` (25 files) found **no scale-breaking
hardcoded `px` values**. Every `px` occurrence outside `tokens.css` falls into one of
three established, intentional exceptions:

- Hairline borders (1–2px): `divider`, `date-picker`, `modal-header`, `modal-footer`,
  `text-input`, `time-picker`, `form-section`.
- The visually-hidden (`sr-only`) accessibility pattern (`width: 1px; height: 1px;
  margin: -1px;`): `attachment-dropzone`, `checkbox`.
- Focus-ring `box-shadow` spread (3–4px): `autocomplete`, `text-input`, `select`.

All sizing that should scale (font-size, control-height, icon sizes, section-index
size) already derives from `rem` and `calc(... * var(--orbit-text-scale))` per
`tokens.css`. Inline SVGs size via CSS (`width`/`height` in `rem` or `1em`), never via
a hardcoded `px` `width`/`height` attribute on the outer `<svg>`, so the icon system
inherits scale correctly too.

**Conclusion:** this is a verification task, not a bulk-fix task. No plan tasks are
needed to patch component CSS. If the verification pass below finds a live regression
anyway (something the static audit couldn't catch — e.g. a JS-computed inline style,
or an interaction between two tokens that only manifests at an extreme scale), fixing
it is in scope as a small task at that point.

## Verification approach

Use `orbit-lab`'s existing `lab-shell` harness, which already exposes a live
`textScale` control (`0.85`–`1.5`) and renders every cataloged component. No new
catalog page or tooling is needed — the harness that exists is sufficient.

For a representative sample of catalog pages (one from each control family: form
inputs, buttons, modal composition, selectable-tile/pill-switch, attachment list,
date/time pickers), check three conditions, each independently:

1. **`--orbit-text-scale` at 1.5`** via the lab-shell control — no icon/text
   clipping, no control overlapping its label, no broken alignment.
2. **Native browser page zoom at 200%** (`Ctrl +` repeatedly, or the DevTools device
   toolbar zoom) — the whole page should scale as one image; this exists to catch
   any element that escapes normal document flow (e.g. a fixed-position overlay with
   a hardcoded viewport-relative offset), not sizing per se.
3. **Font-size-only zoom** — simulated by raising the page's root `font-size` via
   DevTools (`document.documentElement.style.fontSize = '20px'` in the console, since
   no major desktop browser currently ships a standalone "text-only" zoom UI to drive
   directly) — this is the scenario that would expose any component still using an
   unscaled `px` value, since only `rem`/`em`-relative sizing responds to it.

Record pass/fail per page per condition. Any failure becomes a small follow-up fix
task in the implementation plan; a clean pass across the sample means the library-wide
claim is verified without needing to touch all 25 pages individually — the sample is
chosen to cover every layout pattern (grid form, flex toolbar, absolutely-positioned
overlay, icon-bearing control, dense list) present in the library.

## Authoring guidance (documentation)

Add a subsection to `AGENTS.md`'s "Tailwind and styling" rules and expand
`docs/THEMING.md`'s existing "Text scale" section with an explicit, checkable rule set
for anyone adding a new Orbit component:

- Every dimensional CSS value (`width`, `height`, `padding`, `margin`, `gap`,
  `font-size`, `line-height`, `border-radius`, positional offsets) must resolve to a
  `rem` unit or an `--orbit-*` token — never a bare `px` literal.
- The only accepted `px` exceptions, to be used verbatim and not reinvented:
  hairline borders (`1px`–`2px` solid), the visually-hidden `sr-only` pattern, and
  focus-ring `box-shadow` spread values. Any other `px` usage is a defect.
- SVG icons must never carry a `px` `width`/`height` attribute on the outer `<svg>`;
  size them from CSS (`rem` or `1em`) so they inherit `--orbit-text-scale` like
  surrounding text.
- Before considering a new component complete, check it at `--orbit-text-scale: 1.5`
  in `orbit-lab` and at browser page zoom 200% — the same two checks from the
  verification approach above, now framed as a per-component authoring checklist
  rather than a one-time audit.

This is documentation only — no lint rule or automated CI check (explicitly out of
scope per user decision: a one-time verification/fix pass, not permanent enforcement
tooling).

## Non-goals

- No new orbit-lab catalog page or scale-testing harness — the existing `lab-shell`
  `textScale` control is sufficient.
- No automated/CI enforcement of the px rule — documentation only.
- No changes to components outside `projects/orbit/src/lib/components` (orbit-lab's
  own app-shell chrome, orbit-studio, and consuming applications like KMS are out of
  scope).
- No revisiting of the Minor findings left open from the previous visual-refresh
  review (`--orbit-ref-font-size-xs` bump, `fcadfb0` governance note) — unrelated to
  this request.

## Testing

- Manual verification pass (browser-driven, recorded pass/fail per page/condition as
  described above) is the primary test for this work, since this repo has no
  established pattern for asserting resolved CSS/token values in automated specs.
- Any fix triggered by a verification failure follows the existing convention for
  that file (grep-based structural check + full `ng test orbit-lab` regression run).
- No new automated tests are added for the documentation-only deliverable.
