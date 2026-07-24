import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';

export interface OrbitNavbarItem {
  id: string;
  label: string;
  href?: string;
  disabled?: boolean;
}

export type OrbitNavbarTone = 'default' | 'dark' | 'primary' | 'transparent';
export type OrbitNavbarSize = 'sm' | 'md' | 'lg';
export type OrbitNavbarVariant = 'filled' | 'underline' | 'pills';
export type OrbitNavbarLayout = 'default' | 'center';

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
  rightItems = input<readonly OrbitNavbarItem[]>([]);
  activeId = input<string | null>(null);
  tone = input<OrbitNavbarTone>('default');
  size = input<OrbitNavbarSize>('md');
  variant = input<OrbitNavbarVariant>('filled');
  layout = input<OrbitNavbarLayout>('default');

  itemSelected = output<OrbitNavbarItem>();

  protected readonly hostClasses = computed(() => {
    const classes = ['orbit-navbar'];
    if (this.tone() === 'dark') classes.push('orbit-navbar--dark');
    if (this.tone() === 'primary') classes.push('orbit-navbar--primary');
    if (this.tone() === 'transparent') classes.push('orbit-navbar--transparent');
    if (this.size() === 'sm') classes.push('orbit-navbar--sm');
    if (this.size() === 'lg') classes.push('orbit-navbar--lg');
    if (this.variant() === 'underline') classes.push('orbit-navbar--underline');
    if (this.variant() === 'pills') classes.push('orbit-navbar--pills');
    if (this.layout() === 'center') classes.push('orbit-navbar--center');
    return classes.join(' ');
  });

  selectItem(item: OrbitNavbarItem, event: Event): void {
    if (item.disabled) {
      event.preventDefault();
      return;
    }

    this.itemSelected.emit(item);
  }
}
