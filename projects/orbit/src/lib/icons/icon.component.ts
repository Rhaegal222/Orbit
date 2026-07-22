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
      :host { display: inline-flex; font-size: 1em; line-height: 1; }
      svg { width: 1em; height: 1em; }
    `,
  ],
})
export class OrbitIconComponent {
  name = input.required<OrbitIconName>();
  scaleSensitive = input(false, { transform: booleanAttribute });
  textScale = input(1, { transform: numberAttribute });

  protected readonly paths = computed(() => ORBIT_ICON_PATHS[this.name()]);
  protected readonly hidden = computed(() => this.scaleSensitive() && this.textScale() > 1.2);
}
