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

type LabTheme = 'default' | 'dark';
type LabDensity = OrbitDensity;
type LabTextScale = '0.85' | '1' | '1.1' | '1.25' | '1.5';
type LabFont = 'public-sans' | 'inter' | 'system';
type LabShadowIntensity = '0' | '0.25' | '0.5' | '0.75' | '1';

const LAB_FONT_STACKS: Record<LabFont, string> = {
  'public-sans': "'Public Sans', Inter, ui-sans-serif, system-ui, sans-serif",
  inter: 'Inter, ui-sans-serif, system-ui, sans-serif',
  system: "ui-sans-serif, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
};

interface LabOptionsPanelData {
  theme: WritableSignal<LabTheme>;
  density: WritableSignal<LabDensity>;
  textScale: WritableSignal<LabTextScale>;
  font: WritableSignal<LabFont>;
  shadowIntensity: WritableSignal<LabShadowIntensity>;
  motionEnabled: WritableSignal<boolean>;
  setTheme: (theme: LabTheme) => void;
  setDensity: (density: LabDensity) => void;
  setTextScale: (textScale: LabTextScale) => void;
  setFont: (font: LabFont) => void;
  setShadowIntensity: (shadowIntensity: LabShadowIntensity) => void;
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
  },
  template: `<orbit-panel-surface labelledBy="catalog-options-title">
    <orbit-modal-header
      title="Opzioni catalogo"
      subtitle="Tema, densità, scala, font, ombre e motion"
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
            [options]="fontOptions"
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
  readonly fontOptions = [
    { value: 'public-sans', label: 'Public Sans' },
    { value: 'inter', label: 'Inter' },
    { value: 'system', label: 'System UI' },
  ];
  readonly fontStack = computed(() => LAB_FONT_STACKS[this.data.font()]);
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
    if (value === 'public-sans' || value === 'inter' || value === 'system')
      this.data.setFont(value);
  }

  setShadowIntensity(value: number): void {
    if ([0, 25, 50, 75, 100].includes(value)) {
      this.data.setShadowIntensity(String(value / 100) as LabShadowIntensity);
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
  selector: 'lab-shell',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [OrbitButtonComponent, OrbitSidebarComponent, OrbitTextInputComponent, ReactiveFormsModule, RouterOutlet],
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
    '[attr.data-orbit-motion]': 'motionEnabled() ? "on" : "off"',
  },
})
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
  readonly searchControl = new FormControl('', { nonNullable: true });
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
