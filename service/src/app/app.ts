import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  OrbitButtonComponent,
  OrbitIconButtonComponent,
  OrbitBadgeComponent,
  OrbitSwitchComponent,
  OrbitPillSwitchComponent,
  OrbitNavbarComponent,
  OrbitTabComponent,
  OrbitTablistComponent,
  OrbitTabPanelComponent,
  OrbitCodeBlockComponent,
  OrbitDividerComponent,
  OrbitTextInputComponent,
  OrbitSelectComponent,
  OrbitSpinnerComponent,
  type OrbitNavbarItem,
  type OrbitPillSwitchOption,
  type OrbitSelectOption,
} from '@galileo/orbit';

@Component({
  selector: 'app-root',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    OrbitButtonComponent,
    OrbitIconButtonComponent,
    OrbitBadgeComponent,
    OrbitSwitchComponent,
    OrbitPillSwitchComponent,
    OrbitNavbarComponent,
    OrbitTabComponent,
    OrbitTablistComponent,
    OrbitTabPanelComponent,
    OrbitCodeBlockComponent,
    OrbitDividerComponent,
    OrbitTextInputComponent,
    OrbitSelectComponent,
    OrbitSpinnerComponent,
    ReactiveFormsModule,
    FormsModule,
  ],
  templateUrl: './app.html',
  styleUrl: './app.css',
  host: {
    '[attr.data-orbit-theme]': 'theme() === "dark" ? "dark" : null',
    '[attr.data-orbit-density]': 'density()',
  },
})
export class App {
  readonly theme = signal<'light' | 'dark'>('dark');
  readonly density = signal<'spacious' | 'comfortable' | 'compact' | 'dense'>('comfortable');
  readonly activeShowcaseTab = signal('buttons');

  readonly searchControl = new FormControl('');
  readonly nameControl = new FormControl('');
  readonly roleControl = new FormControl('developer');

  readonly navItems: OrbitNavbarItem[] = [
    { id: 'features', label: 'Features', href: '#features' },
    { id: 'showcase', label: 'Showcase', href: '#showcase' },
    { id: 'theming', label: 'Theming', href: '#theming' },
    { id: 'install', label: 'Install', href: '#install' },
  ];

  readonly densityOptions: OrbitPillSwitchOption[] = [
    { value: 'spacious', label: 'Spacious' },
    { value: 'comfortable', label: 'Comfortable' },
    { value: 'compact', label: 'Compact' },
    { value: 'dense', label: 'Dense' },
  ];

  readonly roleOptions: OrbitSelectOption[] = [
    { value: 'developer', label: 'Developer' },
    { value: 'designer', label: 'Designer' },
    { value: 'manager', label: 'Product Manager' },
  ];

  readonly installCode = `npm install @galileo/orbit`;

  readonly importCode = `import {
  OrbitButtonComponent,
  OrbitBadgeComponent,
  OrbitTextInputComponent,
} from '@galileo/orbit';`;

  readonly themeCode = `<!-- Dark theme (default) -->
<app-root data-orbit-theme="dark">

<!-- Light theme -->
<app-root data-orbit-theme="light">

<!-- Accent swatches -->
<app-root data-orbit-accent="violet">
<app-root data-orbit-accent="teal">`;

  toggleTheme(): void {
    this.theme.update((t) => (t === 'dark' ? 'light' : 'dark'));
  }

  onShowcaseTabChange(value: string): void {
    this.activeShowcaseTab.set(value);
  }

  onDensityChange(value: string): void {
    if (value === 'spacious' || value === 'comfortable' || value === 'compact' || value === 'dense') {
      this.density.set(value);
    }
  }
}
