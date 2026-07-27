import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import {
  OrbitAlertComponent,
  OrbitBadgeComponent,
  OrbitBannerComponent,
  OrbitButtonComponent,
  OrbitCodeBlockComponent,
  OrbitNavbarComponent,
  OrbitPanelComponent,
  OrbitSkeletonComponent,
  OrbitSpinnerComponent,
  OrbitTabComponent,
  OrbitTablistComponent,
  type OrbitNavbarItem,
} from '@rhaegal222/orbit';

@Component({
  selector: 'app-root',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    OrbitAlertComponent,
    OrbitBadgeComponent,
    OrbitBannerComponent,
    OrbitButtonComponent,
    OrbitCodeBlockComponent,
    OrbitNavbarComponent,
    OrbitPanelComponent,
    OrbitSkeletonComponent,
    OrbitSpinnerComponent,
    OrbitTabComponent,
    OrbitTablistComponent,
  ],
  templateUrl: './app.html',
  styleUrl: './app.css',
  host: { '[attr.data-orbit-density]': 'density()' },
})
export class App {
  readonly density = signal<'comfortable' | 'compact'>('comfortable');
  readonly navItems: OrbitNavbarItem[] = [
    { id: 'architecture', label: 'Architettura', href: '#architecture' },
    { id: 'tokens', label: 'Token', href: '#tokens' },
    { id: 'catalog', label: 'Catalogo', href: '#catalog' },
    { id: 'install', label: 'Installazione', href: '#install' },
  ];
  readonly installCode = 'npm install @rhaegal222/orbit';
  readonly importCode = `import { OrbitButtonComponent } from "@rhaegal222/orbit";`;
  readonly themeCode = `:root {\n  --orbit-action-primary-bg: #0f766e;\n  --orbit-radius-control: 0.5rem;\n}`;
}
