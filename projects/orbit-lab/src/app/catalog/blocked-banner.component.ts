import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'lab-blocked-banner',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div data-blocked-banner role="note">
      <strong>Bloccato su token Core</strong>
      <p>
        Questo componente referenzia in <code>{{ file() }}</code> token non presenti nel contratto
        semantico attuale. Non può essere dichiarato verificato finché Orbit Core non completa la
        Fase 0 di stabilizzazione.
      </p>
      <ul>
        @for (token of tokens(); track token) {
          <li data-blocked-token>{{ token }}</li>
        }
      </ul>
    </div>
  `,
})
export class LabBlockedBannerComponent {
  file = input.required<string>();
  tokens = input.required<string[]>();
}
