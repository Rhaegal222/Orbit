import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

@Component({
  selector: 'orbit-progress-bar',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './progress-bar.component.html',
  styleUrl: './progress-bar.component.css',
})
export class OrbitProgressBarComponent {
  /** 0-100; `undefined` (or a non-finite number) renders an indeterminate bar. */
  value = input<number | undefined>(undefined);
  ariaLabel = input<string | undefined>(undefined);

  /** Clamped to [0, 100]; `undefined` when the raw value is absent or not finite. */
  readonly clampedValue = computed<number | undefined>(() => {
    const raw = this.value();
    if (raw === undefined || !Number.isFinite(raw)) {
      return undefined;
    }
    return Math.min(100, Math.max(0, raw));
  });

  readonly isIndeterminate = computed(() => this.clampedValue() === undefined);
}
