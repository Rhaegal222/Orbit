import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  numberAttribute,
} from '@angular/core';
import { ORBIT_ICON_PATHS, OrbitIconName } from './icon-registry';

@Component({
  selector: 'orbit-icon',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './icon.component.html',
  styles: [
    `
      :host {
        display: inline-flex;
        font-size: 1em;
        line-height: 1;
      }
      svg {
        width: var(--orbit-icon-size);
        height: var(--orbit-icon-size);
      }
    `,
  ],
})
export class OrbitIconComponent {
  name = input.required<OrbitIconName>();
  size = input<16 | 20 | 24>(20);
  label = input<string | null>(null);
  decorative = input(true, { transform: booleanAttribute });

  /** @deprecated Prefer `size`; retained temporarily for scale-aware layouts. */
  scaleSensitive = input(false, { transform: booleanAttribute });
  /** @deprecated Prefer text that remains available at every text scale. */
  textScale = input(1, { transform: numberAttribute });

  protected readonly paths = computed(() => ORBIT_ICON_PATHS[this.name()]);
  protected readonly hidden = computed(() => this.scaleSensitive() && this.textScale() > 1.2);
  protected readonly sizeInRem = computed(() => `${this.size() / 16}rem`);
}
