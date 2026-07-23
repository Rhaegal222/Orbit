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
import { Dialog } from '@angular/cdk/dialog';
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
  type OrbitShape,
  type OrbitSelectOption,
  type OrbitSidebarItem,
  type OrbitSidebarSection,
} from '@galileo/orbit';
import { CATALOG_ENTRIES } from '../catalog/catalog';
import { LabGoogleFontsDialogComponent } from './google-fonts-dialog.component';
import { LabGoogleFontsService, type LabGoogleFont } from './google-fonts.service';

type LabTheme = 'default' | 'dark';
type LabDensity = OrbitDensity;
type LabTextScale = '0.85' | '1' | '1.1' | '1.25' | '1.5';
type LabFont = string;
type LabShadowIntensity = '0' | '0.25' | '0.5' | '0.75' | '1';
type LabShape = OrbitShape;
type LabDevice = 'smartphone' | 'tablet';
type LabOrientation = 'portrait' | 'landscape';

interface LabTouchDrag {
  pointerId: number;
  startX: number;
  startY: number;
  startScrollLeft: number;
  startScrollTop: number;
  dragged: boolean;
}

const LAB_FONT_STACKS: Record<string, string> = {
  'public-sans': "'Public Sans', Inter, ui-sans-serif, system-ui, sans-serif",
  inter: 'Inter, ui-sans-serif, system-ui, sans-serif',
  system: "ui-sans-serif, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
};

function fontStack(font: LabFont): string {
  return LAB_FONT_STACKS[font] ?? `'${font}', ui-sans-serif, system-ui, sans-serif`;
}

interface LabOptionsPanelData {
  theme: WritableSignal<LabTheme>;
  density: WritableSignal<LabDensity>;
  textScale: WritableSignal<LabTextScale>;
  font: WritableSignal<LabFont>;
  fontOptions: Signal<OrbitSelectOption[]>;
  shadowIntensity: WritableSignal<LabShadowIntensity>;
  shape: WritableSignal<LabShape>;
  motionEnabled: WritableSignal<boolean>;
  setTheme: (theme: LabTheme) => void;
  setDensity: (density: LabDensity) => void;
  setTextScale: (textScale: LabTextScale) => void;
  setFont: (font: LabFont) => void;
  openGoogleFonts: () => void;
  setShadowIntensity: (shadowIntensity: LabShadowIntensity) => void;
  setShape: (shape: LabShape) => void;
  setMotionEnabled: (motionEnabled: boolean) => void;
}

@Component({
  selector: 'lab-catalog-options-panel',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    OrbitButtonComponent,
    OrbitFormFieldComponent,
    OrbitModalBodyComponent,
    OrbitModalFooterComponent,
    OrbitModalHeaderComponent,
    OrbitPanelSurfaceComponent,
    OrbitSelectComponent,
    OrbitSliderComponent,
    OrbitSwitchComponent,
    ReactiveFormsModule,
  ],
  host: {
    '[attr.data-orbit-theme]': 'data.theme() === "dark" ? "dark" : null',
    '[attr.data-orbit-density]': 'data.density()',
    '[style.--orbit-text-scale]': 'data.textScale()',
    '[style.--orbit-optional-icon-display]': 'optionalIconDisplay()',
    '[style.--orbit-font-sans]': 'fontStack()',
    '[attr.data-orbit-shadow-intensity]': 'data.shadowIntensity()',
    '[attr.data-orbit-shape]': 'data.shape()',
  },
  template: `<orbit-panel-surface labelledBy="catalog-options-title">
    <orbit-modal-header
      title="Opzioni catalogo"
      subtitle="Tema, densità, forme, scala, font, ombre e motion"
      titleId="catalog-options-title"
      (closeClicked)="close()"
    />
    <orbit-modal-body>
      <div class="lab-catalog-panel__options">
        <orbit-form-field class="lab-catalog-panel__field" label="Tema" inputId="lab-theme">
          <orbit-select
            inputId="lab-theme"
            [options]="themeOptions"
            [formControl]="themeControl"
            (valueChange)="setTheme($event)"
          />
        </orbit-form-field>
        <orbit-form-field class="lab-catalog-panel__field" label="Densità" inputId="lab-density">
          <orbit-select
            inputId="lab-density"
            [options]="densityOptions"
            [formControl]="densityControl"
            (valueChange)="setDensity($event)"
          />
        </orbit-form-field>
        <orbit-form-field class="lab-catalog-panel__field" label="Stile forme" inputId="lab-shape">
          <orbit-select
            inputId="lab-shape"
            [options]="shapeOptions"
            [formControl]="shapeControl"
            (valueChange)="setShape($event)"
          />
        </orbit-form-field>
        <orbit-form-field
          class="lab-catalog-panel__field"
          label="Scala testo"
          inputId="lab-text-scale"
        >
          <orbit-select
            inputId="lab-text-scale"
            [options]="textScaleOptions"
            [formControl]="textScaleControl"
            (valueChange)="setTextScale($event)"
          />
        </orbit-form-field>
        <orbit-form-field class="lab-catalog-panel__field" label="Animazioni" inputId="lab-motion">
          <orbit-switch
            inputId="lab-motion"
            ariaLabel="Attiva animazioni"
            [formControl]="motionEnabledControl"
            (checkedChange)="setMotionEnabled($event)"
          />
        </orbit-form-field>
        <orbit-form-field class="lab-catalog-panel__field" label="Font" inputId="lab-font">
          <orbit-select
            inputId="lab-font"
            [options]="fontOptions()"
            [formControl]="fontControl"
            (valueChange)="setFont($event)"
          />
        </orbit-form-field>
        <orbit-form-field
          class="lab-catalog-panel__field"
          label="Intensità ombre"
          inputId="lab-shadow-intensity"
        >
          <orbit-slider
            inputId="lab-shadow-intensity"
            ariaLabel="Intensità ombre"
            [min]="0"
            [max]="100"
            [step]="25"
            showValue
            [formControl]="shadowIntensityControl"
            (valueChange)="setShadowIntensity($event)"
          />
        </orbit-form-field>
      </div>
    </orbit-modal-body>
    <orbit-modal-footer>
      <span orbitModalFooterLeft>Le opzioni sono applicate subito.</span>
      <span orbitModalFooterRight>
        <orbit-button label="Fine" variant="outline" tone="neutral" (clicked)="close()" />
      </span>
    </orbit-modal-footer>
  </orbit-panel-surface>`,
  styleUrl: './catalog-panel.component.css',
})
class LabCatalogOptionsPanelComponent {
  readonly data = inject(ORBIT_PANEL_DATA) as LabOptionsPanelData;
  readonly themeControl = new FormControl<LabTheme>(this.data.theme(), { nonNullable: true });
  readonly densityControl = new FormControl<LabDensity>(this.data.density(), { nonNullable: true });
  readonly textScaleControl = new FormControl<LabTextScale>(this.data.textScale(), {
    nonNullable: true,
  });
  readonly fontControl = new FormControl<LabFont>(this.data.font(), { nonNullable: true });
  readonly shadowIntensityControl = new FormControl<number>(
    Number(this.data.shadowIntensity()) * 100,
    { nonNullable: true },
  );
  readonly shapeControl = new FormControl<LabShape>(this.data.shape(), { nonNullable: true });
  readonly motionEnabledControl = new FormControl<boolean>(this.data.motionEnabled(), {
    nonNullable: true,
  });
  readonly themeOptions = [
    { value: 'default', label: 'Chiaro' },
    { value: 'dark', label: 'Scuro' },
  ];
  readonly densityOptions = [
    { value: 'spacious', label: 'Spaziosa' },
    { value: 'comfortable', label: 'Comfortable' },
    { value: 'compact', label: 'Compact' },
    { value: 'dense', label: 'Densa' },
  ];
  readonly textScaleOptions = [
    { value: '0.85', label: '85%' },
    { value: '1', label: '100%' },
    { value: '1.1', label: '110%' },
    { value: '1.25', label: '125%' },
    { value: '1.5', label: '150%' },
  ];
  readonly fontOptions = computed(() => [
    ...this.data.fontOptions(),
    { value: 'add-google-fonts', label: 'Scarica altri font…' },
  ]);
  readonly shapeOptions = [
    { value: 'square', label: 'Squadrato · editoriale' },
    { value: 'operational', label: 'Operativo · compatto' },
    { value: 'soft', label: 'Morbido · bilanciato' },
    { value: 'rounded', label: 'Arrotondato · accogliente' },
  ];
  readonly fontStack = computed(() => fontStack(this.data.font()));
  readonly optionalIconDisplay = computed(() =>
    parseFloat(this.data.textScale()) > 1.2 ? 'none' : 'grid',
  );
  private readonly panel = inject(OrbitPanelService);

  setTheme(value: string | number | null): void {
    if (value === 'default' || value === 'dark') this.data.setTheme(value);
  }

  setDensity(value: string | number | null): void {
    if (
      value === 'spacious' ||
      value === 'comfortable' ||
      value === 'compact' ||
      value === 'dense'
    ) {
      this.data.setDensity(value);
    }
  }

  setTextScale(value: string | number | null): void {
    if (
      value === '0.85' ||
      value === '1' ||
      value === '1.1' ||
      value === '1.25' ||
      value === '1.5'
    ) {
      this.data.setTextScale(value);
    }
  }

  setFont(value: string | number | null): void {
    if (value === 'add-google-fonts') {
      this.fontControl.setValue(this.data.font());
      this.data.openGoogleFonts();
      return;
    }
    if (typeof value === 'string') this.data.setFont(value);
  }

  setShadowIntensity(value: number): void {
    if ([0, 25, 50, 75, 100].includes(value)) {
      this.data.setShadowIntensity(String(value / 100) as LabShadowIntensity);
    }
  }

  setShape(value: string | number | null): void {
    if (value === 'square' || value === 'operational' || value === 'soft' || value === 'rounded') {
      this.data.setShape(value);
    }
  }

  setMotionEnabled(value: boolean): void {
    this.data.setMotionEnabled(value);
  }

  close(): void {
    this.panel.closeAll();
  }
}

@Component({
  selector: 'lab-catalog-navigation-panel',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    OrbitSidebarComponent,
    OrbitTextInputComponent,
    OrbitPanelSurfaceComponent,
    OrbitModalHeaderComponent,
    OrbitModalBodyComponent,
    ReactiveFormsModule,
  ],
  host: {
    '[attr.data-orbit-theme]': 'data.theme() === "dark" ? "dark" : null',
    '[attr.data-orbit-density]': 'data.density()',
    '[style.--orbit-text-scale]': 'data.textScale()',
    '[style.--orbit-optional-icon-display]': 'optionalIconDisplay()',
    '[style.--orbit-font-sans]': 'fontStack()',
    '[attr.data-orbit-shadow-intensity]': 'data.shadowIntensity()',
    '[attr.data-orbit-shape]': 'data.shape()',
  },
  template: `<orbit-panel-surface labelledBy="catalog-nav-title">
    <orbit-modal-header
      title="Sezioni catalogo"
      titleId="catalog-nav-title"
      (closeClicked)="close()"
    />
    <orbit-modal-body style="padding: 0; height: 100%; display: flex; flex-direction: column;">
      <div style="flex: 1 1 auto; min-height: 0; height: 100%;">
        <orbit-sidebar
          style="--orbit-sidebar-width: 100%; width: 100%; height: 100%;"
          brand="Orbit Lab"
          ariaLabel="Catalogo tecnico"
          [sections]="data.sidebarSections()"
          [activeId]="data.activeSidebarId()"
          [collapsed]="false"
          [showHeader]="true"
          [showFooter]="false"
          (itemSelected)="onItemSelected($event)"
        >
          <orbit-text-input
            orbitSidebarSearch
            type="search"
            inputId="lab-catalog-search-mobile"
            placeholder="Cerca sezione…"
            showLeadingIcon
            leadingIconName="search"
            [formControl]="data.searchControl"
          />
        </orbit-sidebar>
      </div>
    </orbit-modal-body>
  </orbit-panel-surface>`,
})
class LabCatalogNavigationPanelComponent {
  readonly data = inject(ORBIT_PANEL_DATA) as any;
  private readonly panel = inject(OrbitPanelService);

  readonly fontStack = computed(() => fontStack(this.data.font()));
  readonly optionalIconDisplay = computed(() =>
    parseFloat(this.data.textScale()) > 1.2 ? 'none' : 'grid',
  );

  onItemSelected(item: OrbitSidebarItem): void {
    this.data.onSidebarItemSelected(item);
    this.close();
  }

  close(): void {
    this.panel.closeAll();
  }
}

@Component({
  selector: 'lab-shell',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    OrbitButtonComponent,
    OrbitSidebarComponent,
    OrbitSelectComponent,
    OrbitTextInputComponent,
    ReactiveFormsModule,
    RouterOutlet,
  ],
  templateUrl: './lab-shell.component.html',
  styleUrl: './lab-shell.component.css',
  host: {
    '[attr.data-orbit-theme]': 'theme() === "dark" ? "dark" : null',
    '[attr.data-orbit-density]': 'density()',
    '[attr.data-orbit-text-scale]': 'textScale()',
    '[style.--orbit-text-scale]': 'textScale()',
    '[style.--orbit-optional-icon-display]': 'optionalIconDisplay()',
    '[style.--orbit-font-sans]': 'fontStack()',
    '[attr.data-orbit-shadow-intensity]': 'shadowIntensity()',
    '[attr.data-orbit-shape]': 'shape()',
    '[attr.data-orbit-motion]': 'motionEnabled() ? "on" : "off"',
  },
})
export class LabShellComponent {
  private readonly panel = inject(OrbitPanelService);
  private readonly dialog = inject(Dialog);
  private readonly googleFonts = inject(LabGoogleFontsService);
  private readonly router = inject(Router);
  protected readonly theme = signal<LabTheme>('default');
  protected readonly density = signal<LabDensity>('comfortable');
  protected readonly textScale = signal<LabTextScale>('1');
  protected readonly font = signal<LabFont>('public-sans');
  protected readonly fontOptions = signal<OrbitSelectOption[]>([
    { value: 'public-sans', label: 'Public Sans' },
    { value: 'inter', label: 'Inter' },
    { value: 'system', label: 'System UI' },
  ]);
  protected readonly shadowIntensity = signal<LabShadowIntensity>('1');
  protected readonly shape = signal<LabShape>('soft');
  protected readonly motionEnabled = signal(true);
  protected readonly fontStack = computed(() => fontStack(this.font()));
  protected readonly optionalIconDisplay = computed(() =>
    parseFloat(this.textScale()) > 1.2 ? 'none' : 'grid',
  );
  readonly searchControl = new FormControl('', { nonNullable: true });
  protected readonly mobilePreview = signal(false);
  protected readonly device = signal<LabDevice>('smartphone');
  protected readonly orientation = signal<LabOrientation>('portrait');
  protected readonly touchMode = signal(false);
  protected readonly frameWidthRem = signal(23.4375); // 375px, current smartphone default
  protected readonly sizeOptions: OrbitSelectOption[] = [
    { value: 23.4375, label: '375px (Cellulare)' },
    { value: 40, label: 'sm · 640px' },
    { value: 48, label: 'md · 768px' },
    { value: 64, label: 'lg · 1024px' },
  ];
  readonly sizeControl = new FormControl<number>(23.4375, { nonNullable: true });

  protected readonly phoneWidthRem = computed(() => {
    if (this.orientation() === 'portrait') {
      return this.frameWidthRem();
    } else {
      return 56;
    }
  });

  protected readonly phoneHeightCss = computed(() => {
    const heightRem = this.orientation() === 'portrait' ? 56 : this.frameWidthRem();
    return `min(${heightRem}rem, calc(100dvh - var(--orbit-control-height) - var(--orbit-space-6)))`;
  });

  private touchDrag: LabTouchDrag | null = null;
  protected readonly sidebarCollapsed = signal(false);
  protected readonly showSidebarHeader = signal(true);
  private readonly document = inject(DOCUMENT);

  private readonly searchQuery: Signal<string> = toSignal(this.searchControl.valueChanges, {
    initialValue: this.searchControl.value,
  });

  protected readonly sidebarSections: Signal<readonly OrbitSidebarSection[]> = computed(() => {
    const query = this.searchQuery().trim().toLowerCase();
    const items: OrbitSidebarItem[] = CATALOG_ENTRIES.filter((entry) =>
      entry.label.toLowerCase().includes(query),
    ).map((entry) => ({ id: entry.slug, label: entry.label, icon: entry.icon }));
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
    this.sizeControl.valueChanges.subscribe((val) => {
      this.frameWidthRem.set(val);
    });

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

  openGoogleFonts(): void {
    this.dialog.open(LabGoogleFontsDialogComponent, {
      ariaLabel: 'Aggiungi Google Fonts',
      autoFocus: 'first-tabbable',
      data: {
        installedFonts: this.fontOptions().map((option) => String(option.value)),
        addFont: (font: LabGoogleFont) => this.addGoogleFont(font),
        theme: this.theme(),
        density: this.density(),
        shape: this.shape(),
        textScale: this.textScale(),
      },
      panelClass: 'lab-google-fonts-dialog-pane',
      width: 'min(96vw, 73.75rem)',
      maxWidth: '96vw',
    });
  }

  setShadowIntensity(shadowIntensity: LabShadowIntensity): void {
    this.shadowIntensity.set(shadowIntensity);
  }

  setShape(shape: LabShape): void {
    this.shape.set(shape);
  }

  setMotionEnabled(motionEnabled: boolean): void {
    this.motionEnabled.set(motionEnabled);
  }

  toggleMobilePreview(): void {
    const isMobilePreview = !this.mobilePreview();
    this.mobilePreview.set(isMobilePreview);
    this.touchMode.set(isMobilePreview);
  }

  toggleDevice(): void {
    this.device.update((device) => (device === 'smartphone' ? 'tablet' : 'smartphone'));
  }

  toggleOrientation(): void {
    this.orientation.update((orientation) =>
      orientation === 'portrait' ? 'landscape' : 'portrait',
    );
  }

  toggleTouchMode(): void {
    this.touchMode.update((touchMode) => !touchMode);
  }

  setFrameWidth(rem: number): void {
    this.frameWidthRem.set(rem);
    this.sizeControl.setValue(rem, { emitEvent: false });
  }

  onTouchOverlayPointerMove(event: PointerEvent): void {
    const overlay = event.currentTarget as HTMLElement;
    this.moveTouchCursor(overlay, event.clientX, event.clientY);

    const drag = this.touchDrag;
    if (!drag || event.pointerId !== drag.pointerId) {
      return;
    }
    const viewport = this.findPhoneViewport(overlay);
    if (!viewport) {
      return;
    }
    const deltaX = event.clientX - drag.startX;
    const deltaY = event.clientY - drag.startY;
    if (!drag.dragged && Math.hypot(deltaX, deltaY) > 4) {
      drag.dragged = true;
    }
    if (drag.dragged) {
      viewport.scrollLeft = drag.startScrollLeft - deltaX;
      viewport.scrollTop = drag.startScrollTop - deltaY;
    }
  }

  onTouchOverlayPointerLeave(event: PointerEvent): void {
    this.hideTouchCursor(event.currentTarget as HTMLElement);
  }

  onTouchOverlayPointerDown(event: PointerEvent): void {
    const overlay = event.currentTarget as HTMLElement;

    // Check what element is directly under the pointer
    overlay.style.pointerEvents = 'none';
    const target =
      typeof this.document.elementFromPoint === 'function'
        ? (this.document.elementFromPoint(event.clientX, event.clientY) as HTMLElement | null)
        : null;
    overlay.style.pointerEvents = '';

    if (target && (target.matches('input[type="range"]') || target.closest('orbit-slider'))) {
      overlay.style.pointerEvents = 'none';
      const downEvent = new PointerEvent('pointerdown', {
        bubbles: true,
        cancelable: true,
        clientX: event.clientX,
        clientY: event.clientY,
        pointerId: event.pointerId,
        pointerType: event.pointerType,
        isPrimary: event.isPrimary,
      });
      target.dispatchEvent(downEvent);

      const restoreOverlay = () => {
        overlay.style.pointerEvents = '';
        this.document.removeEventListener('pointerup', restoreOverlay);
        this.document.removeEventListener('pointercancel', restoreOverlay);
      };
      this.document.addEventListener('pointerup', restoreOverlay);
      this.document.addEventListener('pointercancel', restoreOverlay);
      return;
    }

    overlay.setPointerCapture(event.pointerId);
    this.spawnTouchRipple(overlay, event.clientX, event.clientY);

    const viewport = this.findPhoneViewport(overlay);
    this.touchDrag = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      startScrollLeft: viewport?.scrollLeft ?? 0,
      startScrollTop: viewport?.scrollTop ?? 0,
      dragged: false,
    };
  }

  onTouchOverlayPointerUp(event: PointerEvent): void {
    const overlay = event.currentTarget as HTMLElement;
    if (overlay.hasPointerCapture(event.pointerId)) {
      overlay.releasePointerCapture(event.pointerId);
    }

    const drag = this.touchDrag;
    this.touchDrag = null;
    if (!drag || drag.pointerId !== event.pointerId || drag.dragged) {
      return;
    }

    // Tap (no drag beyond the threshold): forward a real click to whatever sits below the
    // overlay, since the overlay itself intercepts every pointer event to keep :hover from
    // ever reaching the previewed content.
    overlay.style.pointerEvents = 'none';
    const target = typeof this.document.elementFromPoint === 'function'
      ? this.document.elementFromPoint(event.clientX, event.clientY) as HTMLElement | null
      : null;
    overlay.style.pointerEvents = '';
    if (target) {
      let clickEvent: MouseEvent;
      try {
        clickEvent = new MouseEvent('click', {
          bubbles: true,
          cancelable: true,
          clientX: event.clientX,
          clientY: event.clientY,
          view: this.document.defaultView,
        });
      } catch {
        clickEvent = new MouseEvent('click', {
          bubbles: true,
          cancelable: true,
          clientX: event.clientX,
          clientY: event.clientY,
        });
      }
      target.dispatchEvent(clickEvent);
    }
  }

  private findPhoneViewport(overlay: HTMLElement): HTMLElement | null {
    return overlay.parentElement?.querySelector<HTMLElement>('.lab-shell__phone-viewport') ?? null;
  }

  private moveTouchCursor(overlay: HTMLElement, clientX: number, clientY: number): void {
    const cursor = overlay.querySelector<HTMLElement>('.lab-shell__phone-touch-cursor');
    if (!cursor) {
      return;
    }
    const rect = overlay.getBoundingClientRect();
    cursor.style.left = `${clientX - rect.left}px`;
    cursor.style.top = `${clientY - rect.top}px`;
    cursor.style.opacity = '1';
  }

  private hideTouchCursor(overlay: HTMLElement): void {
    const cursor = overlay.querySelector<HTMLElement>('.lab-shell__phone-touch-cursor');
    if (cursor) {
      cursor.style.opacity = '0';
    }
  }

  private spawnTouchRipple(container: HTMLElement, clientX: number, clientY: number): void {
    const rect = container.getBoundingClientRect();
    const ripple = this.document.createElement('span');
    ripple.className = 'lab-shell__phone-touch-ripple';
    ripple.style.left = `${clientX - rect.left}px`;
    ripple.style.top = `${clientY - rect.top}px`;
    container.appendChild(ripple);
    ripple.addEventListener('animationend', () => ripple.remove(), { once: true });
  }

  openNavigation(): void {
    this.panel.open(LabCatalogNavigationPanelComponent, {
      side: 'left',
      size: 'md',
      data: {
        theme: this.theme,
        density: this.density,
        textScale: this.textScale,
        font: this.font,
        fontOptions: this.fontOptions,
        shadowIntensity: this.shadowIntensity,
        shape: this.shape,
        sidebarSections: this.sidebarSections,
        activeSidebarId: this.activeSidebarId,
        searchControl: this.searchControl,
        onSidebarItemSelected: (item: OrbitSidebarItem) => this.onSidebarItemSelected(item),
      },
    });
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
      fontOptions: this.fontOptions,
      shadowIntensity: this.shadowIntensity,
      shape: this.shape,
      motionEnabled: this.motionEnabled,
      setTheme: (theme) => this.setTheme(theme),
      setDensity: (density) => this.setDensity(density),
      setTextScale: (textScale) => this.setTextScale(textScale),
      setFont: (font) => this.setFont(font),
      openGoogleFonts: () => this.openGoogleFonts(),
      setShadowIntensity: (shadowIntensity) => this.setShadowIntensity(shadowIntensity),
      setShape: (shape) => this.setShape(shape),
      setMotionEnabled: (motionEnabled) => this.setMotionEnabled(motionEnabled),
    } satisfies LabOptionsPanelData;
  }

  private addGoogleFont(font: LabGoogleFont): void {
    this.googleFonts.load(font.family);
    this.fontOptions.update((options) => {
      if (options.some((option) => option.value === font.family)) return options;
      return [...options, { value: font.family, label: font.family }];
    });
    this.font.set(font.family);
  }
}
