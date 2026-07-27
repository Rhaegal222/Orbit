# Orbit Lab Sidebar + Search Implementation Plan

> **Stato:** Completato
>
> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [x]`) syntax for tracking.

**Goal:** Replace the Orbit Lab overlay navigation panel with a fixed `orbit-sidebar` in the shell layout, and add a live-filtering search box in the shell header that narrows the sidebar's catalog sections.

**Architecture:** `LabShellComponent` gains a `search-input` FormControl driving a `computed` signal that filters `CATALOG_ENTRIES` into a single `OrbitSidebarSection`. `orbit-sidebar` sits beside `<main>` in a flex row, wired to `Router` for both `activeId` (derived from the current URL) and navigation (`itemSelected` → `router.navigate`). `LabCatalogNavigationPanelComponent` and the "Navigazione" button are deleted; `LabCatalogOptionsPanelComponent` and the "Opzioni" button are untouched. A new `search` icon is added to the shared Orbit icon registry since none exists yet.

**Tech Stack:** Angular 19 standalone components, signals, `@angular/forms` `FormControl`/`ReactiveFormsModule`, `@angular/core/rxjs-interop` `toSignal`, `@angular/router`, Vitest + Angular `TestBed`.

## Global Constraints

- No new messages for zero search results — the sidebar simply renders an empty section (confirmed with user).
- No disabled/badge treatment for non-`verified` catalog entries — parity with current behavior (all current entries are `verified`; this is out of scope).
- `LabCatalogOptionsPanelComponent` and its "Opzioni" button/right-overlay behavior must remain unchanged.
- Sidebar `brand`/`brandIcon` inputs stay unset — the shell header keeps the only "Orbit Lab" branding, no duplication.
- No persistence (localStorage) of the sidebar's collapsed state — it's an in-memory signal like the shell's other display settings.

---

## File Structure

- `projects/orbit/src/lib/icons/icon-registry.ts` — add `'search'` to `OrbitIconName` and `ORBIT_ICON_PATHS`.
- `projects/orbit/src/lib/icons/icon.component.spec.ts` — add a test asserting the new `search` icon renders.
- `projects/orbit-lab/src/app/shell/lab-shell.component.ts` — remove `LabCatalogNavigationPanelComponent` and `openNavigation()`; add `searchControl`, `searchQuery` signal, `sidebarSections` computed, `activeSidebarId` signal (from `Router`), `sidebarCollapsed` signal, `onSidebarItemSelected()`, `onSidebarCollapsedChange()`.
- `projects/orbit-lab/src/app/shell/lab-shell.component.html` — replace the "Navigazione" button with `orbit-text-input[type=search]`; add `orbit-sidebar` inside `.lab-shell__body`, before `<main>`.
- `projects/orbit-lab/src/app/shell/lab-shell.component.css` — turn `.lab-shell__body` into a flex row; keep `.lab-shell__content` as the flexible remainder.
- `projects/orbit-lab/src/app/shell/catalog-panel.component.css` — remove now-unused `.lab-catalog-panel__nav*` rules (file stays, still used by the options panel).
- `projects/orbit-lab/src/app/shell/lab-shell.component.spec.ts` — replace the "opens the catalog navigation in a left offcanvas" test with sidebar-based tests (renders all entries, filters on search, navigates on item click).

---

## Task 1: Add a `search` icon to the Orbit icon registry

**Files:**
- Modify: `projects/orbit/src/lib/icons/icon-registry.ts:1-34`
- Test: `projects/orbit/src/lib/icons/icon.component.spec.ts`

**Interfaces:**
- Produces: `OrbitIconName` union gains `'search'`; `ORBIT_ICON_PATHS['search']` is a 2-path magnifying-glass glyph (circle + handle), consumed by Task 3's `leadingIconName="search"` on `orbit-text-input`.

- [x] **Step 1: Write the failing test**

Add to `projects/orbit/src/lib/icons/icon.component.spec.ts` (inside the existing `describe('OrbitIconComponent', ...)` block, after the `'renders a single path for a single-path icon'` test):

```typescript
  it('renders the search icon with a circle and a handle path', () => {
    fixture.componentRef.setInput('name', 'search');
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelectorAll('path').length).toBe(2);
  });
```

- [x] **Step 2: Run test to verify it fails**

Run: `cd projects/orbit-lab/.. && npx vitest run projects/orbit/src/lib/icons/icon.component.spec.ts` (or the project's configured `npm test` / `ng test orbit` command — check `package.json` `scripts` if `npx vitest` isn't wired directly)

Expected: FAIL — TypeScript error / runtime error because `'search'` is not assignable to `OrbitIconName`, or `ORBIT_ICON_PATHS['search']` is `undefined`.

- [x] **Step 3: Add the icon to the registry**

In `projects/orbit/src/lib/icons/icon-registry.ts`, change:

```typescript
export type OrbitIconName =
  | 'close'
  | 'calendar'
  | 'chevron-down'
  | 'check'
  | 'copy'
  | 'mail'
  | 'lock'
  | 'home'
  | 'layers'
  | 'settings'
  | 'user'
  | 'document'
  | 'view'
  | 'download'
  | 'remove'
  | 'retry';
```

to:

```typescript
export type OrbitIconName =
  | 'close'
  | 'calendar'
  | 'chevron-down'
  | 'check'
  | 'copy'
  | 'mail'
  | 'lock'
  | 'home'
  | 'layers'
  | 'settings'
  | 'user'
  | 'document'
  | 'view'
  | 'download'
  | 'remove'
  | 'retry'
  | 'search';
```

And add an entry to `ORBIT_ICON_PATHS` (after `retry: [...]`, before the closing `};`):

```typescript
  search: ['M11 4a7 7 0 1 0 0 14 7 7 0 0 0 0-14Z', 'm20.5 20.5-4.8-4.8'],
```

- [x] **Step 4: Run test to verify it passes**

Run: `cd projects/orbit-lab/.. && npx vitest run projects/orbit/src/lib/icons/icon.component.spec.ts`

Expected: PASS, all tests in the file green including the new one.

- [x] **Step 5: Commit**

```bash
git add projects/orbit/src/lib/icons/icon-registry.ts projects/orbit/src/lib/icons/icon.component.spec.ts
git commit -m "feat(orbit): add search icon to the shared icon registry"
```

---

## Task 2: Fixed sidebar in the Lab shell — component logic

**Files:**
- Modify: `projects/orbit-lab/src/app/shell/lab-shell.component.ts`
- Test: `projects/orbit-lab/src/app/shell/lab-shell.component.spec.ts`

**Interfaces:**
- Consumes: `CATALOG_ENTRIES: CatalogEntry[]` from `../catalog/catalog` (`{ slug: string; label: string; status: CatalogStatus }`); `OrbitSidebarComponent`, `OrbitSidebarItem { id, label, icon?, badge?, disabled? }`, `OrbitSidebarSection { id, label?, items }` from `@galileo/orbit`; `OrbitTextInputComponent` from `@galileo/orbit`.
- Produces (for Task 3's template): `protected readonly searchControl: FormControl<string>`, `protected readonly sidebarSections: Signal<readonly OrbitSidebarSection[]>`, `protected readonly activeSidebarId: Signal<string | null>`, `protected readonly sidebarCollapsed: WritableSignal<boolean>`, `protected onSidebarItemSelected(item: OrbitSidebarItem): void`, `protected onSidebarCollapsedChange(collapsed: boolean): void`.

- [x] **Step 1: Write the failing tests**

Replace the existing test `'opens the catalog navigation in a left offcanvas'` in `projects/orbit-lab/src/app/shell/lab-shell.component.spec.ts` with:

```typescript
  it('renders every catalog entry as a sidebar item', () => {
    const items = fixture.nativeElement.querySelectorAll('orbit-sidebar button.orbit-sidebar__item');
    expect(items.length).toBe(CATALOG_ENTRIES.length);
  });

  it('filters the sidebar items as the search box changes', () => {
    fixture.componentInstance.searchControl.setValue('badge');
    fixture.detectChanges();

    const items = [
      ...fixture.nativeElement.querySelectorAll('orbit-sidebar button.orbit-sidebar__item'),
    ] as HTMLElement[];
    expect(items.length).toBe(1);
    expect(items[0].textContent).toContain('Badge');
  });

  it('shows no sidebar items when the search matches nothing', () => {
    fixture.componentInstance.searchControl.setValue('zzz-no-match');
    fixture.detectChanges();

    const items = fixture.nativeElement.querySelectorAll('orbit-sidebar button.orbit-sidebar__item');
    expect(items.length).toBe(0);
  });
```

(These reference the CSS class `orbit-sidebar__item` used by `OrbitSidebarComponent`'s template for each item button — confirmed in `projects/orbit/src/lib/components/sidebar/sidebar.component.html`. If that class name differs, use `orbit-sidebar` item buttons' actual selector instead; do not guess further without checking the file.)

- [x] **Step 2: Run tests to verify they fail**

Run: `npx vitest run projects/orbit-lab/src/app/shell/lab-shell.component.spec.ts`

Expected: FAIL — no `orbit-sidebar` element exists yet in the template (still on `LabCatalogNavigationPanelComponent` overlay), so the querySelectorAll calls return 0 elements for all three new tests, and `searchControl` doesn't exist on the component (compile error).

- [x] **Step 3: Implement the component logic**

In `projects/orbit-lab/src/app/shell/lab-shell.component.ts`:

Update the imports block — remove `RouterLink, RouterLinkActive` (no longer used once `LabCatalogNavigationPanelComponent` is deleted) and add what the shell now needs:

```typescript
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  signal,
  Signal,
  type WritableSignal,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { DOCUMENT } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { filter, map, startWith } from 'rxjs';
import {
  OrbitButtonComponent,
  OrbitFormFieldComponent,
  OrbitModalBodyComponent,
  OrbitModalFooterComponent,
  OrbitModalHeaderComponent,
  ORBIT_PANEL_DATA,
  OrbitPanelService,
  OrbitPanelSurfaceComponent,
  OrbitSelectComponent,
  OrbitSidebarComponent,
  OrbitSliderComponent,
  OrbitSwitchComponent,
  OrbitTextInputComponent,
  type OrbitDensity,
  type OrbitSidebarItem,
  type OrbitSidebarSection,
} from '@galileo/orbit';
import { CATALOG_ENTRIES } from '../catalog/catalog';
```

Delete the entire `LabCatalogNavigationPanelComponent` class (lines defining `@Component({ selector: 'lab-catalog-navigation-panel', ... })` through its closing `}`) — keep `LabCatalogOptionsPanelComponent` exactly as-is.

In the `@Component({ selector: 'lab-shell', ... })` decorator, update `imports`:

```typescript
  imports: [OrbitButtonComponent, OrbitSidebarComponent, OrbitTextInputComponent, ReactiveFormsModule, RouterOutlet],
```

In `LabShellComponent`, remove `openNavigation()` and add the sidebar/search state. The full updated class body (replacing the existing one, keeping all the theme/density/etc. signals and `createPanelData()` untouched):

```typescript
export class LabShellComponent {
  private readonly panel = inject(OrbitPanelService);
  private readonly router = inject(Router);
  protected readonly theme = signal<LabTheme>('default');
  protected readonly density = signal<LabDensity>('comfortable');
  protected readonly textScale = signal<LabTextScale>('1');
  protected readonly font = signal<LabFont>('public-sans');
  protected readonly shadowIntensity = signal<LabShadowIntensity>('1');
  protected readonly motionEnabled = signal(true);
  protected readonly fontStack = computed(() => LAB_FONT_STACKS[this.font()]);
  protected readonly optionalIconDisplay = computed(() =>
    parseFloat(this.textScale()) > 1.2 ? 'none' : 'grid',
  );
  protected readonly searchControl = new FormControl('', { nonNullable: true });
  protected readonly sidebarCollapsed = signal(false);
  private readonly document = inject(DOCUMENT);

  private readonly searchQuery: Signal<string> = toSignal(this.searchControl.valueChanges, {
    initialValue: this.searchControl.value,
  });

  protected readonly sidebarSections: Signal<readonly OrbitSidebarSection[]> = computed(() => {
    const query = this.searchQuery().trim().toLowerCase();
    const items: OrbitSidebarItem[] = CATALOG_ENTRIES.filter((entry) =>
      entry.label.toLowerCase().includes(query),
    ).map((entry) => ({ id: entry.slug, label: entry.label }));
    return [{ id: 'catalog', items }];
  });

  protected readonly activeSidebarId: Signal<string | null> = toSignal(
    this.router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd),
      map(() => this.currentSlugFromUrl()),
      startWith(this.currentSlugFromUrl()),
    ),
    { initialValue: this.currentSlugFromUrl() },
  );

  constructor() {
    effect((onCleanup) => {
      this.document.body.dataset['orbitMotion'] = this.motionEnabled() ? 'on' : 'off';
      onCleanup(() => this.document.body.removeAttribute('data-orbit-motion'));
    });
  }

  setTheme(theme: LabTheme): void {
    this.theme.set(theme);
  }

  setDensity(density: LabDensity): void {
    this.density.set(density);
  }

  setTextScale(textScale: LabTextScale): void {
    this.textScale.set(textScale);
  }

  setFont(font: LabFont): void {
    this.font.set(font);
  }

  setShadowIntensity(shadowIntensity: LabShadowIntensity): void {
    this.shadowIntensity.set(shadowIntensity);
  }

  setMotionEnabled(motionEnabled: boolean): void {
    this.motionEnabled.set(motionEnabled);
  }

  openOptions(): void {
    this.panel.open(LabCatalogOptionsPanelComponent, {
      side: 'right',
      size: 'md',
      data: this.createPanelData(),
    });
  }

  onSidebarItemSelected(item: OrbitSidebarItem): void {
    this.router.navigate(['/', item.id]);
  }

  onSidebarCollapsedChange(collapsed: boolean): void {
    this.sidebarCollapsed.set(collapsed);
  }

  private currentSlugFromUrl(): string | null {
    const [, slug] = this.router.url.split('/');
    return slug?.split('?')[0] || null;
  }

  private createPanelData(): LabOptionsPanelData {
    return {
      theme: this.theme,
      density: this.density,
      textScale: this.textScale,
      font: this.font,
      shadowIntensity: this.shadowIntensity,
      motionEnabled: this.motionEnabled,
      setTheme: (theme) => this.setTheme(theme),
      setDensity: (density) => this.setDensity(density),
      setTextScale: (textScale) => this.setTextScale(textScale),
      setFont: (font) => this.setFont(font),
      setShadowIntensity: (shadowIntensity) => this.setShadowIntensity(shadowIntensity),
      setMotionEnabled: (motionEnabled) => this.setMotionEnabled(motionEnabled),
    } satisfies LabOptionsPanelData;
  }
}
```

Note: this doesn't compile the template yet — Task 3 wires `orbit-sidebar` and `orbit-text-input` into `lab-shell.component.html`. Steps 4 below will only pass once Task 3's template changes land; if executing tasks strictly in order, run Steps 1–2 now, implement this Step 3, then proceed directly into Task 3 before attempting Step 4's test run.

- [x] **Step 4: Run tests to verify they pass**

Run: `npx vitest run projects/orbit-lab/src/app/shell/lab-shell.component.spec.ts`

Expected: PASS (only once Task 3's template is also in place).

- [x] **Step 5: Commit**

```bash
git add projects/orbit-lab/src/app/shell/lab-shell.component.ts projects/orbit-lab/src/app/shell/lab-shell.component.spec.ts
git commit -m "feat(orbit-lab): drive sidebar sections and active route from shell state"
```

---

## Task 3: Fixed sidebar in the Lab shell — template and layout

**Files:**
- Modify: `projects/orbit-lab/src/app/shell/lab-shell.component.html`
- Modify: `projects/orbit-lab/src/app/shell/lab-shell.component.css`
- Modify: `projects/orbit-lab/src/app/shell/catalog-panel.component.css`
- Test: `projects/orbit-lab/src/app/shell/lab-shell.component.spec.ts` (run only, no new tests — this task makes Task 2's tests pass)

**Interfaces:**
- Consumes: everything produced by Task 2 (`searchControl`, `sidebarSections`, `activeSidebarId`, `sidebarCollapsed`, `onSidebarItemSelected`, `onSidebarCollapsedChange`, `openOptions`).

- [x] **Step 1: Replace the header's "Navigazione" button with the search input**

In `projects/orbit-lab/src/app/shell/lab-shell.component.html`, replace:

```html
<header class="lab-shell__header">
  <div class="lab-shell__header-actions lab-shell__header-actions--start">
    <orbit-button label="Navigazione" variant="outline" tone="neutral" (clicked)="openNavigation()" />
  </div>
```

with:

```html
<header class="lab-shell__header">
  <div class="lab-shell__header-actions lab-shell__header-actions--start">
    <orbit-text-input
      type="search"
      inputId="lab-catalog-search"
      placeholder="Cerca sezione…"
      showLeadingIcon
      leadingIconName="search"
      [formControl]="searchControl"
    />
  </div>
```

- [x] **Step 2: Add the fixed sidebar to the body layout**

Replace:

```html
<div
  class="lab-shell__body"
  data-lab-theme-container
  [attr.data-orbit-theme]="theme() === 'dark' ? 'dark' : null"
  [attr.data-orbit-density]="density()"
  [attr.data-orbit-text-scale]="textScale()"
  [style.--orbit-text-scale]="textScale()"
  [style.--orbit-optional-icon-display]="optionalIconDisplay()"
  [style.--orbit-font-sans]="fontStack()"
>
  <main class="lab-shell__content">
    <router-outlet />
  </main>
</div>
```

with:

```html
<div
  class="lab-shell__body"
  data-lab-theme-container
  [attr.data-orbit-theme]="theme() === 'dark' ? 'dark' : null"
  [attr.data-orbit-density]="density()"
  [attr.data-orbit-text-scale]="textScale()"
  [style.--orbit-text-scale]="textScale()"
  [style.--orbit-optional-icon-display]="optionalIconDisplay()"
  [style.--orbit-font-sans]="fontStack()"
>
  <orbit-sidebar
    ariaLabel="Catalogo tecnico"
    [sections]="sidebarSections()"
    [activeId]="activeSidebarId()"
    [collapsed]="sidebarCollapsed()"
    (itemSelected)="onSidebarItemSelected($event)"
    (collapsedChange)="onSidebarCollapsedChange($event)"
  />
  <main class="lab-shell__content">
    <router-outlet />
  </main>
</div>
```

- [x] **Step 3: Update the body layout to a flex row**

In `projects/orbit-lab/src/app/shell/lab-shell.component.css`, replace:

```css
.lab-shell__body {
  flex: 1 0 auto;
  min-width: 0;
  font-size: var(--orbit-font-size-body);
  line-height: var(--orbit-line-height-body);
}
```

with:

```css
.lab-shell__body {
  display: flex;
  flex-direction: row;
  align-items: stretch;
  flex: 1 0 auto;
  min-width: 0;
  min-height: 0;
  font-size: var(--orbit-font-size-body);
  line-height: var(--orbit-line-height-body);
}
```

And append to `.lab-shell__content` (already present, just confirm/add `min-width: 0` so the flex item can shrink):

```css
.lab-shell__content {
  padding: var(--orbit-space-6);
  flex: 1 1 auto;
  min-width: 0;
}
```

- [x] **Step 4: Remove the now-unused navigation-panel CSS rules**

In `projects/orbit-lab/src/app/shell/catalog-panel.component.css`, delete the `.lab-catalog-panel__nav-link--blocked` rule and any other `.lab-catalog-panel__nav*` selectors (they styled the deleted `LabCatalogNavigationPanelComponent`'s `<nav>`/`<a>` elements; the options panel's `.lab-catalog-panel__options`/`.lab-catalog-panel__field` rules stay untouched).

- [x] **Step 5: Run the full shell spec to verify it passes**

Run: `npx vitest run projects/orbit-lab/src/app/shell/lab-shell.component.spec.ts`

Expected: PASS — all tests including Task 2's three new sidebar tests, and the pre-existing options/theme/density/font tests (still exercising `openOptions()`, unaffected by this change).

- [x] **Step 6: Commit**

```bash
git add projects/orbit-lab/src/app/shell/lab-shell.component.html projects/orbit-lab/src/app/shell/lab-shell.component.css projects/orbit-lab/src/app/shell/catalog-panel.component.css
git commit -m "feat(orbit-lab): render the catalog sidebar as a fixed layout element with header search"
```

---

## Task 4: Navigation test coverage for sidebar item selection

**Files:**
- Modify: `projects/orbit-lab/src/app/shell/lab-shell.component.spec.ts`

**Interfaces:**
- Consumes: `LabShellComponent.onSidebarItemSelected(item: OrbitSidebarItem)` (Task 2); Angular `Router` test harness via `provideRouter([...])`.

- [x] **Step 1: Write the failing test**

Add to `projects/orbit-lab/src/app/shell/lab-shell.component.spec.ts`. First update the `TestBed.configureTestingModule` routes so a real route exists to navigate to — change:

```typescript
    await TestBed.configureTestingModule({
      imports: [LabShellComponent],
      providers: [provideRouter([])],
    }).compileComponents();
```

to:

```typescript
    await TestBed.configureTestingModule({
      imports: [LabShellComponent],
      providers: [
        provideRouter([
          { path: 'badge', children: [] },
          { path: 'button', children: [] },
        ]),
      ],
    }).compileComponents();
```

Then add, after the existing sidebar tests:

```typescript
  it('navigates to the selected catalog entry route', async () => {
    const router = TestBed.inject(Router);
    const navigateSpy = vi.spyOn(router, 'navigate');

    fixture.componentInstance.onSidebarItemSelected({ id: 'badge', label: 'Badge' });

    expect(navigateSpy).toHaveBeenCalledWith(['/', 'badge']);
  });
```

Add the needed imports at the top of the file:

```typescript
import { provideRouter, Router } from '@angular/router';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
```

(replacing the existing `import { provideRouter } from '@angular/router';` and `import { afterEach, beforeEach, describe, expect, it } from 'vitest';` lines).

- [x] **Step 2: Run test to verify it fails**

Run: `npx vitest run projects/orbit-lab/src/app/shell/lab-shell.component.spec.ts`

Expected: FAIL if `onSidebarItemSelected` isn't calling `router.navigate` with those exact arguments yet, or PASS already if Task 2 was implemented correctly — in which case this step confirms via a deliberate temporary break: comment out the `this.router.navigate(['/', item.id]);` line in `lab-shell.component.ts`, rerun, confirm FAIL, then restore the line before Step 3.

- [x] **Step 3: Confirm implementation (no new code needed)**

`onSidebarItemSelected` was already implemented in Task 2 Step 3. Restore/verify the line:

```typescript
  onSidebarItemSelected(item: OrbitSidebarItem): void {
    this.router.navigate(['/', item.id]);
  }
```

- [x] **Step 4: Run test to verify it passes**

Run: `npx vitest run projects/orbit-lab/src/app/shell/lab-shell.component.spec.ts`

Expected: PASS, full file green.

- [x] **Step 5: Commit**

```bash
git add projects/orbit-lab/src/app/shell/lab-shell.component.spec.ts
git commit -m "test(orbit-lab): cover sidebar item selection navigating to the catalog route"
```

---

## Self-Review Notes

- **Spec coverage:** Sidebar-as-fixed-layout (spec §1) → Tasks 2–3. Header search with live filter (spec §2) → Tasks 2–3. Empty-result behavior (spec §2, no message) → Task 2's `sidebarSections` computed returns `items: []`, exercised by Task 2's "shows no sidebar items" test. Options panel untouched (spec §3) → left as-is throughout, existing tests for it kept intact. `search` icon needed by the design but absent from the registry → Task 1.
- **Type consistency:** `OrbitSidebarItem`/`OrbitSidebarSection` field names (`id`, `label`, `items`) match `projects/orbit/src/lib/components/sidebar/sidebar.component.ts` exactly across Tasks 2–4. `onSidebarItemSelected` signature matches the `itemSelected` output's emitted type in both the template binding (Task 3) and the test (Task 4).
- **`orbit-sidebar__item` CSS class confirmed** against `projects/orbit/src/lib/components/sidebar/sidebar.component.html:31` — it's the `<button class="orbit-sidebar__item">` per catalog item, matching Task 2's test selectors exactly.
