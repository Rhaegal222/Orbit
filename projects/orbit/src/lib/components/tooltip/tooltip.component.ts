import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'orbit-tooltip',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<span [attr.id]="id" class="orbit-tooltip">{{ text }}</span>`,
  styles: [
    `
      :host {
        display: block;
      }
      .orbit-tooltip {
        display: block;
        padding: var(--orbit-space-2) var(--orbit-space-3);
        border-radius: var(--orbit-radius-control);
        background: var(--orbit-text-primary);
        color: var(--orbit-text-inverse);
        font-family: var(--orbit-font-sans);
        font-size: var(--orbit-font-size-xs);
        line-height: 1.4;
        white-space: nowrap;
        box-shadow: var(--orbit-shadow-overlay);
        pointer-events: none;
        will-change: opacity, transform;
        animation: orbit-tooltip-enter var(--orbit-motion-fast) var(--orbit-easing-standard);
      }

      @keyframes orbit-tooltip-enter {
        from {
          opacity: 0;
          transform: translate3d(0, var(--orbit-space-1), 0);
        }
        to {
          opacity: 1;
          transform: translate3d(0, 0, 0);
        }
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
