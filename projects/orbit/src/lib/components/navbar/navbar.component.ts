import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

export interface OrbitNavbarItem {
  id: string;
  label: string;
  href?: string;
  disabled?: boolean;
}

@Component({
  selector: 'orbit-navbar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class OrbitNavbarComponent {
  brand = input('');
  ariaLabel = input('Navigazione principale');
  items = input<readonly OrbitNavbarItem[]>([]);
  activeId = input<string | null>(null);

  itemSelected = output<OrbitNavbarItem>();

  selectItem(item: OrbitNavbarItem, event: Event): void {
    if (item.disabled) {
      event.preventDefault();
      return;
    }

    this.itemSelected.emit(item);
  }
}
