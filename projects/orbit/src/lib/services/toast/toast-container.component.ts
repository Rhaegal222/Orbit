import { ChangeDetectionStrategy, Component, ViewContainerRef, viewChild } from '@angular/core';

/**
 * Internal-only host attached once per position overlay. Provides a
 * `ViewContainerRef` anchor so `OrbitToastService` can create/destroy any
 * number of `OrbitToastComponent` instances inside a single CDK overlay,
 * which only ever supports a single top-level portal attachment.
 */
@Component({
  selector: 'orbit-toast-container',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ng-container #outlet></ng-container>`,
  styles: [
    `
      :host {
        display: flex;
        flex-direction: column;
        gap: var(--orbit-space-1);
      }
    `,
  ],
})
export class OrbitToastContainerComponent {
  readonly outlet = viewChild.required('outlet', { read: ViewContainerRef });
}
