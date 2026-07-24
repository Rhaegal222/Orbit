# Orbit auto-hide-on-scroll directive — design

## Problem

Modal and panel bodies sometimes stack a fixed toolbar (search input, filter bar, hint text)
directly above a scrollable list, inside the same scrollable region rather than the modal's own
sticky header/footer chrome. On a narrow viewport the toolbar can consume a large share of the
available height, leaving little room for the list itself (observed in the "Aggiungi Google
Fonts" dialog: title, subtitle, search input and hint text push the font grid down to a few
visible rows).

Native alternative considered: CSS `position: sticky` alone does not help here — it keeps the
toolbar pinned, it does not reclaim space when space is scarce. There is no native HTML control
for "hide non-essential chrome while scrolling, on narrow viewports only."

## Intended users

Any Orbit consumer (Core, Orbit Lab, Orbit Studio, KMS after migration) that places a toolbar-like
element directly above scrollable content inside a modal body, panel body, or any other scrollable
region, and wants that toolbar to reclaim vertical space on narrow viewports.

## Scope

- New public directive in `@galileo/orbit`: `[orbitAutoHideOnScroll]`.
- Applies to the toolbar element itself; no wrapper component, no required inputs.
- Active only below `--orbit-breakpoint-md` (48rem / 768px).
- First consumer: the toolbar in `LabGoogleFontsDialogComponent` (`lab-google-fonts__content`
  search row), as a live example — not because the feature is scoped to that dialog.

### Non-goals

- Not a sticky-positioning replacement. The toolbar stays in normal flow; only its visibility
  toggles.
- Not scoped to `orbit-modal`/`orbit-panel` specifically — it has no dependency on either.
- No consumer-facing option to override the breakpoint or the hide threshold in this first
  version (YAGNI; can be added later as an additive input without a breaking change).
- No support for horizontal-scroll containers.

## API

```html
<div class="lab-google-fonts__toolbar" orbitAutoHideOnScroll>
  <orbit-text-input inputId="google-font-search" type="search" placeholder="Cerca un font" ... />
  <p class="lab-google-fonts__hint">…</p>
</div>
```

No inputs required. The directive:

1. Walks up from its host element's `parentElement` chain to find the nearest ancestor with
   `overflowY` computed as `auto` or `scroll` and `scrollHeight > clientHeight` — the same
   detection shape as existing scroll-target lookups in this codebase, generalized as public,
   reusable directive logic rather than a private, one-off implementation.
2. Registers a `matchMedia('(max-width: 48rem)')` listener. The directive is inert (no scroll
   listener attached, host always visible) whenever this does not match.
3. While active, listens to the scroll container's `scroll` event (passive, `requestAnimationFrame`-throttled) and toggles a `hidden` signal based on scroll direction.

## Behavior

- **Hidden** when the container has scrolled down more than an 8px hysteresis band since the last
  direction change (avoids flicker on sub-pixel/trackpad jitter).
- **Shown** immediately on any upward scroll delta, and always shown when `scrollTop <= 0`.
- Crossing the `md` breakpoint (viewport resize) re-evaluates active state immediately: growing
  past `md` forces the host visible and detaches the scroll listener; shrinking below `md`
  reattaches it.
- No motion or visibility change when the detected container isn't actually scrollable (content
  shorter than viewport) — nothing to reclaim space from.

## Motion

- `transform: translateY(-100%)` + `opacity: 0` on hide, reversed on show.
- Hide (exit) uses `--orbit-motion-base` timing with `--orbit-easing-accelerate`; show (enter)
  uses `--orbit-motion-base` with `--orbit-easing-standard` — matching the documented convention
  ("Enter uses `--orbit-easing-standard`; collapse and exit use `--orbit-easing-accelerate`").
- Respects the existing global `[data-orbit-motion='off']` override and
  `prefers-reduced-motion` reduction; no directive-specific motion opt-out needed.

## Accessibility

- While hidden: host gets `aria-hidden="true"` and the native `inert` attribute — removes it and
  its descendants from the tab order and from the accessibility tree, consistent with being
  visually absent.
- `inert` is native, well-supported per the Angular 22 / current-evergreen-browser baseline this
  package targets; no polyfill needed.
- No focus-trap edge case to handle: nothing inside a hidden, `inert` region can hold focus, so
  there is no "focus stranded in a hidden element" state to recover from.

## Package and governance

- New directory `projects/orbit/src/lib/directives/auto-hide-on-scroll/`:
  `auto-hide-on-scroll.directive.ts`, `.spec.ts`.
- Exported from `public-api.ts`.
- Documented with a `lab-example` entry in Orbit Lab (alphabetic catalog placement), demonstrating
  it live in a narrow (mobile-preview) frame.
- `CHANGELOG.md`: **Unreleased**, minor (new additive public API).
- Maturity: `experimental` until the Google Fonts dialog consumer-flow review and a second
  real consumer confirm the API holds up.

## Testing

- Unit tests (Vitest/TestBed):
  - Auto-detects the nearest scrollable ancestor; no-ops when none exists.
  - Inactive (host always visible, no listener attached) above the `md` breakpoint.
  - Hides after scrolling down past the hysteresis threshold; shows on any upward delta.
  - Always visible when `scrollTop` is at or returns to `0`.
  - Re-evaluates active state on a simulated breakpoint crossing.
  - Sets/clears `aria-hidden`/`inert` in lockstep with the hidden state.
  - Removes the `scroll` and `matchMedia` listeners on directive destroy.
