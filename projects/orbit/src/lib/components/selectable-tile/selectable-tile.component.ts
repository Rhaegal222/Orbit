import { booleanAttribute, ChangeDetectionStrategy, Component, input, output } from '@angular/core';

@Component({
  selector: 'orbit-selectable-tile',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './selectable-tile.component.html',
  styleUrl: './selectable-tile.component.css',
})
export class OrbitSelectableTileComponent {
  label = input.required<string>();
  description = input('');
  selected = input(false, { transform: booleanAttribute });
  disabled = input(false, { transform: booleanAttribute });
  selectedChange = output<boolean>();

  toggle(): void {
    if (!this.disabled()) this.selectedChange.emit(!this.selected());
  }
}
