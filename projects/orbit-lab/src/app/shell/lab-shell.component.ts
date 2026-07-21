import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { CATALOG_ENTRIES } from '../catalog/catalog';

type LabTheme = 'default' | 'dark';
type LabDensity = 'comfortable' | 'compact';

@Component({
  selector: 'lab-shell',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, RouterLinkActive, RouterOutlet],
  templateUrl: './lab-shell.component.html',
  styleUrl: './lab-shell.component.css',
})
export class LabShellComponent {
  protected readonly entries = CATALOG_ENTRIES;
  protected readonly theme = signal<LabTheme>('default');
  protected readonly density = signal<LabDensity>('comfortable');

  setTheme(theme: LabTheme): void {
    this.theme.set(theme);
  }

  setDensity(density: LabDensity): void {
    this.density.set(density);
  }
}
