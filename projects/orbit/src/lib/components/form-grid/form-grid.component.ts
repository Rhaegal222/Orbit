import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'orbit-form-grid',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './form-grid.component.html',
  styleUrl: './form-grid.component.css',
  host: {
    '[class.orbit-form-grid--compact]': "density() === 'compact'",
  },
})
export class OrbitFormGridComponent {
  /** Overrides density for this grid without changing the surrounding form. */
  density = input<'inherit' | 'comfortable' | 'compact'>('inherit');
}
