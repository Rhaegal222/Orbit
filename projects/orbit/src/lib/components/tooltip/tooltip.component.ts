import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'orbit-tooltip',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<span [attr.id]="id" class="orbit-tooltip">{{ text }}</span>`,
  styles: [
    `
      :host { display: block; }
      .orbit-tooltip {
        display: block;
        padding: var(--orbit-space-2) var(--orbit-space-3);
        border-radius: var(--orbit-radius-control);
        background: var(--orbit-color-surface-inverse);
        color: var(--orbit-color-text-inverse);
        font-family: var(--orbit-font-sans);
        font-size: var(--orbit-font-size-xs);
        line-height: 1.4;
        white-space: nowrap;
        box-shadow: var(--orbit-shadow-overlay);
        pointer-events: none;
      }
    `,
  ],
  host: {
    '[class.orbit-tooltip-panel]': 'true',
  },
})
export class TooltipComponent {
  text = '';
  id = '';
}
