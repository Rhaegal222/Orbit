# Examples-page mobile switcher Implementation Plan

> **Stato:** Completato
>
> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [x]`) syntax for tracking.

**Goal:** Replace the wrapping `orbit-tablist` on `/examples` with a mobile-only switcher
(topbar + toggle between an offcanvas drawer and a modal preview-card grid), built entirely
from existing Orbit primitives, and document the composition in the Lab catalog.

**Architecture:** Two small "content" components (`LabExampleSwitcherSidebarContentComponent`,
`LabExampleSwitcherModalComponent`) get opened by `OrbitPanelService`/CDK `Dialog`
respectively — mirroring the existing `LabSidebarDrawerContentComponent`
(`panel-page.component.ts`) and `LabGoogleFontsDialogComponent`
(`google-fonts-dialog.component.ts`) patterns exactly. A third component
(`LabExampleSwitcherComponent`) is the public composition: a topbar showing the current
example plus a 2-way icon-button toggle that decides which content component `open()`
invokes. `examples-page` renders both the switcher and the existing tablist unconditionally;
plain CSS (no JS breakpoint check) shows exactly one of them depending on viewport width.

**Tech Stack:** Angular 22 standalone components, signals, Angular CDK Overlay
(`OrbitPanelService`) and CDK Dialog (`@angular/cdk/dialog`), Vitest.

## Global Constraints

- Breakpoint: `--orbit-breakpoint-sm` = `40rem` (from `projects/orbit/src/styles/tokens.css`).
  Use the literal `40rem` in new CSS (a native media query cannot read a custom property),
  matching the precedent in `auto-hide-on-scroll.directive.ts`.
- No changes to `projects/orbit` (Core) or its `public-api.ts` — every new file lives under
  `projects/orbit-lab/src/app/catalog/example-switcher/`. All Orbit primitives needed
  (`OrbitBadgeComponent`, `OrbitButtonComponent`, `OrbitIconButtonComponent`,
  `OrbitModalComponent`, `OrbitModalHeaderComponent`, `OrbitModalBodyComponent`,
  `OrbitPanelService`, `ORBIT_PANEL_DATA`, `OrbitPanelSurfaceComponent`,
  `OrbitSelectableTileComponent`, `OrbitSidebarComponent`, `OrbitSidebarItem`,
  `OrbitSidebarSection`) are already exported from `@galileo/orbit`.
- Test command for every task: `npm test` (== `ng test orbit-lab --watch=false`). Record the
  pass/fail counts in each task's report; the pre-existing baseline (from the prior session)
  is 170 passed / 0 failed for `orbit-lab` — flag any new failures as a real regression.
- `LabExampleSwitcherComponent` itself carries **no** breakpoint-hiding CSS — visibility
  gating is the *consumer's* responsibility (a wrapper class in
  `examples-page.component.css`), so the same component renders normally, at any width, when
  used as a plain always-visible demo in the Lab catalog (`panel-page.component.html`).
- Follow the codebase's existing test convention for these two mechanisms exactly: inject
  `OverlayContainer` (`@angular/cdk/overlay`) in `beforeEach`, call `overlayContainer.ngOnDestroy()`
  in `afterEach`, and assert against the *real* rendered overlay content (`getContainerElement()`)
  — never mock `OrbitPanelService`/`Dialog`. See `panel-page.component.spec.ts` and
  `dialog-page.component.spec.ts` for the precedent.
- No `Co-Authored-By` trailer on any commit.

---

### Task 1: Offcanvas and modal content components

**Files:**
- Create: `projects/orbit-lab/src/app/catalog/example-switcher/example-switcher.types.ts`
- Create: `projects/orbit-lab/src/app/catalog/example-switcher/example-switcher-sidebar-content.component.ts`
- Test: `projects/orbit-lab/src/app/catalog/example-switcher/example-switcher-sidebar-content.component.spec.ts`
- Create: `projects/orbit-lab/src/app/catalog/example-switcher/example-switcher-modal.component.ts`
- Create: `projects/orbit-lab/src/app/catalog/example-switcher/example-switcher-modal.component.css`
- Test: `projects/orbit-lab/src/app/catalog/example-switcher/example-switcher-modal.component.spec.ts`

**Interfaces:**
- Produces: `LabExampleSwitcherItem { readonly value: string; readonly label: string; readonly badge: string }`.
- Produces: `LabExampleSwitcherSidebarData { readonly items: readonly LabExampleSwitcherItem[]; readonly selected: string; readonly onSelect: (value: string) => void }`, consumed by `LabExampleSwitcherSidebarContentComponent` via `ORBIT_PANEL_DATA`.
- Produces: `LabExampleSwitcherModalData` (same shape as above), consumed by `LabExampleSwitcherModalComponent` via `DIALOG_DATA`.
- Produces: `LabExampleSwitcherSidebarContentComponent`, `LabExampleSwitcherModalComponent` — Task 2's `LabExampleSwitcherComponent` opens these by class reference.

- [x] **Step 1: Create the shared item type**

`projects/orbit-lab/src/app/catalog/example-switcher/example-switcher.types.ts`:
```ts
export interface LabExampleSwitcherItem {
  readonly value: string;
  readonly label: string;
  readonly badge: string;
}
```

- [x] **Step 2: Write the failing offcanvas-content test**

`projects/orbit-lab/src/app/catalog/example-switcher/example-switcher-sidebar-content.component.spec.ts`:
```ts
import { OverlayContainer } from '@angular/cdk/overlay';
import { Component, inject } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { OrbitPanelService } from '@galileo/orbit';
import { LabExampleSwitcherSidebarContentComponent } from './example-switcher-sidebar-content.component';
import type { LabExampleSwitcherItem } from './example-switcher.types';

const ITEMS: readonly LabExampleSwitcherItem[] = [
  { value: 'portfolio', label: 'Portafoglio catalogo', badge: 'Tabella' },
  { value: 'dossier', label: 'Dossier prodotto', badge: 'Workspace' },
];

@Component({ selector: 'lab-test-host', standalone: true, template: '' })
class HostComponent {
  readonly panel = inject(OrbitPanelService);
}

describe('LabExampleSwitcherSidebarContentComponent', () => {
  let fixture: ComponentFixture<HostComponent>;
  let overlayContainer: OverlayContainer;
  let onSelect: (value: string) => void;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [HostComponent] }).compileComponents();
    fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();
    overlayContainer = TestBed.inject(OverlayContainer);
    onSelect = vi.fn();
  });

  afterEach(() => {
    overlayContainer.ngOnDestroy();
  });

  it('renders one sidebar item per example with its badge', () => {
    fixture.componentInstance.panel.open(LabExampleSwitcherSidebarContentComponent, {
      side: 'left',
      size: 'sm',
      data: { items: ITEMS, selected: 'portfolio', onSelect },
    });

    const overlay = overlayContainer.getContainerElement();
    expect(overlay.textContent).toContain('Portafoglio catalogo');
    expect(overlay.textContent).toContain('Workspace');
  });

  it('emits the selected value and closes when an item is clicked', () => {
    fixture.componentInstance.panel.open(LabExampleSwitcherSidebarContentComponent, {
      side: 'left',
      size: 'sm',
      data: { items: ITEMS, selected: 'portfolio', onSelect },
    });

    const overlay = overlayContainer.getContainerElement();
    const dossierButton = [...overlay.querySelectorAll('button.orbit-sidebar__item')].find(
      (button) => button.textContent?.includes('Dossier prodotto'),
    ) as HTMLElement;
    dossierButton.click();
    fixture.detectChanges();

    expect(onSelect).toHaveBeenCalledWith('dossier');
    expect(overlay.querySelector('lab-example-switcher-sidebar-content')).toBeNull();
  });
});
```

- [x] **Step 3: Run it to confirm it fails**

Run: `npm test`
Expected: FAIL — `Cannot find module './example-switcher-sidebar-content.component'`.

- [x] **Step 4: Implement the offcanvas content component**

`projects/orbit-lab/src/app/catalog/example-switcher/example-switcher-sidebar-content.component.ts`:
```ts
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import {
  ORBIT_PANEL_DATA,
  OrbitPanelService,
  OrbitPanelSurfaceComponent,
  OrbitSidebarComponent,
  type OrbitSidebarItem,
  type OrbitSidebarSection,
} from '@galileo/orbit';
import type { LabExampleSwitcherItem } from './example-switcher.types';

export interface LabExampleSwitcherSidebarData {
  readonly items: readonly LabExampleSwitcherItem[];
  readonly selected: string;
  readonly onSelect: (value: string) => void;
}

/** Offcanvas content opened by `LabExampleSwitcherComponent` in 'offcanvas' mode — the
 * drawer-nav composition pattern documented in panel-page (`orbit-sidebar embedded` inside
 * `OrbitPanelService`), applied to switching examples-page's demo scenario instead of app
 * navigation. */
@Component({
  selector: 'lab-example-switcher-sidebar-content',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [OrbitPanelSurfaceComponent, OrbitSidebarComponent],
  template: `<orbit-panel-surface ariaLabel="Cambia scheda">
    <orbit-sidebar
      embedded
      brand="Esempi"
      [sections]="sections"
      [activeId]="data.selected"
      (itemSelected)="select($event)"
      (closed)="close()"
    />
  </orbit-panel-surface>`,
})
export class LabExampleSwitcherSidebarContentComponent {
  private readonly panel = inject(OrbitPanelService);
  protected readonly data = inject(ORBIT_PANEL_DATA) as LabExampleSwitcherSidebarData;

  protected readonly sections: readonly OrbitSidebarSection[] = [
    {
      id: 'examples',
      items: this.data.items.map((item) => ({
        id: item.value,
        label: item.label,
        badge: item.badge,
      })),
    },
  ];

  select(item: OrbitSidebarItem): void {
    this.data.onSelect(item.id);
    this.close();
  }

  close(): void {
    this.panel.closeAll();
  }
}
```

- [x] **Step 5: Run the test to verify it passes**

Run: `npm test`
Expected: PASS (both tests in `example-switcher-sidebar-content.component.spec.ts`).

- [x] **Step 6: Write the failing modal-content test**

`projects/orbit-lab/src/app/catalog/example-switcher/example-switcher-modal.component.spec.ts`:
```ts
import { Dialog } from '@angular/cdk/dialog';
import { OverlayContainer } from '@angular/cdk/overlay';
import { Component, inject } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { LabExampleSwitcherModalComponent } from './example-switcher-modal.component';
import type { LabExampleSwitcherItem } from './example-switcher.types';

const ITEMS: readonly LabExampleSwitcherItem[] = [
  { value: 'portfolio', label: 'Portafoglio catalogo', badge: 'Tabella' },
  { value: 'landing', label: 'Landing partner', badge: 'Landing' },
];

@Component({ selector: 'lab-test-host', standalone: true, template: '' })
class HostComponent {
  readonly dialog = inject(Dialog);
}

describe('LabExampleSwitcherModalComponent', () => {
  let fixture: ComponentFixture<HostComponent>;
  let overlayContainer: OverlayContainer;
  let onSelect: (value: string) => void;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [HostComponent] }).compileComponents();
    fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();
    overlayContainer = TestBed.inject(OverlayContainer);
    onSelect = vi.fn();
  });

  afterEach(() => {
    overlayContainer.ngOnDestroy();
  });

  it('renders one selectable tile per example, marking the current one selected', () => {
    fixture.componentInstance.dialog.open(LabExampleSwitcherModalComponent, {
      data: { items: ITEMS, selected: 'landing', onSelect },
    });

    const overlay = overlayContainer.getContainerElement();
    expect(overlay.textContent).toContain('Portafoglio catalogo');
    const selectedTile = overlay.querySelector('.orbit-selectable-tile--selected');
    expect(selectedTile?.textContent).toContain('Landing partner');
  });

  it('emits the selected value and closes when a tile is clicked', () => {
    fixture.componentInstance.dialog.open(LabExampleSwitcherModalComponent, {
      data: { items: ITEMS, selected: 'portfolio', onSelect },
    });

    const overlay = overlayContainer.getContainerElement();
    const landingTile = [...overlay.querySelectorAll('orbit-selectable-tile button')].find(
      (button) => button.textContent?.includes('Landing partner'),
    ) as HTMLElement;
    landingTile.click();
    fixture.detectChanges();

    expect(onSelect).toHaveBeenCalledWith('landing');
    expect(overlay.querySelector('lab-example-switcher-modal')).toBeNull();
  });
});
```

- [x] **Step 7: Run it to confirm it fails**

Run: `npm test`
Expected: FAIL — `Cannot find module './example-switcher-modal.component'`.

- [x] **Step 8: Implement the modal content component**

`projects/orbit-lab/src/app/catalog/example-switcher/example-switcher-modal.component.css`:
```css
.lab-example-switcher-modal__grid {
  display: grid;
  gap: var(--orbit-space-3);
}
```

`projects/orbit-lab/src/app/catalog/example-switcher/example-switcher-modal.component.ts`:
```ts
import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import {
  OrbitModalBodyComponent,
  OrbitModalComponent,
  OrbitModalHeaderComponent,
  OrbitSelectableTileComponent,
} from '@galileo/orbit';
import type { LabExampleSwitcherItem } from './example-switcher.types';

export interface LabExampleSwitcherModalData {
  readonly items: readonly LabExampleSwitcherItem[];
  readonly selected: string;
  readonly onSelect: (value: string) => void;
}

/** Modal content opened by `LabExampleSwitcherComponent` in 'modal' mode: one selectable tile
 * per example, offered as an alternative to the offcanvas switcher. */
@Component({
  selector: 'lab-example-switcher-modal',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    OrbitModalBodyComponent,
    OrbitModalComponent,
    OrbitModalHeaderComponent,
    OrbitSelectableTileComponent,
  ],
  template: `<orbit-modal labelledBy="example-switcher-modal-title" size="sm">
    <orbit-modal-header
      titleId="example-switcher-modal-title"
      title="Cambia scheda"
      (closeClicked)="close()"
    />
    <orbit-modal-body>
      <div class="lab-example-switcher-modal__grid">
        @for (item of data.items; track item.value) {
          <orbit-selectable-tile
            [label]="item.label"
            [description]="item.badge"
            [selected]="item.value === data.selected"
            (selectedChange)="select(item.value)"
          />
        }
      </div>
    </orbit-modal-body>
  </orbit-modal>`,
  styleUrl: './example-switcher-modal.component.css',
})
export class LabExampleSwitcherModalComponent {
  private readonly dialogRef = inject(DialogRef<LabExampleSwitcherModalComponent>);
  protected readonly data = inject(DIALOG_DATA) as LabExampleSwitcherModalData;

  select(value: string): void {
    this.data.onSelect(value);
    this.close();
  }

  close(): void {
    this.dialogRef.close();
  }
}
```

- [x] **Step 9: Run the tests to verify they pass**

Run: `npm test`
Expected: PASS (both tests in `example-switcher-modal.component.spec.ts`).

- [x] **Step 10: Commit**

```bash
git add projects/orbit-lab/src/app/catalog/example-switcher/example-switcher.types.ts \
  projects/orbit-lab/src/app/catalog/example-switcher/example-switcher-sidebar-content.component.ts \
  projects/orbit-lab/src/app/catalog/example-switcher/example-switcher-sidebar-content.component.spec.ts \
  projects/orbit-lab/src/app/catalog/example-switcher/example-switcher-modal.component.ts \
  projects/orbit-lab/src/app/catalog/example-switcher/example-switcher-modal.component.css \
  projects/orbit-lab/src/app/catalog/example-switcher/example-switcher-modal.component.spec.ts
git commit -m "feat(orbit-lab): add offcanvas and modal content for the example switcher"
```

---

### Task 2: Public switcher composition (topbar + mode toggle)

**Files:**
- Create: `projects/orbit-lab/src/app/catalog/example-switcher/example-switcher.component.ts`
- Create: `projects/orbit-lab/src/app/catalog/example-switcher/example-switcher.component.html`
- Create: `projects/orbit-lab/src/app/catalog/example-switcher/example-switcher.component.css`
- Test: `projects/orbit-lab/src/app/catalog/example-switcher/example-switcher.component.spec.ts`

**Interfaces:**
- Consumes: `LabExampleSwitcherItem` (Task 1), `LabExampleSwitcherSidebarContentComponent` +
  `LabExampleSwitcherSidebarData` (Task 1), `LabExampleSwitcherModalComponent` +
  `LabExampleSwitcherModalData` (Task 1).
- Produces: `LabExampleSwitcherComponent` (selector `lab-example-switcher`) — inputs
  `items: readonly LabExampleSwitcherItem[]` (required), `selected: string` (required);
  output `selectedChange: string`. No breakpoint-hiding CSS (see Global Constraints) — Task 3
  wraps it in a consumer-owned class to gate visibility.

- [x] **Step 1: Write the failing test**

`projects/orbit-lab/src/app/catalog/example-switcher/example-switcher.component.spec.ts`:
```ts
import { OverlayContainer } from '@angular/cdk/overlay';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { LabExampleSwitcherComponent } from './example-switcher.component';
import type { LabExampleSwitcherItem } from './example-switcher.types';

const ITEMS: readonly LabExampleSwitcherItem[] = [
  { value: 'portfolio', label: 'Portafoglio catalogo', badge: 'Tabella' },
  { value: 'dossier', label: 'Dossier prodotto', badge: 'Workspace' },
];

describe('LabExampleSwitcherComponent', () => {
  let fixture: ComponentFixture<LabExampleSwitcherComponent>;
  let overlayContainer: OverlayContainer;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LabExampleSwitcherComponent],
    }).compileComponents();
    fixture = TestBed.createComponent(LabExampleSwitcherComponent);
    fixture.componentRef.setInput('items', ITEMS);
    fixture.componentRef.setInput('selected', 'portfolio');
    fixture.detectChanges();
    overlayContainer = TestBed.inject(OverlayContainer);
  });

  afterEach(() => {
    overlayContainer.ngOnDestroy();
  });

  function clickTrigger(): void {
    (
      fixture.nativeElement.querySelector(
        '.lab-example-switcher__actions orbit-button button',
      ) as HTMLElement
    ).click();
    fixture.detectChanges();
  }

  it('shows the current example label and badge', () => {
    expect(fixture.nativeElement.textContent).toContain('Portafoglio catalogo');
    expect(fixture.nativeElement.textContent).toContain('Tabella');
  });

  it('opens the offcanvas sidebar switcher by default', () => {
    clickTrigger();

    const overlay = overlayContainer.getContainerElement();
    expect(overlay.querySelector('lab-example-switcher-sidebar-content')).toBeTruthy();
  });

  it('opens the modal switcher after toggling to modal mode', () => {
    const gridToggle = fixture.nativeElement.querySelectorAll(
      'orbit-icon-button button',
    )[1] as HTMLElement;
    gridToggle.click();
    fixture.detectChanges();

    clickTrigger();

    const overlay = overlayContainer.getContainerElement();
    expect(overlay.querySelector('lab-example-switcher-modal')).toBeTruthy();
  });

  it('emits selectedChange with the value chosen in the offcanvas', () => {
    let emitted: string | undefined;
    fixture.componentInstance.selectedChange.subscribe((value: string) => (emitted = value));

    clickTrigger();
    const overlay = overlayContainer.getContainerElement();
    const dossierButton = [...overlay.querySelectorAll('button.orbit-sidebar__item')].find(
      (button) => button.textContent?.includes('Dossier prodotto'),
    ) as HTMLElement;
    dossierButton.click();
    fixture.detectChanges();

    expect(emitted).toBe('dossier');
  });
});
```

- [x] **Step 2: Run it to confirm it fails**

Run: `npm test`
Expected: FAIL — `Cannot find module './example-switcher.component'`.

- [x] **Step 3: Implement the template**

`projects/orbit-lab/src/app/catalog/example-switcher/example-switcher.component.html`:
```html
<div class="lab-example-switcher">
  <div class="lab-example-switcher__current">
    <span class="lab-example-switcher__label">{{ current().label }}</span>
    <orbit-badge tone="neutral" [label]="current().badge" />
  </div>
  <div class="lab-example-switcher__actions">
    <orbit-icon-button
      icon="menu"
      ariaLabel="Passa a menu laterale"
      [attr.aria-pressed]="mode() === 'offcanvas'"
      [tone]="mode() === 'offcanvas' ? 'primary' : 'neutral'"
      (clicked)="setMode('offcanvas')"
    />
    <orbit-icon-button
      icon="grid"
      ariaLabel="Passa a schede di anteprima"
      [attr.aria-pressed]="mode() === 'modal'"
      [tone]="mode() === 'modal' ? 'primary' : 'neutral'"
      (clicked)="setMode('modal')"
    />
    <orbit-button
      label="Cambia scheda"
      [ariaLabel]="'Cambia scheda, attualmente: ' + current().label"
      variant="outline"
      tone="neutral"
      (clicked)="open()"
    />
  </div>
</div>
```

- [x] **Step 4: Implement the styles**

`projects/orbit-lab/src/app/catalog/example-switcher/example-switcher.component.css`:
```css
:host {
  display: block;
}

.lab-example-switcher {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: var(--orbit-space-3);
  padding-block-end: var(--orbit-space-3);
}

.lab-example-switcher__current {
  display: flex;
  align-items: center;
  gap: var(--orbit-space-2);
  font-weight: var(--orbit-font-weight-emphasis);
  color: var(--orbit-text-primary);
}

.lab-example-switcher__actions {
  display: flex;
  align-items: center;
  gap: var(--orbit-space-2);
}
```

- [x] **Step 5: Implement the component class**

`projects/orbit-lab/src/app/catalog/example-switcher/example-switcher.component.ts`:
```ts
import { Dialog } from '@angular/cdk/dialog';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import {
  OrbitBadgeComponent,
  OrbitButtonComponent,
  OrbitIconButtonComponent,
  OrbitPanelService,
} from '@galileo/orbit';
import { LabExampleSwitcherModalComponent } from './example-switcher-modal.component';
import { LabExampleSwitcherSidebarContentComponent } from './example-switcher-sidebar-content.component';
import type { LabExampleSwitcherItem } from './example-switcher.types';

export type LabExampleSwitcherMode = 'offcanvas' | 'modal';

/** Mobile-only scenario switcher for pages with several demo scenarios (currently
 * examples-page): a topbar showing the current example plus a toggle between two equivalent
 * switch-example surfaces (offcanvas drawer vs. modal preview cards), both built from
 * existing Orbit primitives. Carries no breakpoint-hiding CSS itself — see
 * `examples-page.component.css` for the consumer-owned visibility gating. */
@Component({
  selector: 'lab-example-switcher',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [OrbitBadgeComponent, OrbitButtonComponent, OrbitIconButtonComponent],
  templateUrl: './example-switcher.component.html',
  styleUrl: './example-switcher.component.css',
})
export class LabExampleSwitcherComponent {
  items = input.required<readonly LabExampleSwitcherItem[]>();
  selected = input.required<string>();
  selectedChange = output<string>();

  private readonly panelService = inject(OrbitPanelService);
  private readonly dialog = inject(Dialog);

  protected readonly mode = signal<LabExampleSwitcherMode>('offcanvas');
  protected readonly current = computed(
    () => this.items().find((item) => item.value === this.selected()) ?? this.items()[0],
  );

  setMode(mode: LabExampleSwitcherMode): void {
    this.mode.set(mode);
  }

  open(): void {
    const onSelect = (value: string) => this.selectedChange.emit(value);
    if (this.mode() === 'offcanvas') {
      this.panelService.open(LabExampleSwitcherSidebarContentComponent, {
        side: 'left',
        size: 'sm',
        data: { items: this.items(), selected: this.selected(), onSelect },
      });
    } else {
      this.dialog.open(LabExampleSwitcherModalComponent, {
        data: { items: this.items(), selected: this.selected(), onSelect },
      });
    }
  }
}
```

- [x] **Step 6: Run the tests to verify they pass**

Run: `npm test`
Expected: PASS (all four tests in `example-switcher.component.spec.ts`).

- [x] **Step 7: Commit**

```bash
git add projects/orbit-lab/src/app/catalog/example-switcher/example-switcher.component.ts \
  projects/orbit-lab/src/app/catalog/example-switcher/example-switcher.component.html \
  projects/orbit-lab/src/app/catalog/example-switcher/example-switcher.component.css \
  projects/orbit-lab/src/app/catalog/example-switcher/example-switcher.component.spec.ts
git commit -m "feat(orbit-lab): add lab-example-switcher composition"
```

---

### Task 3: Wire into examples-page and document in the Lab catalog

**Files:**
- Modify: `projects/orbit-lab/src/app/pages/examples-page/examples-page.component.ts`
- Modify: `projects/orbit-lab/src/app/pages/examples-page/examples-page.component.html`
- Modify: `projects/orbit-lab/src/app/pages/examples-page/examples-page.component.css`
- Modify: `projects/orbit-lab/src/app/pages/examples-page/examples-page.component.spec.ts`
- Modify: `projects/orbit-lab/src/app/pages/panel-page/panel-page.component.ts`
- Modify: `projects/orbit-lab/src/app/pages/panel-page/panel-page.component.html`
- Modify: `projects/orbit-lab/src/app/pages/panel-page/panel-page.component.spec.ts`

**Interfaces:**
- Consumes: `LabExampleSwitcherComponent`, `LabExampleSwitcherItem` (Task 2 / Task 1).

- [x] **Step 1: Add the switcher to examples-page's template**

In `projects/orbit-lab/src/app/pages/examples-page/examples-page.component.html`, insert the
switcher immediately before the existing `<orbit-tablist class="examples__tablist" ...>` (the
tablist itself is unchanged) and add the `examples__tablist` class stays as-is:

```html
  <lab-example [fullWidth]="true" [bare]="selectedExample() === 'landing'">
    <lab-example-switcher
      class="examples__mobile-switcher"
      [items]="exampleSwitcherItems"
      [selected]="selectedExample()"
      (selectedChange)="selectExample($event)"
    />
    <orbit-tablist
      class="examples__tablist"
      ariaLabel="Esempi del catalogo prodotti"
      (selectedChange)="selectExample($event)"
    >
```
(Everything from `<orbit-tab value="portfolio" ...>` through the closing `</orbit-tablist>`
and `@switch (selectedExample())` stays exactly as it is today — only the new
`<lab-example-switcher>` element is inserted above it.)

- [x] **Step 2: Add the switcher's items and import to examples-page's class**

In `projects/orbit-lab/src/app/pages/examples-page/examples-page.component.ts`, add the
import and the `imports` array entry:

```ts
import { LabExampleSwitcherComponent } from '../../catalog/example-switcher/example-switcher.component';
import type { LabExampleSwitcherItem } from '../../catalog/example-switcher/example-switcher.types';
```

Add `LabExampleSwitcherComponent` to the `imports: [...]` array (next to
`LabExampleComponent`).

Add this field to the component class (next to `landingNavItems`):
```ts
  protected readonly exampleSwitcherItems: readonly LabExampleSwitcherItem[] = [
    { value: 'portfolio', label: 'Portafoglio catalogo', badge: 'Tabella' },
    { value: 'dossier', label: 'Dossier prodotto', badge: 'Workspace' },
    { value: 'quick-action', label: 'Azione rapida', badge: 'Modale' },
    { value: 'landing', label: 'Landing partner', badge: 'Landing' },
  ];
```

- [x] **Step 3: Gate visibility in CSS**

In `projects/orbit-lab/src/app/pages/examples-page/examples-page.component.css`, add (near
the top, after the `:host` rule):

```css
.examples__mobile-switcher {
  display: none;
}

@media (max-width: 40rem) {
  .examples__mobile-switcher {
    display: block;
  }

  .examples__tablist {
    display: none;
  }
}
```

- [x] **Step 4: Write the failing wiring test**

Append to `projects/orbit-lab/src/app/pages/examples-page/examples-page.component.spec.ts`
(inside the existing `describe` block, after the last `it`):

```ts
  it('switches the example through the mobile switcher, keeping it in sync with the tablist', () => {
    const switcherHost = fixture.nativeElement.querySelector('lab-example-switcher');
    expect(switcherHost.textContent).toContain('Portafoglio catalogo');

    fixture.componentInstance.selectExample('quick-action');
    fixture.detectChanges();

    expect(
      fixture.nativeElement.querySelector('#orbit-tab-quick-action')?.getAttribute('aria-selected'),
    ).toBe('true');
    expect(switcherHost.textContent).toContain('Azione rapida');
  });
```

- [x] **Step 5: Run it to confirm it fails**

Run: `npm test`
Expected: FAIL — `lab-example-switcher` is not a known element (not yet imported/rendered).

- [x] **Step 6: Apply Steps 1-3 above, then run the tests to verify they pass**

Run: `npm test`
Expected: PASS — full `orbit-lab` suite, including the new test and the two pre-existing
`ExamplesPageComponent` tests (landing tab still renders; portfolio still renders).

- [x] **Step 7: Document the composition in the Lab catalog**

In `projects/orbit-lab/src/app/pages/panel-page/panel-page.component.ts`:

Add to the `@galileo/orbit` import list... no new Orbit imports are needed here. Add this
import instead, next to the existing `LabExampleComponent` import:
```ts
import { LabExampleSwitcherComponent } from '../../catalog/example-switcher/example-switcher.component';
import type { LabExampleSwitcherItem } from '../../catalog/example-switcher/example-switcher.types';
```

Add `LabExampleSwitcherComponent` to the component's `imports: [...]` array.

Add these fields to the class (near `activeId`/`collapsed`):
```ts
  protected readonly exampleSwitcherItems: readonly LabExampleSwitcherItem[] = [
    { value: 'portfolio', label: 'Portafoglio catalogo', badge: 'Tabella' },
    { value: 'dossier', label: 'Dossier prodotto', badge: 'Workspace' },
    { value: 'quick-action', label: 'Azione rapida', badge: 'Modale' },
  ];
  protected readonly exampleSwitcherSelected = signal('portfolio');

  protected readonly exampleSwitcherSnippet = `<!-- Pagine con più scenari demo: topbar + due superfici di cambio intercambiabili -->
<lab-example-switcher
  [items]="items"
  [selected]="selected"
  (selectedChange)="selected = $event"
/>`;
```

Add this method next to `select`:
```ts
  selectExampleSwitcherDemo(value: string): void {
    this.exampleSwitcherSelected.set(value);
  }
```

In `projects/orbit-lab/src/app/pages/panel-page/panel-page.component.html`, add a new
`<section>` right after the existing "Navigazione mobile (drawer)" section (after its
closing `</section>` on the line following `</lab-example>` / `184-187`):

```html
  <section>
    <h2>Selettore esempio (offcanvas + modale)</h2>
    <p>
      Composizione per pagine con più scenari demo (come examples-page): una topbar con
      l'esempio corrente e un toggle fra due superfici equivalenti per cambiarlo — un
      offcanvas (<code>orbit-sidebar embedded</code>) e una modale a card
      (<code>orbit-selectable-tile</code>) — entrambe costruite da primitive Orbit esistenti,
      nessuna nuova.
    </p>
    <lab-example [code]="exampleSwitcherSnippet">
      <lab-example-switcher
        [items]="exampleSwitcherItems"
        [selected]="exampleSwitcherSelected()"
        (selectedChange)="selectExampleSwitcherDemo($event)"
      />
    </lab-example>
  </section>
```

- [x] **Step 8: Write the failing catalog-documentation test**

Append to `projects/orbit-lab/src/app/pages/panel-page/panel-page.component.spec.ts` (inside
the existing `describe` block, after the last `it`):

```ts
  it('documents the example switcher and reacts to a selection made through it', () => {
    expect(fixture.nativeElement.textContent).toContain('Selettore esempio');
    const switcherHost = fixture.nativeElement.querySelector('lab-example-switcher');
    expect(switcherHost.textContent).toContain('Portafoglio catalogo');

    fixture.componentInstance.selectExampleSwitcherDemo('dossier');
    fixture.detectChanges();

    expect(switcherHost.textContent).toContain('Dossier prodotto');
  });
```

- [x] **Step 9: Run it to confirm it fails, then run all tests after Step 7 to verify they pass**

Run: `npm test`
Expected: first FAIL (`'Selettore esempio'` not found), then PASS after Step 7's changes are
in place — full `orbit-lab` suite green.

- [x] **Step 10: Manual browser verification**

With `ng serve orbit-lab` running:
1. Open `/examples` at a 390px-wide viewport. Confirm: the tablist is hidden, the mobile
   switcher topbar is visible, the menu-icon toggle is active by default.
2. Tap "Cambia scheda": confirm the offcanvas drawer opens from the left with 4 items;
   tapping "Dossier prodotto" switches the example and closes the drawer.
3. Tap the grid-icon toggle, then "Cambia scheda": confirm a modal opens with one tile per
   example; tapping "Landing partner" switches the example and closes the modal.
4. Resize to 1024px wide: confirm the tablist reappears and the switcher topbar disappears.
5. Open `/panel` (panel-page's route) and confirm the new "Selettore esempio" section
   renders and both toggle/open flows work there too, at desktop width.

- [x] **Step 11: Commit**

```bash
git add projects/orbit-lab/src/app/pages/examples-page/examples-page.component.ts \
  projects/orbit-lab/src/app/pages/examples-page/examples-page.component.html \
  projects/orbit-lab/src/app/pages/examples-page/examples-page.component.css \
  projects/orbit-lab/src/app/pages/examples-page/examples-page.component.spec.ts \
  projects/orbit-lab/src/app/pages/panel-page/panel-page.component.ts \
  projects/orbit-lab/src/app/pages/panel-page/panel-page.component.html \
  projects/orbit-lab/src/app/pages/panel-page/panel-page.component.spec.ts
git commit -m "feat(orbit-lab): wire the mobile example switcher into examples-page and document it in the Lab catalog"
```
