import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  numberAttribute,
  output,
  signal,
  contentChild,
  computed,
  ElementRef,
  Directive,
} from '@angular/core';
import { OrbitIconComponent } from '../../icons/icon.component';
import type { OrbitIconName } from '../../icons/icon-registry';
import { ORBIT_I18N } from '../../i18n/orbit-i18n';
import { OrbitIconButtonComponent } from '../icon-button/icon-button.component';
import { formatOrbitSidebarBadge } from './sidebar-navigation.util';

@Directive({
  selector: '[orbitSidebarBrand]',
  standalone: true,
})
export class OrbitSidebarBrandDirective {}

@Directive({
  selector: '[orbitSidebarBrandLogo]',
  standalone: true,
})
export class OrbitSidebarBrandLogoDirective {}

@Directive({
  selector: '[orbitSidebarBrandIcon]',
  standalone: true,
})
export class OrbitSidebarBrandIconDirective {}

export interface OrbitSidebarItem {
  id: string;
  label: string;
  icon?: OrbitIconName;
  badge?: string | number;
  disabled?: boolean;
}

export interface OrbitSidebarSection {
  id: string;
  label?: string;
  items: readonly OrbitSidebarItem[];
}

@Component({
  selector: 'orbit-sidebar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    OrbitIconComponent,
    OrbitIconButtonComponent,
  ],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css',
  host: {
    '[class.orbit-sidebar-host--collapsed]': 'collapsed()',
  },
})
export class OrbitSidebarComponent {
  readonly i18n = inject(ORBIT_I18N);
  brand = input('');
  brandShort = input('');
  brandIcon = input<OrbitIconName | null>(null);
  /** When true, hides the default brand mark and text, allowing projected brand content. */
  customBrand = input(false, { transform: booleanAttribute });
  ariaLabel = input('');
  sections = input<readonly OrbitSidebarSection[]>([]);
  activeId = input<string | null>(null);
  collapsed = input(false, { transform: booleanAttribute });
  collapsible = input(true, { transform: booleanAttribute });
  /** Shows the brand and projected search chrome above the navigation. */
  showHeader = input(true, { transform: booleanAttribute });
  /** Shows the projected footer chrome below the navigation. */
  showFooter = input(true, { transform: booleanAttribute });
  embedded = input(false, { transform: booleanAttribute });
  /** Symmetric percentage margin that constrains mouse-tracking toggle placement. */
  toggleMargin = input(0, { transform: numberAttribute });
  readonly toggleTop = signal(50);
  itemSelected = output<OrbitSidebarItem>();
  collapsedChange = output<boolean>();
  /** Emitted by the header close action, shown only when `embedded` (e.g. a drawer opened via OrbitPanelService). */
  closed = output<void>();

  customLogo = contentChild(OrbitSidebarBrandLogoDirective, { read: ElementRef });
  customIcon = contentChild(OrbitSidebarBrandIconDirective, { read: ElementRef });
  legacyBrand = contentChild(OrbitSidebarBrandDirective, { read: ElementRef });

  hasCustomIcon = computed(() => !!this.customIcon());

  logoInitial = computed(() => {
    // Try to get text content from custom logo directive
    const logoEl = this.customLogo()?.nativeElement;
    if (logoEl && logoEl.textContent) {
      const text = logoEl.textContent.trim();
      if (text) return text.charAt(0).toUpperCase();
    }
    // Try legacy brand
    const legacyEl = this.legacyBrand()?.nativeElement;
    if (legacyEl && legacyEl.textContent) {
      const text = legacyEl.textContent.trim();
      if (text) return text.charAt(0).toUpperCase();
    }
    // Fallback to brand() input
    const brandName = this.brand();
    if (brandName) return brandName.charAt(0).toUpperCase();
    return '';
  });

  selectItem(item: OrbitSidebarItem): void {
    if (!item.disabled) this.itemSelected.emit(item);
  }

  close(): void {
    this.closed.emit();
  }

  toggle(): void {
    this.collapsedChange.emit(!this.collapsed());
  }

  onPointerMove(event: PointerEvent): void {
    const sidebar = event.currentTarget as HTMLElement;
    const bounds = sidebar.getBoundingClientRect();
    const offset = ((event.clientY - bounds.top) / bounds.height) * 100;
    const margin = Math.min(50, Math.max(0, this.toggleMargin()));

    this.toggleTop.set(Math.max(margin, Math.min(offset, 100 - margin)));
  }

  displayBadge(badge: string | number | undefined): string {
    return formatOrbitSidebarBadge(badge);
  }
}
