import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { TitleCasePipe } from '@angular/common';
import {
  OrbitButtonComponent,
  OrbitIconButtonComponent,
  OrbitSelectComponent,
  OrbitTextInputComponent,
  OrbitSidebarComponent,
  OrbitSidebarBrandLogoDirective,
  OrbitSidebarBrandIconDirective,
  OrbitPillSwitchComponent,
  OrbitSwitchComponent,
  type OrbitSidebarSection,
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
    OrbitSelectComponent,
    OrbitTextInputComponent,
    OrbitSidebarComponent,
    OrbitSidebarBrandLogoDirective,
    OrbitSidebarBrandIconDirective,
    OrbitPillSwitchComponent,
    OrbitSwitchComponent,
    ReactiveFormsModule,
    FormsModule,
    TitleCasePipe,
  ],
  templateUrl: './app.html',
  styleUrl: './app.css',
  host: {
    '[attr.data-orbit-theme]': 'theme() === "dark" ? "dark" : null',
    '[attr.data-orbit-density]': 'density()',
  },
})
export class App {
  // Theme & Layout Settings
  readonly theme = signal<'light' | 'dark'>('dark');
  readonly density = signal<'spacious' | 'comfortable' | 'compact' | 'dense'>('comfortable');
  readonly sidebarCollapsed = signal(false);

  // Form Controls
  readonly searchControl = new FormControl('');
  readonly nameControl = new FormControl('');
  readonly billingPeriod = new FormControl<'monthly' | 'yearly'>('monthly');
  readonly roleControl = new FormControl('developer');

  // Dropdown options
  readonly roleOptions: OrbitSelectOption[] = [
    { value: 'developer', label: 'Developer' },
    { value: 'designer', label: 'Designer' },
    { value: 'manager', label: 'Product Manager' },
    { value: 'guest', label: 'Guest' },
  ];

  // Pill Switch Options
  readonly billingOptions: OrbitPillSwitchOption[] = [
    { value: 'monthly', label: 'Mensile' },
    { value: 'yearly', label: 'Annuale' },
    { value: 'custom', label: 'Custom Plan', disabled: true },
  ];

  // Sidebar Sections
  readonly sidebarSections = signal<readonly OrbitSidebarSection[]>([
    {
      id: 'general',
      label: 'Generale',
      items: [
        { id: 'dashboard', label: 'Dashboard', icon: 'home' },
        { id: 'components', label: 'Componenti', icon: 'settings' },
        { id: 'analytics', label: 'Analitiche', icon: 'chevron-down' },
      ],
    },
    {
      id: 'account',
      label: 'Account',
      items: [
        { id: 'profile', label: 'Profilo Utente', icon: 'user' },
        { id: 'billing', label: 'Fatturazione', icon: 'lock' },
      ],
    },
  ]);

  readonly activeSection = signal('dashboard');

  onSidebarItemSelected(item: any): void {
    this.activeSection.set(item.id);
  }

  onSidebarCollapsedChange(collapsed: boolean): void {
    this.sidebarCollapsed.set(collapsed);
  }

  toggleTheme(): void {
    this.theme.update((t) => (t === 'dark' ? 'light' : 'dark'));
  }

  setDensity(d: 'spacious' | 'comfortable' | 'compact' | 'dense'): void {
    this.density.set(d);
  }
}
