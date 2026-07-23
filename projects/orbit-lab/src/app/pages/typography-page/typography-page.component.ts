import { ChangeDetectionStrategy, Component } from '@angular/core';
import { LabExampleComponent } from '../../catalog/example-panel.component';

interface TypographyRole {
  readonly name: string;
  readonly token: string;
  readonly usage: string;
  readonly className: string;
  readonly sample: string;
}

@Component({
  selector: 'lab-typography-page',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [LabExampleComponent],
  templateUrl: './typography-page.component.html',
  styleUrl: './typography-page.component.css',
})
export class TypographyPageComponent {
  protected readonly roles: readonly TypographyRole[] = [
    {
      name: 'Display',
      token: '--orbit-font-size-display',
      usage: 'Titolo di pagina o scenario principale.',
      className: 'typography-page__display',
      sample: 'Titolo operativo',
    },
    {
      name: 'Title',
      token: '--orbit-font-size-title',
      usage: 'Titolo di superficie, modale o pannello.',
      className: 'typography-page__title',
      sample: 'Configurazione record',
    },
    {
      name: 'Subtitle',
      token: '--orbit-font-size-subtitle',
      usage: 'Titolo di sezione.',
      className: 'typography-page__subtitle',
      sample: 'Dettagli operativi',
    },
    {
      name: 'Body',
      token: '--orbit-font-size-body',
      usage: 'Navigazione, dati tabellari e contenuto operativo.',
      className: 'typography-page__body',
      sample: 'La modifica viene applicata immediatamente.',
    },
    {
      name: 'Label',
      token: '--orbit-font-size-label',
      usage: 'Etichette di campo, intestazioni tabella e stati persistenti.',
      className: 'typography-page__label',
      sample: 'Salvataggio automatico attivo',
    },
    {
      name: 'Caption',
      token: '--orbit-font-size-caption',
      usage: 'Hint secondari e badge.',
      className: 'typography-page__caption',
      sample: 'Aggiornato pochi istanti fa',
    },
    {
      name: 'Code',
      token: '--orbit-font-size-code',
      usage: 'Codice inline e blocchi sorgente.',
      className: 'typography-page__code',
      sample: '--orbit-text-scale: 1.1;',
    },
  ];

  protected readonly rolesSnippet = `<span class="typography-page__display">Titolo operativo</span> <!-- Display -->
<span class="typography-page__title">Configurazione record</span> <!-- Title -->
<span class="typography-page__subtitle">Dettagli operativi</span> <!-- Subtitle -->
<p class="typography-page__body">La modifica viene applicata immediatamente.</p> <!-- Body -->
<span class="typography-page__label">Salvataggio automatico attivo</span> <!-- Label -->
<span class="typography-page__caption">Aggiornato pochi istanti fa</span> <!-- Caption -->
<code class="typography-page__code">--orbit-text-scale: 1.1;</code> <!-- Code -->`;

  protected readonly scaleSnippet = `/* Applicare sullo shell consumer */
[data-orbit-theme='consumer'] {
  --orbit-font-sans: 'Public Sans', sans-serif;
  --orbit-text-scale: 1.1;
}`;
}
