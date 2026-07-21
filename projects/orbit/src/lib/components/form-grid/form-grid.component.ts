import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'orbit-form-grid',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './form-grid.component.html',
  styleUrl: './form-grid.component.css',
  host: {
    '[class.orbit-form-grid--compact]': "density() === 'compact'",
    '[class.orbit-form-grid--single]': "layout() === 'single'",
    '[class.orbit-form-grid--7-5]': "layout() === '7-5'",
  },
})
export class OrbitFormGridComponent {
  /** Overrides density for this grid without changing the surrounding form. */
  density = input<'inherit' | 'comfortable' | 'compact'>('inherit');
  /** Controls the projected `[primary]` / `[secondary]` composition. */
  layout = input<'auto' | 'single' | '7-5'>('auto');
}
