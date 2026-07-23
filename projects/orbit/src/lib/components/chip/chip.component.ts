import { booleanAttribute, ChangeDetectionStrategy, Component, inject, input, output } from '@angular/core';
import { OrbitIconComponent } from '../../icons/icon.component';
import { ORBIT_I18N } from '../../i18n/orbit-i18n';

@Component({
  selector: 'orbit-chip',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [OrbitIconComponent],
  templateUrl: './chip.component.html',
  styleUrl: './chip.component.css',
})
export class OrbitChipComponent {
  protected readonly i18n = inject(ORBIT_I18N);

  selected = input(false, { transform: booleanAttribute });
  removable = input(false, { transform: booleanAttribute });
  disabled = input(false, { transform: booleanAttribute });

  selectedChange = output<boolean>();
  removed = output<void>();

  toggle(): void {
    if (this.disabled()) return;
    this.selectedChange.emit(!this.selected());
  }

  remove(event: Event): void {
    event.stopPropagation();
    if (this.disabled()) return;
    this.removed.emit();
  }
}
