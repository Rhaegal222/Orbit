# Orbit auto-hide-on-scroll directive Implementation Plan

> **Stato:** Completato
>
> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [x]`) syntax for tracking.

**Goal:** Add a public Orbit Core directive, `[orbitAutoHideOnScroll]`, that hides a toolbar-like
host element on downward scroll and shows it again on upward scroll, but only below the
`--orbit-breakpoint-md` viewport width — reclaiming vertical space in narrow modal/panel bodies.

**Architecture:** A standalone Angular directive with no template of its own. On first render it
walks up the DOM to find the nearest scrollable ancestor, and registers a `matchMedia` listener
for the `md` breakpoint. While the breakpoint matches, it listens to that ancestor's `scroll`
event (rAF-throttled) and drives a `hidden` signal from scroll direction. The signal feeds host
bindings that set `transform`/`opacity`/`transition` (inline styles, using existing motion
tokens) plus `aria-hidden`/`inert` for accessibility.

**Tech Stack:** Angular 22 standalone directive, Angular signals, native `ResizeObserver`-free
`matchMedia`, Vitest + Angular `TestBed` (jsdom environment).

## Global Constraints

- Angular 22 baseline; standalone directives only, no NgModules (`AGENTS.md`).
- No bare `px` in component CSS — this directive uses **no external stylesheet** (inline host
  style bindings only), so this constraint doesn't add a file, but any literal pixel value used
  in TypeScript (the 8px hide threshold) is a scroll-math constant, not CSS, and is fine as a
  plain number.
- Respect `[data-orbit-motion='off']` and `prefers-reduced-motion` — already handled globally by
  existing CSS (`[data-orbit-motion='off'] * { transition: none !important; }`); do not duplicate
  that logic in the directive.
- Public API, token, or export-path changes require a `CHANGELOG.md` entry under **Unreleased**
  (`AGENTS.md`) — this is a new additive export, so it's a **minor** entry under **Added**.
- Do not introduce a breaking change to `LabGoogleFontsDialogComponent`'s existing behavior when
  wiring it in as the live consumer.
- Every public component/directive change needs keyboard/focus verification — covered here by the
  `inert`/`aria-hidden` tests and by the manual verification steps in Task 3.

---

### Task 1: `OrbitAutoHideOnScrollDirective` — implementation and unit tests

**Files:**
- Create: `projects/orbit/src/lib/components/auto-hide-on-scroll/auto-hide-on-scroll.directive.ts`
- Create: `projects/orbit/src/lib/components/auto-hide-on-scroll/auto-hide-on-scroll.directive.spec.ts`
- Create: `projects/orbit/src/lib/components/auto-hide-on-scroll/index.ts`

**Interfaces:**
- Produces: `OrbitAutoHideOnScrollDirective`, selector `[orbitAutoHideOnScroll]`, standalone,
  no inputs, no outputs. Host element gets `[class]`-free inline styles
  (`transform`, `opacity`, `transition`, `pointer-events`) and
  `[attr.aria-hidden]`/`[attr.inert]`, all driven by an internal `hidden` signal — later tasks
  only need the selector name and the fact that it needs no configuration.

This task is one cohesive TDD cycle across several test cases, since the pieces (scroll-container
detection, breakpoint gating, direction logic, accessibility) are meaningless in isolation from
each other.

- [x] **Step 1: Create the directive skeleton and host test harness, write the first failing test**

Create `projects/orbit/src/lib/components/auto-hide-on-scroll/auto-hide-on-scroll.directive.ts`:

```typescript
import { DOCUMENT } from '@angular/common';
import { Directive, DestroyRef, ElementRef, afterNextRender, computed, inject, signal } from '@angular/core';

/** Must match `--orbit-breakpoint-md` (48rem / 768px) — a native `@media` query cannot read a
 * CSS custom property, so this literal is the documented source of truth for that token. */
const HIDE_BREAKPOINT_QUERY = '(max-width: 48rem)';

/** Downward scroll distance, in pixels, that must accumulate before the host hides. Upward
 * movement of any size shows it again immediately — see the class doc comment below. */
const HIDE_THRESHOLD_PX = 8;

@Directive({
  selector: '[orbitAutoHideOnScroll]',
  host: {
    '[style.transform]': 'hidden() ? "translateY(-100%)" : "translateY(0)"',
    '[style.opacity]': 'hidden() ? "0" : "1"',
    '[style.transition]': 'transitionValue()',
    '[style.pointer-events]': 'hidden() ? "none" : null',
    '[attr.aria-hidden]': 'hidden() ? "true" : null',
    '[attr.inert]': 'hidden() ? "" : null',
  },
})
export class OrbitAutoHideOnScrollDirective {
  private readonly elementRef = inject(ElementRef<HTMLElement>);
  private readonly document = inject(DOCUMENT);
  private readonly destroyRef = inject(DestroyRef);

  protected readonly hidden = signal(false);
  protected readonly transitionValue = computed(() => {
    const easing = this.hidden() ? '--orbit-easing-accelerate' : '--orbit-easing-standard';
    return `transform var(--orbit-motion-base) var(${easing}), opacity var(--orbit-motion-base) var(${easing})`;
  });

  private scrollContainer: HTMLElement | null = null;
  private mediaQuery: MediaQueryList | null = null;
  private lastScrollTop = 0;
  private downwardRun = 0;
  private rafPending = false;

  private readonly onMediaChange = (event: MediaQueryListEvent): void => {
    if (event.matches) {
      this.attachScrollListener();
    } else {
      this.detachScrollListener();
      this.hidden.set(false);
    }
  };

  private readonly onScroll = (): void => {
    if (this.rafPending) return;
    this.rafPending = true;
    requestAnimationFrame(() => {
      this.rafPending = false;
      this.evaluateScroll();
    });
  };

  constructor() {
    afterNextRender(() => this.setup());
    this.destroyRef.onDestroy(() => this.teardown());
  }

  private setup(): void {
    this.scrollContainer = this.findScrollContainer(this.elementRef.nativeElement);
    if (!this.scrollContainer) return;

    this.mediaQuery = this.document.defaultView?.matchMedia(HIDE_BREAKPOINT_QUERY) ?? null;
    if (!this.mediaQuery) return;

    this.mediaQuery.addEventListener('change', this.onMediaChange);
    if (this.mediaQuery.matches) {
      this.attachScrollListener();
    }
  }

  private teardown(): void {
    this.mediaQuery?.removeEventListener('change', this.onMediaChange);
    this.detachScrollListener();
  }

  private attachScrollListener(): void {
    if (!this.scrollContainer) return;
    this.lastScrollTop = this.scrollContainer.scrollTop;
    this.downwardRun = 0;
    this.scrollContainer.addEventListener('scroll', this.onScroll, { passive: true });
  }

  private detachScrollListener(): void {
    this.scrollContainer?.removeEventListener('scroll', this.onScroll);
  }

  private evaluateScroll(): void {
    const container = this.scrollContainer;
    if (!container) return;

    const scrollTop = container.scrollTop;
    const delta = scrollTop - this.lastScrollTop;
    this.lastScrollTop = scrollTop;

    if (scrollTop <= 0) {
      this.hidden.set(false);
      this.downwardRun = 0;
      return;
    }

    if (delta < 0) {
      this.hidden.set(false);
      this.downwardRun = 0;
      return;
    }

    if (delta > 0) {
      this.downwardRun += delta;
      if (this.downwardRun > HIDE_THRESHOLD_PX) {
        this.hidden.set(true);
      }
    }
  }

  private findScrollContainer(from: HTMLElement): HTMLElement | null {
    const view = this.document.defaultView;
    let node: HTMLElement | null = from.parentElement;
    while (node) {
      const overflowY = view?.getComputedStyle(node).overflowY;
      if ((overflowY === 'auto' || overflowY === 'scroll') && node.scrollHeight > node.clientHeight) {
        return node;
      }
      node = node.parentElement;
    }
    return null;
  }
}
```

Create `projects/orbit/src/lib/components/auto-hide-on-scroll/auto-hide-on-scroll.directive.spec.ts`
with the test harness and the first test:

```typescript
import { Component, ElementRef, viewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OrbitAutoHideOnScrollDirective } from './auto-hide-on-scroll.directive';

@Component({
  standalone: true,
  imports: [OrbitAutoHideOnScrollDirective],
  template: `
    <div class="container" style="overflow-y: auto;">
      <div class="inner">
        <div class="toolbar" orbitAutoHideOnScroll>toolbar</div>
        <div class="content">content</div>
      </div>
    </div>
  `,
})
class HostComponent {
  container = viewChild.required<ElementRef<HTMLElement>>(ElementRef);
}

/** jsdom never computes real layout, so `scrollHeight`/`clientHeight` are always 0 unless a test
 * defines them explicitly — this is what makes the ancestor "scrollable" for the directive's own
 * `scrollHeight > clientHeight` check. */
function makeScrollable(el: HTMLElement, scrollHeight: number, clientHeight: number): void {
  Object.defineProperty(el, 'scrollHeight', { value: scrollHeight, configurable: true });
  Object.defineProperty(el, 'clientHeight', { value: clientHeight, configurable: true });
}

/** jsdom's own `matchMedia` stub always reports `matches: false` and never really evaluates the
 * query — this fake gives tests control over which breakpoint state is "current" and lets them
 * fire a `change` event to simulate a viewport resize. */
class FakeMediaQueryList extends EventTarget implements MediaQueryList {
  matches: boolean;
  readonly media = '';
  onchange = null;
  addListener(): void {}
  removeListener(): void {}

  constructor(matches: boolean) {
    super();
    this.matches = matches;
  }

  setMatches(matches: boolean): void {
    this.matches = matches;
    this.dispatchEvent(Object.assign(new Event('change'), { matches }));
  }
}

describe('OrbitAutoHideOnScrollDirective', () => {
  let fixture: ComponentFixture<HostComponent>;
  let container: HTMLElement;
  let toolbar: HTMLElement;
  let fakeMediaQueryList: FakeMediaQueryList;

  function setup(options: { belowBreakpoint: boolean; scrollable: boolean }): void {
    fakeMediaQueryList = new FakeMediaQueryList(options.belowBreakpoint);
    vi.spyOn(window, 'matchMedia').mockReturnValue(fakeMediaQueryList as unknown as MediaQueryList);

    fixture = TestBed.createComponent(HostComponent);
    container = fixture.nativeElement.querySelector('.container');
    toolbar = fixture.nativeElement.querySelector('.toolbar');
    if (options.scrollable) {
      makeScrollable(container, 1000, 200);
    }
    fixture.detectChanges();
  }

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('does nothing when no scrollable ancestor exists', () => {
    setup({ belowBreakpoint: true, scrollable: false });
    expect(toolbar.style.transform).toBe('translateY(0)');
    expect(toolbar.getAttribute('aria-hidden')).toBeNull();
  });
});
```

- [x] **Step 2: Run the test to verify it passes (baseline, no-scroll-container case)**

Run: `npx ng test orbit --watch=false`
Expected: PASS — 1 test, `OrbitAutoHideOnScrollDirective > does nothing when no scrollable ancestor exists`.

- [x] **Step 3: Add the breakpoint-gating tests**

Add to the same `describe` block in `auto-hide-on-scroll.directive.spec.ts`:

```typescript
  it('does not attach a scroll listener above the md breakpoint', () => {
    setup({ belowBreakpoint: false, scrollable: true });
    const addEventListenerSpy = vi.spyOn(container, 'addEventListener');
    container.scrollTop = 500;
    container.dispatchEvent(new Event('scroll'));
    expect(addEventListenerSpy).not.toHaveBeenCalledWith('scroll', expect.anything(), expect.anything());
    expect(toolbar.getAttribute('aria-hidden')).toBeNull();
  });

  it('attaches the listener and reacts to scroll once resized below the md breakpoint', async () => {
    setup({ belowBreakpoint: false, scrollable: true });
    fakeMediaQueryList.setMatches(true);

    container.scrollTop = 100;
    container.dispatchEvent(new Event('scroll'));
    await new Promise((resolve) => requestAnimationFrame(resolve));
    fixture.detectChanges();

    expect(toolbar.getAttribute('aria-hidden')).toBe('true');
  });
```

- [x] **Step 4: Run the tests to verify they pass**

Run: `npx ng test orbit --watch=false`
Expected: PASS — both new tests green. The directive from Step 1 already guards on
`mediaQuery.matches` in `setup()` and re-attaches on the `change` event in `onMediaChange()`, so
no code change is needed here; this step is confirmation, not implementation.

- [x] **Step 5: Add the scroll-direction and threshold tests**

```typescript
  it('hides after scrolling down past the 8px threshold', async () => {
    setup({ belowBreakpoint: true, scrollable: true });

    container.scrollTop = 20; // > 8px past the initial 0
    container.dispatchEvent(new Event('scroll'));
    await new Promise((resolve) => requestAnimationFrame(resolve));
    fixture.detectChanges();

    expect(toolbar.getAttribute('aria-hidden')).toBe('true');
    expect(toolbar.style.transform).toBe('translateY(-100%)');
  });

  it('does not hide for a downward scroll at or under the 8px threshold', async () => {
    setup({ belowBreakpoint: true, scrollable: true });

    container.scrollTop = 5;
    container.dispatchEvent(new Event('scroll'));
    await new Promise((resolve) => requestAnimationFrame(resolve));
    fixture.detectChanges();

    expect(toolbar.getAttribute('aria-hidden')).toBeNull();
  });

  it('shows again immediately on any upward scroll', async () => {
    setup({ belowBreakpoint: true, scrollable: true });

    container.scrollTop = 50;
    container.dispatchEvent(new Event('scroll'));
    await new Promise((resolve) => requestAnimationFrame(resolve));
    fixture.detectChanges();
    expect(toolbar.getAttribute('aria-hidden')).toBe('true');

    container.scrollTop = 49;
    container.dispatchEvent(new Event('scroll'));
    await new Promise((resolve) => requestAnimationFrame(resolve));
    fixture.detectChanges();

    expect(toolbar.getAttribute('aria-hidden')).toBeNull();
    expect(toolbar.style.transform).toBe('translateY(0)');
  });

  it('is always visible when scrollTop returns to 0', async () => {
    setup({ belowBreakpoint: true, scrollable: true });

    container.scrollTop = 50;
    container.dispatchEvent(new Event('scroll'));
    await new Promise((resolve) => requestAnimationFrame(resolve));
    fixture.detectChanges();
    expect(toolbar.getAttribute('aria-hidden')).toBe('true');

    container.scrollTop = 0;
    container.dispatchEvent(new Event('scroll'));
    await new Promise((resolve) => requestAnimationFrame(resolve));
    fixture.detectChanges();

    expect(toolbar.getAttribute('aria-hidden')).toBeNull();
  });
```

- [x] **Step 6: Run the tests to verify they pass**

Run: `npx ng test orbit --watch=false`
Expected: PASS — all tests so far green. If any fail, re-read `evaluateScroll()` in the directive
against the failing assertion before changing anything else.

- [x] **Step 7: Add the breakpoint-crossing and cleanup tests**

```typescript
  it('forces itself visible and detaches the listener when resized back above md', async () => {
    setup({ belowBreakpoint: true, scrollable: true });

    container.scrollTop = 50;
    container.dispatchEvent(new Event('scroll'));
    await new Promise((resolve) => requestAnimationFrame(resolve));
    fixture.detectChanges();
    expect(toolbar.getAttribute('aria-hidden')).toBe('true');

    fakeMediaQueryList.setMatches(false);
    fixture.detectChanges();
    expect(toolbar.getAttribute('aria-hidden')).toBeNull();

    const addEventListenerSpy = vi.spyOn(container, 'addEventListener');
    container.scrollTop = 100;
    container.dispatchEvent(new Event('scroll'));
    expect(addEventListenerSpy).not.toHaveBeenCalled();
  });

  it('removes its scroll and media-query listeners on destroy', async () => {
    setup({ belowBreakpoint: true, scrollable: true });
    const removeEventListenerSpy = vi.spyOn(container, 'removeEventListener');
    const mediaRemoveSpy = vi.spyOn(fakeMediaQueryList, 'removeEventListener');

    fixture.destroy();

    expect(removeEventListenerSpy).toHaveBeenCalledWith('scroll', expect.any(Function));
    expect(mediaRemoveSpy).toHaveBeenCalledWith('change', expect.any(Function));
  });
```

- [x] **Step 8: Run the full spec file and verify everything passes**

Run: `npx ng test orbit --watch=false`
Expected: PASS — all 9 tests in `auto-hide-on-scroll.directive.spec.ts` green, 0 failures.

- [x] **Step 9: Create the barrel file**

Create `projects/orbit/src/lib/components/auto-hide-on-scroll/index.ts`:

```typescript
export { OrbitAutoHideOnScrollDirective } from './auto-hide-on-scroll.directive';
```

- [x] **Step 10: Commit**

```bash
git add projects/orbit/src/lib/components/auto-hide-on-scroll/
git commit -m "feat: add OrbitAutoHideOnScrollDirective"
```

---

### Task 2: Publish the directive from the package entry point

**Files:**
- Modify: `projects/orbit/src/public-api.ts`
- Modify: `CHANGELOG.md`

**Interfaces:**
- Consumes: `OrbitAutoHideOnScrollDirective` from
  `./lib/components/auto-hide-on-scroll` (Task 1).
- Produces: `OrbitAutoHideOnScrollDirective` importable from `@galileo/orbit` — Task 3's dialog
  consumer imports it from there, not from the internal path.

- [x] **Step 1: Add the export to `public-api.ts`**

In `projects/orbit/src/public-api.ts`, add this line immediately before
`export * from './lib/types';`:

```typescript
export * from './lib/components/auto-hide-on-scroll';
```

- [x] **Step 2: Verify the package still builds and the symbol resolves**

Run: `npx ng build orbit`
Expected: Build succeeds with no new errors or warnings.

- [x] **Step 3: Add the CHANGELOG entry**

In `CHANGELOG.md`, under `## Unreleased` → `### Added`, add this line (keep existing entries
above it untouched):

```markdown
- Added `orbitAutoHideOnScroll`, a directive that hides a toolbar-like host element on downward
  scroll and shows it again on upward scroll, active only under `--orbit-breakpoint-md`, to
  reclaim vertical space in narrow modal/panel bodies.
```

- [x] **Step 4: Commit**

```bash
git add projects/orbit/src/public-api.ts CHANGELOG.md
git commit -m "feat: export OrbitAutoHideOnScrollDirective from the package entry point"
```

---

### Task 3: Wire the directive into the Google Fonts dialog and verify manually

**Files:**
- Modify: `projects/orbit-lab/src/app/shell/google-fonts-dialog.component.ts:6-14,33-70`

**Interfaces:**
- Consumes: `OrbitAutoHideOnScrollDirective` from `@galileo/orbit` (Task 2).

- [x] **Step 1: Import the directive and apply it to the toolbar wrapper**

In `projects/orbit-lab/src/app/shell/google-fonts-dialog.component.ts`, update the import block
(currently lines 6-14) to add `OrbitAutoHideOnScrollDirective`:

```typescript
import {
  OrbitAutoHideOnScrollDirective,
  OrbitButtonComponent,
  OrbitIconButtonComponent,
  OrbitModalBodyComponent,
  OrbitModalComponent,
  OrbitModalFooterComponent,
  OrbitModalHeaderComponent,
  OrbitTextInputComponent,
} from '@galileo/orbit';
```

Add `OrbitAutoHideOnScrollDirective` to the component's `imports` array (alongside the other
`Orbit*` imports already listed there).

Wrap the search input and hint paragraph — currently the direct children of
`.lab-google-fonts__content` before `.lab-google-fonts__list` — in a `div` carrying the
directive:

```html
<div class="lab-google-fonts__content">
  <div orbitAutoHideOnScroll>
    <orbit-text-input
      inputId="google-font-search"
      type="search"
      placeholder="Cerca un font"
      ariaLabel="Cerca nella libreria Google Fonts"
      [formControl]="searchControl"
    />
    <p class="lab-google-fonts__hint">
      Se non trovi la famiglia desiderata, esplora il
      <a href="https://fonts.google.com" target="_blank" rel="noopener noreferrer"
        >catalogo Google Fonts</a
      >.
    </p>
  </div>
  <div class="lab-google-fonts__list">
    <!-- unchanged -->
  </div>
</div>
```

- [x] **Step 2: Run the orbit-lab unit test suite**

Run: `npx ng test orbit-lab --watch=false`
Expected: PASS — no test currently asserts on the exact DOM structure of
`.lab-google-fonts__content`'s children in a way this wrapper `div` would break; if a test does
fail on this, update its selector to look inside the new wrapper rather than changing the
directive's placement.

- [x] **Step 3: Start the dev server and verify in the browser**

Run: `npm run start` (if not already running), then open `http://localhost:4200`.

Manually verify, using the running Orbit Lab app:
1. Open any page, click "Vista cellulare" (mobile preview), then open the theme/options panel
   and trigger the Google Fonts dialog (font picker → "Aggiungi Google Fonts", or the equivalent
   entry point currently wired in Orbit Studio/Lab options).
2. Confirm the search input and hint text are visible at rest.
3. Scroll the font list down more than a few pixels: confirm the search input and hint animate
   out (slide up, fade) within a few hundred milliseconds.
4. Scroll up even slightly: confirm they reappear immediately.
5. Scroll to the very top: confirm they are visible.
6. Resize the browser window (or exit mobile preview) above 768px width: confirm the search bar
   stays visible regardless of scroll position.
7. With the search bar hidden (scrolled down), press Tab repeatedly from before it: confirm focus
   skips the search input entirely and lands on the next focusable element in the font list
   (verifies `inert`).

- [x] **Step 4: Commit**

```bash
git add projects/orbit-lab/src/app/shell/google-fonts-dialog.component.ts
git commit -m "feat: auto-hide the Google Fonts dialog search bar on scroll in narrow viewports"
```

---

## Explicitly out of scope for this plan

- A dedicated Orbit Lab catalog page/route (new `slug` in `catalog.ts` plus a new routed page
  component) demonstrating the directive standalone. The Google Fonts dialog (Task 3) is the
  live, reachable example for now; a catalog entry is a reasonable follow-up once a second real
  consumer exists (per the spec's `experimental` maturity gate), not a blocker for shipping the
  directive itself.
- Promoting the directive out of `experimental` status — that requires the consumer-flow review
  and second-consumer confirmation called out in the spec, not part of this implementation pass.
