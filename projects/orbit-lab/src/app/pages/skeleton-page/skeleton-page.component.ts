import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { OrbitSkeletonComponent } from '@galileo/orbit';
import { LabExampleComponent } from '../../catalog/example-panel.component';

interface SkeletonDemoCard {
  id: number;
  title: string;
  body: string;
}

/** How long the simulated-loading example keeps showing skeletons before revealing real content. */
const SIMULATED_LOAD_DELAY_MS = 1800;

@Component({
  selector: 'lab-skeleton-page',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [OrbitSkeletonComponent, LabExampleComponent],
  templateUrl: './skeleton-page.component.html',
  styleUrl: './skeleton-page.component.css',
})
export class SkeletonPageComponent {
  protected readonly textSnippet = '<orbit-skeleton shape="text" width="70%" />';
  protected readonly circleSnippet = '<orbit-skeleton shape="circle" width="3rem" />';
  protected readonly rectSnippet = '<orbit-skeleton shape="rect" width="100%" height="8rem" />';
  protected readonly loadingSnippet =
    '@if (cardsLoading()) {\n' +
    '  <orbit-skeleton shape="text" width="60%" />\n' +
    '  <orbit-skeleton shape="rect" width="100%" height="4rem" />\n' +
    '} @else {\n' +
    '  <h3>{{ card.title }}</h3>\n' +
    '  <p>{{ card.body }}</p>\n' +
    '}';

  protected readonly cardsLoading = signal(true);
  protected readonly cards: readonly SkeletonDemoCard[] = [
    { id: 1, title: 'Rilascio v2.4', body: 'Nuove funzionalità per la gestione degli allegati.' },
    {
      id: 2,
      title: 'Manutenzione pianificata',
      body: 'Finestra di manutenzione sabato dalle 02:00 alle 04:00.',
    },
    {
      id: 3,
      title: 'Nuovo componente',
      body: 'Lo skeleton loader è ora disponibile nel design system.',
    },
  ];

  constructor() {
    // Simulates an async fetch: swaps the placeholder cards for real content
    // once, after a fixed delay, so the catalog page demonstrates the
    // typical `@if (loading()) { skeleton } @else { content }` transition.
    setTimeout(() => this.cardsLoading.set(false), SIMULATED_LOAD_DELAY_MS);
  }
}
