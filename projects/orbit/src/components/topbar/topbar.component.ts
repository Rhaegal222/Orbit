import { ChangeDetectionStrategy, Component, input } from '@angular/core';

/**
 * Application chrome for compact headers.
 *
 * The component deliberately owns only the structural surface: consumers project
 * Orbit controls into the start, centre and end slots. Navigation, user state and
 * responsive visibility remain application concerns.
 */
@Component({
  selector: 'orbit-topbar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[attr.aria-label]': 'ariaLabel() || null',
  },
  template: `
    <header class="orbit-topbar">
      <div class="orbit-topbar__start"><ng-content select="[orbitTopbarStart]" /></div>
      <div class="orbit-topbar__center"><ng-content select="[orbitTopbarCenter]" /></div>
      <div class="orbit-topbar__end"><ng-content select="[orbitTopbarEnd]" /></div>
    </header>
  `,
  styles: `
    :host { display: block; }
    .orbit-topbar {
      display: grid;
      grid-template-columns: minmax(0, 1fr) auto minmax(0, 1fr);
      align-items: center;
      min-height: var(--orbit-topbar-height);
      padding: var(--orbit-topbar-padding-block) var(--orbit-topbar-padding-inline);
      border-bottom: 1px solid var(--orbit-topbar-border);
      background: var(--orbit-topbar-bg);
      color: var(--orbit-topbar-fg);
      font-family: var(--orbit-font-sans);
    }
    .orbit-topbar__start,
    .orbit-topbar__center,
    .orbit-topbar__end {
      display: flex;
      align-items: center;
      gap: var(--orbit-topbar-gap);
      min-width: 0;
    }
    .orbit-topbar__start { justify-content: flex-start; }
    .orbit-topbar__center { justify-content: center; }
    .orbit-topbar__end { justify-content: flex-end; }
  `,
})
export class OrbitTopbarComponent {
  /** Accessible label for the application header landmark. */
  readonly ariaLabel = input('Barra superiore applicazione');
}
