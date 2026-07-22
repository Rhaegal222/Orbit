import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import { OrbitIconComponent } from '../../icons/icon.component';
import type { OrbitIconName } from '../../icons/icon-registry';
import { ORBIT_I18N } from '../../i18n/orbit-i18n';
import { formatOrbitSidebarBadge } from './sidebar-navigation.util';

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
  imports: [OrbitIconComponent],
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
  readonly toggleTop = signal(50);
  itemSelected = output<OrbitSidebarItem>();
  collapsedChange = output<boolean>();

  selectItem(item: OrbitSidebarItem): void {
    if (!item.disabled) this.itemSelected.emit(item);
  }

  toggle(): void {
    this.collapsedChange.emit(!this.collapsed());
  }

  onPointerMove(event: PointerEvent): void {
    const sidebar = event.currentTarget as HTMLElement;
    const bounds = sidebar.getBoundingClientRect();
    const offset = ((event.clientY - bounds.top) / bounds.height) * 100;

    this.toggleTop.set(Math.max(5, Math.min(offset, 95)));
  }

  displayBadge(badge: string | number | undefined): string {
    return formatOrbitSidebarBadge(badge);
  }
}
