import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  ElementRef,
  inject,
  output,
  Renderer2,
  signal,
  Signal,
  viewChild,
  type WritableSignal,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { DOCUMENT } from '@angular/common';
import { Dialog } from '@angular/cdk/dialog';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { filter, map, startWith } from 'rxjs';
import { LabMobilePreviewOverlayHost } from './lab-mobile-preview-overlay-container';
import {
  OrbitButtonComponent,
  OrbitFormFieldComponent,
  OrbitIconButtonComponent,
  OrbitModalBodyComponent,
  OrbitModalFooterComponent,
  OrbitModalHeaderComponent,
  ORBIT_PANEL_DATA,
  OrbitPanelService,
  OrbitPanelSurfaceComponent,
  OrbitSelectableTileComponent,
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
type LabOrientation = 'portrait' | 'landscape';

interface LabTouchDrag {
  pointerId: number;
  startX: number;
  startY: number;
  startScrollLeft: number;
  startScrollTop: number;
  dragged: boolean;
  scrollTarget: HTMLElement | null;
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
    </orbit-modal-footer>
  </orbit-panel-surface>`,
  styleUrl: './catalog-panel.component.css',
})
export class LabCatalogOptionsPanelComponent {
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
  /** Emitted on close in addition to `OrbitPanelService.closeAll()`, so a host that embeds
   *  this panel outside the service (e.g. the mobile preview mockup) can react too. */
  readonly closed = output<void>();

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
    this.closed.emit();
    this.panel.closeAll();
  }
}

@Component({
  selector: 'lab-catalog-navigation-panel',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    OrbitTextInputComponent,
    OrbitPanelSurfaceComponent,
    OrbitSidebarComponent,
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
  template: `<orbit-panel-surface ariaLabel="Navigazione mobile">
    <orbit-sidebar
      embedded
      brand="Orbit Lab"
      ariaLabel="Sezioni catalogo"
      [sections]="data.sidebarSections()"
      [activeId]="data.activeSidebarId()"
      [showFooter]="false"
      (itemSelected)="onItemSelected($event)"
      (closed)="close()"
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
    OrbitIconButtonComponent,
    OrbitSelectableTileComponent,
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
  readonly mobilePreview = signal(false);
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
  private touchOverlayElement: HTMLElement | null = null;
  private touchOverlayResizeObserver: ResizeObserver | null = null;
  protected readonly sidebarCollapsed = signal(false);
  protected readonly showSidebarHeader = signal(true);
  private readonly document = inject(DOCUMENT);
  private readonly renderer = inject(Renderer2);
  private readonly mobilePreviewOverlayHost = inject(LabMobilePreviewOverlayHost);
  private readonly phoneScreen = viewChild('phoneScreen', { read: ElementRef });

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

  protected readonly activeEntryLabel = computed(() => {
    const slug = this.activeSidebarId();
    if (!slug) return '';
    const entry = CATALOG_ENTRIES.find((e) => e.slug === slug);
    return entry ? entry.label : '';
  });

  constructor() {
    this.sizeControl.valueChanges.subscribe((val) => {
      this.frameWidthRem.set(val);
    });

    effect((onCleanup) => {
      this.document.body.dataset['orbitMotion'] = this.motionEnabled() ? 'on' : 'off';
      onCleanup(() => this.document.body.removeAttribute('data-orbit-motion'));
    });

    // Registers the phone mockup as the target for every CDK overlay (panels, dialogs,
    // selects, popovers, date-pickers, tooltips…) while mobile-preview is active — see
    // LabScopedOverlayContainer, provided app-wide in app.config.ts.
    effect(() => {
      const host = this.mobilePreview() ? (this.phoneScreen()?.nativeElement ?? null) : null;
      this.mobilePreviewOverlayHost.element.set(host);
    });

    /**
     * Mounted as a real `document.body` child, not inside the mockup template: `.cdk-overlay-
     * container` (which LabScopedOverlayContainer clip-paths to the mockup, but keeps as a true
     * body-level sibling of <lab-shell> — see that class's own comment for why) sits at the
     * document root's stacking context with z-index 1000. A touch-overlay nested inside
     * .lab-shell__phone-screen instead is trapped in *that* element's own local stacking context
     * (it has a `transform`): no z-index inside it, however high, can ever outrank a true
     * sibling of <lab-shell> at the root — the whole nested subtree is flattened to wherever
     * .lab-shell__phone-screen itself ranks among *its* siblings, not the touch-overlay's own
     * z-index. So it has to live at the same DOM level as .cdk-overlay-container to compete
     * with it at all, and is positioned to track the mockup's on-screen rect on every resize.
     */
    effect((onCleanup) => {
      const active = this.mobilePreview() && this.touchMode();
      const phoneScreenEl = this.phoneScreen()?.nativeElement ?? null;

      if (!active || !phoneScreenEl) {
        this.destroyTouchOverlay();
        return;
      }

      this.ensureTouchOverlay(phoneScreenEl);
      onCleanup(() => this.destroyTouchOverlay());
    });
  }

  private ensureTouchOverlay(phoneScreenEl: HTMLElement): void {
    if (!this.touchOverlayElement) {
      // Renderer2.createElement (not document.createElement) so the element carries this
      // component's `_ngcontent-*` attribute — without it, the emulated-encapsulation styles
      // below (position, z-index, cursor, touch-action) silently never match, since this div
      // is mounted as a real document.body child outside Angular's own template tree.
      const overlay = this.renderer.createElement('div') as HTMLElement;
      overlay.className = 'lab-shell__phone-touch-overlay';
      overlay.setAttribute('aria-hidden', 'true');

      const cursor = this.renderer.createElement('span') as HTMLElement;
      cursor.className = 'lab-shell__phone-touch-cursor';
      overlay.appendChild(cursor);

      overlay.addEventListener('pointermove', (e) => this.onTouchOverlayPointerMove(e as PointerEvent));
      overlay.addEventListener('pointerdown', (e) => this.onTouchOverlayPointerDown(e as PointerEvent));
      overlay.addEventListener('pointerup', (e) => this.onTouchOverlayPointerUp(e as PointerEvent));
      overlay.addEventListener('pointercancel', (e) => this.onTouchOverlayPointerUp(e as PointerEvent));
      overlay.addEventListener('pointerleave', (e) => this.onTouchOverlayPointerLeave(e as PointerEvent));

      this.document.body.appendChild(overlay);
      this.touchOverlayElement = overlay;

      const ResizeObserverCtor = this.document.defaultView?.ResizeObserver;
      if (ResizeObserverCtor) {
        this.touchOverlayResizeObserver = new ResizeObserverCtor(() => this.positionTouchOverlay());
        this.touchOverlayResizeObserver.observe(phoneScreenEl);
      }
      this.document.defaultView?.addEventListener('resize', this.positionTouchOverlay);
    }
    this.positionTouchOverlay();
  }

  private readonly positionTouchOverlay = (): void => {
    const phoneScreenEl = this.phoneScreen()?.nativeElement;
    if (!this.touchOverlayElement || !phoneScreenEl) return;

    const rect = phoneScreenEl.getBoundingClientRect();
    this.touchOverlayElement.style.top = `${rect.top}px`;
    this.touchOverlayElement.style.left = `${rect.left}px`;
    this.touchOverlayElement.style.width = `${rect.width}px`;
    this.touchOverlayElement.style.height = `${rect.height}px`;
  };

  private destroyTouchOverlay(): void {
    this.touchOverlayResizeObserver?.disconnect();
    this.touchOverlayResizeObserver = null;
    this.document.defaultView?.removeEventListener('resize', this.positionTouchOverlay);
    this.touchOverlayElement?.remove();
    this.touchOverlayElement = null;
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
    // Close first: an overlay open in one mode (real body vs. the mockup) would otherwise be
    // stranded when LabScopedOverlayContainer switches where new overlays attach.
    this.panel.closeAll();
    const isMobilePreview = !this.mobilePreview();
    this.mobilePreview.set(isMobilePreview);
    this.touchMode.set(isMobilePreview);
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
    if (drag && event.pointerId === drag.pointerId) {
      const viewport = drag.scrollTarget;
      if (viewport) {
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
      return;
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

    if (target) {
      // Native slider dragging can't be started by forwarding a synthetic pointerdown:
      // browsers only arm their own default drag behavior from a *trusted* event, and anything
      // dispatched from JS is untrusted. Drive it by hand instead, off the overlay's own (real)
      // pointermove/pointerup stream.
      const rangeInput = target.matches('input[type="range"]')
        ? (target as HTMLInputElement)
        : target.closest('orbit-slider')?.querySelector<HTMLInputElement>('input[type="range"]');
      if (rangeInput && !rangeInput.disabled) {
        this.beginSliderDrag(overlay, rangeInput, event);
        return;
      }
    }

    overlay.setPointerCapture(event.pointerId);
    this.spawnTouchRipple(overlay, event.clientX, event.clientY);

    const scrollTarget = this.findScrollTarget(overlay, event.clientX, event.clientY);
    this.touchDrag = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      startScrollLeft: scrollTarget?.scrollLeft ?? 0,
      startScrollTop: scrollTarget?.scrollTop ?? 0,
      dragged: false,
      scrollTarget,
    };
  }

  private beginSliderDrag(overlay: HTMLElement, input: HTMLInputElement, event: PointerEvent): void {
    const min = parseFloat(input.min) || 0;
    const max = input.max ? parseFloat(input.max) : 100;
    const step = parseFloat(input.step) || 1;

    const applyValueFromClientX = (clientX: number) => {
      const rect = input.getBoundingClientRect();
      const ratio = rect.width === 0 ? 0 : Math.min(1, Math.max(0, (clientX - rect.left) / rect.width));
      const stepped = Math.round((min + ratio * (max - min) - min) / step) * step + min;
      const next = String(Math.min(max, Math.max(min, stepped)));
      if (input.value !== next) {
        input.value = next;
        input.dispatchEvent(new Event('input', { bubbles: true }));
      }
    };

    overlay.style.pointerEvents = 'none';
    applyValueFromClientX(event.clientX);

    const onMove = (e: PointerEvent) => applyValueFromClientX(e.clientX);
    const end = () => {
      input.dispatchEvent(new Event('change', { bubbles: true }));
      overlay.style.pointerEvents = '';
      this.document.removeEventListener('pointermove', onMove);
      this.document.removeEventListener('pointerup', end);
      this.document.removeEventListener('pointercancel', end);
    };

    this.document.addEventListener('pointermove', onMove);
    this.document.addEventListener('pointerup', end);
    this.document.addEventListener('pointercancel', end);
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

    // Tap (no drag beyond the threshold): forward it to whatever sits below the overlay, since
    // the overlay itself intercepts every pointer event to keep :hover from ever reaching the
    // previewed content. `target.click()` — not a dispatched MouseEvent — because a dispatched
    // event only reaches JS listeners; `.click()` also runs the element's real default action
    // (toggling a checkbox/switch, opening a native <select>), which orbit's own checkbox and
    // switch controls rely on (they wrap a real `<input type="checkbox">`).
    overlay.style.pointerEvents = 'none';
    const target =
      typeof this.document.elementFromPoint === 'function'
        ? (this.document.elementFromPoint(event.clientX, event.clientY) as HTMLElement | null)
        : null;
    overlay.style.pointerEvents = '';
    if (target) {
      this.simulateTap(target);
    }
  }

  // `.click()` (not a dispatched MouseEvent) so the element's real default action also runs —
  // toggling a checkbox/switch, opening a native <select> — which orbit's checkbox/switch rely
  // on (they wrap a real `<input type="checkbox">`). SVG icon glyphs (icon-button icons) don't
  // implement `.click()` though, so walk up to the nearest ancestor that does — normally the
  // enclosing `<button>` itself.
  private simulateTap(target: HTMLElement): void {
    target.closest<HTMLElement>('input, textarea, select')?.focus();

    let clickable: Element | null = target;
    while (clickable && typeof (clickable as HTMLElement).click !== 'function') {
      clickable = clickable.parentElement;
    }
    (clickable as HTMLElement | null)?.click();
  }

  private findPhoneViewport(overlay: HTMLElement): HTMLElement | null {
    return overlay.parentElement?.querySelector<HTMLElement>('.lab-shell__phone-viewport') ?? null;
  }

  /**
   * The overlay always sits above everything (mobile nav drawer included), so a drag must
   * scroll whatever is actually visible under the pointer — the drawer's own sidebar nav
   * when it's open, the page content otherwise — not always the underlying page viewport.
   */
  private findScrollTarget(
    overlay: HTMLElement,
    clientX: number,
    clientY: number,
  ): HTMLElement | null {
    overlay.style.pointerEvents = 'none';
    const target =
      typeof this.document.elementFromPoint === 'function'
        ? (this.document.elementFromPoint(clientX, clientY) as HTMLElement | null)
        : null;
    overlay.style.pointerEvents = '';

    const phoneScreen = overlay.closest('.lab-shell__phone-screen');
    let node: HTMLElement | null = target;
    while (node && node !== phoneScreen) {
      if (node.scrollHeight > node.clientHeight) {
        const overflowY = getComputedStyle(node).overflowY;
        if (overflowY === 'auto' || overflowY === 'scroll') {
          return node;
        }
      }
      node = node.parentElement;
    }

    // An open dialog/panel/select/popover renders through the same CDK overlay the mockup
    // redirects (LabScopedOverlayContainer), so it sits between `target` and `phoneScreen` in
    // the walk above. A drag over its own non-scrollable surface (a label, a title, empty
    // space) must not fall through to the page behind it — only a drag with no pane above the
    // touched point (the base page itself) reaches the phone-viewport fallback.
    if (target?.closest('.cdk-overlay-pane')) {
      return null;
    }

    return this.findPhoneViewport(overlay);
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
    const ripple = this.renderer.createElement('span') as HTMLElement;
    ripple.className = 'lab-shell__phone-touch-ripple';
    ripple.style.left = `${clientX - rect.left}px`;
    ripple.style.top = `${clientY - rect.top}px`;
    container.appendChild(ripple);
    ripple.addEventListener('animationend', () => ripple.remove(), { once: true });
  }

  /**
   * Always goes through the real OrbitPanelService: when mobile-preview is active,
   * LabScopedOverlayContainer transparently redirects the CDK overlay into the phone mockup
   * instead of document.body, so this needs no preview-aware branching of its own.
   */
  openNavigation(): void {
    this.panel.open(LabCatalogNavigationPanelComponent, {
      side: 'left',
      size: 'sm',
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
      size: 'sm',
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

  protected createPanelData(): LabOptionsPanelData {
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
