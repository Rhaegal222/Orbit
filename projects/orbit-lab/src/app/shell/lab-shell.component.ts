import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { CATALOG_ENTRIES } from '../catalog/catalog';

type LabTheme = 'default' | 'dark';
type LabDensity = 'comfortable' | 'compact';
type LabTextScale = '0.85' | '1' | '1.1' | '1.25' | '1.5';
type LabFont = 'public-sans' | 'inter' | 'system';

const LAB_FONT_STACKS: Record<LabFont, string> = {
  'public-sans': "'Public Sans', Inter, ui-sans-serif, system-ui, sans-serif",
  inter: 'Inter, ui-sans-serif, system-ui, sans-serif',
  system: "ui-sans-serif, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
};

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
    '[style.--orbit-optional-icon-display]': "textScale() === '1.25' || textScale() === '1.5' ? 'none' : 'grid'",
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
