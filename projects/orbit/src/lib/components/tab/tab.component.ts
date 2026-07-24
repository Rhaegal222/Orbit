import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  contentChild,
  ElementRef,
  inject,
  input,
} from '@angular/core';
import { OrbitBadgeComponent } from '../badge/badge.component';

@Component({
  selector: 'orbit-tab',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './tab.component.html',
  styleUrl: './tab.component.css',
  host: {
    role: 'tab',
    '[id]': '"orbit-tab-" + value()',
    '[attr.aria-selected]': 'selected()',
    '[attr.aria-controls]': '"orbit-tab-panel-" + value()',
    '[attr.aria-disabled]': 'disabled() || null',
    '[attr.tabindex]': 'selected() && !disabled() ? 0 : -1',
    '[class.orbit-tab--selected]': 'selected()',
    '[class.orbit-tab--disabled]': 'disabled()',
  },
})
export class OrbitTabComponent {
  value = input.required<string>();
  label = input('');
  disabled = input(false, { transform: booleanAttribute });
  selected = input(false, { transform: booleanAttribute });

  private readonly hostElement = inject(ElementRef<HTMLElement>);

  badge = contentChild(OrbitBadgeComponent);

  focus(): void {
    this.hostElement.nativeElement.focus();
  }
}
