import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
  type WritableSignal,
} from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import {
  OrbitButtonComponent,
  OrbitModalBodyComponent,
  OrbitModalFooterComponent,
  OrbitModalHeaderComponent,
  ORBIT_PANEL_DATA,
  OrbitPanelService,
  OrbitPanelSurfaceComponent,
  type OrbitDensity,
} from '@galileo/orbit';
import { CATALOG_ENTRIES } from '../catalog/catalog';

type LabTheme = 'default' | 'dark';
type LabDensity = OrbitDensity;
type LabTextScale = '0.85' | '1' | '1.1' | '1.25' | '1.5';
type LabFont = 'public-sans' | 'inter' | 'system';

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
  setTheme: (theme: LabTheme) => void;
  setDensity: (density: LabDensity) => void;
  setTextScale: (textScale: LabTextScale) => void;
  setFont: (font: LabFont) => void;
}

@Component({
  selector: 'lab-catalog-navigation-panel',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    OrbitButtonComponent,
    OrbitModalBodyComponent,
    OrbitModalFooterComponent,
    OrbitModalHeaderComponent,
    OrbitPanelSurfaceComponent,
    RouterLink,
    RouterLinkActive,
  ],
  template: `<orbit-panel-surface labelledBy="catalog-navigation-title">
    <orbit-modal-header
      title="Catalogo tecnico"
      subtitle="Componenti, varianti e stati"
      titleId="catalog-navigation-title"
      (closeClicked)="close()"
    />
    <orbit-modal-body>
      <nav class="lab-catalog-panel__nav" aria-label="Catalogo Orbit">
        @for (entry of entries; track entry.slug) {
          <a
            data-lab-panel-nav-link
            class="lab-catalog-panel__nav-link"
            [class.lab-catalog-panel__nav-link--blocked]="entry.status !== 'verified'"
            [routerLink]="['/', entry.slug]"
            routerLinkActive="lab-catalog-panel__nav-link--active"
            (click)="close()"
          >
            {{ entry.label }}
          </a>
        }
      </nav>
    </orbit-modal-body>
    <orbit-modal-footer>
      <span orbitModalFooterLeft>Orbit Core</span>
      <span orbitModalFooterRight>
        <orbit-button label="Chiudi" variant="outline" tone="neutral" (clicked)="close()" />
      </span>
    </orbit-modal-footer>
  </orbit-panel-surface>`,
  styleUrl: './catalog-panel.component.css',
})
class LabCatalogNavigationPanelComponent {
  readonly entries = CATALOG_ENTRIES;
  private readonly panel = inject(OrbitPanelService);

  close(): void {
    this.panel.closeAll();
  }
}

@Component({
  selector: 'lab-catalog-options-panel',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    OrbitButtonComponent,
    OrbitModalBodyComponent,
    OrbitModalFooterComponent,
    OrbitModalHeaderComponent,
    OrbitPanelSurfaceComponent,
  ],
  template: `<orbit-panel-surface labelledBy="catalog-options-title">
    <orbit-modal-header
      title="Opzioni catalogo"
      subtitle="Tema, densità, scala e font"
      titleId="catalog-options-title"
      (closeClicked)="close()"
    />
    <orbit-modal-body>
      <div class="lab-catalog-panel__options">
        <label class="lab-catalog-panel__field">
          Tema
          <select [value]="data.theme()" (change)="data.setTheme($any($event.target).value)">
            <option value="default">Default</option>
            <option value="dark">Regressione (dark)</option>
          </select>
        </label>
        <label class="lab-catalog-panel__field">
          Densità
          <select [value]="data.density()" (change)="data.setDensity($any($event.target).value)">
            <option value="spacious">Spaziosa</option>
            <option value="comfortable">Comfortable</option>
            <option value="compact">Compact</option>
            <option value="dense">Densa</option>
          </select>
        </label>
        <label class="lab-catalog-panel__field">
          Scala testo
          <select [value]="data.textScale()" (change)="data.setTextScale($any($event.target).value)">
            <option value="0.85">85%</option>
            <option value="1">100%</option>
            <option value="1.1">110%</option>
            <option value="1.25">125%</option>
            <option value="1.5">150%</option>
          </select>
        </label>
        <label class="lab-catalog-panel__field">
          Font
          <select [value]="data.font()" (change)="data.setFont($any($event.target).value)">
            <option value="public-sans">Public Sans</option>
            <option value="inter">Inter</option>
            <option value="system">System UI</option>
          </select>
        </label>
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
  private readonly panel = inject(OrbitPanelService);

  close(): void {
    this.panel.closeAll();
  }
}

@Component({
  selector: 'lab-shell',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, RouterLinkActive, RouterOutlet],
  templateUrl: './lab-shell.component.html',
  styleUrl: './lab-shell.component.css',
  host: {
    '[attr.data-orbit-text-scale]': 'textScale()',
    '[style.--orbit-text-scale]': 'textScale()',
    '[style.--orbit-optional-icon-display]': 'optionalIconDisplay()',
    '[style.--orbit-font-sans]': 'fontStack()',
  },
})
export class LabShellComponent {
  protected readonly entries = CATALOG_ENTRIES;
  protected readonly theme = signal<LabTheme>('default');
  protected readonly density = signal<LabDensity>('comfortable');
  protected readonly textScale = signal<LabTextScale>('1');
  protected readonly font = signal<LabFont>('public-sans');
  protected readonly fontStack = computed(() => LAB_FONT_STACKS[this.font()]);
  protected readonly optionalIconDisplay = computed(() => (parseFloat(this.textScale()) > 1.2 ? 'none' : 'grid'));

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
}
