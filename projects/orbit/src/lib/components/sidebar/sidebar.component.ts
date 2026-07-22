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
  embedded = input(false, { transform: booleanAttribute });
  readonly toggleVisible = signal(false);
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
    const distanceFromEdge = bounds.right - event.clientX;
    if (distanceFromEdge > 2 * 16) {
      this.toggleVisible.set(false);
      return;
    }

    const offset = event.clientY - bounds.top;
    this.toggleTop.set(Math.max(24, Math.min(offset, bounds.height - 24)));
    this.toggleVisible.set(true);
  }

  onPointerLeave(): void {
    this.toggleVisible.set(false);
  }

  displayBadge(badge: string | number | undefined): string {
    if (typeof badge !== 'number') return badge ?? '';
    return badge > 99 ? '99+' : String(badge);
  }
}
