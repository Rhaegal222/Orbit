import { Directive, HostBinding, input } from '@angular/core';
export type OrbitDataAlign = 'start' | 'center' | 'end';
@Directive({ selector: '[orbitDataAlign]', standalone: true })
export class OrbitDataAlignDirective {
  orbitDataAlign = input<OrbitDataAlign>('start');
  @HostBinding('style.text-align') get textAlign(): string {
    return this.orbitDataAlign() === 'start' ? 'start' : this.orbitDataAlign();
  }
}
