import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { OrbitButtonComponent, OrbitSelectableTileComponent } from '@galileo/orbit';
import { LabExampleComponent } from '../../catalog/example-panel.component';

@Component({
  selector: 'lab-motion-page',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [OrbitButtonComponent, OrbitSelectableTileComponent, LabExampleComponent],
  templateUrl: './motion-page.component.html',
})
export class MotionPageComponent {
  protected readonly tokens = [
    { name: '--orbit-motion-fast', value: '120ms', usage: 'Hover e stati transitori dei controlli (button, pill-switch, tile).' },
    { name: '--orbit-motion-base', value: '180ms', usage: 'Transizioni più evidenti, riservate a cambi di stato più ampi.' },
    { name: '--orbit-easing-standard', value: 'cubic-bezier(0.2, 0, 0, 1)', usage: 'Curva di accelerazione condivisa per tutte le transizioni e animazioni Orbit.' },
  ] as const;

  protected readonly tileSelected = signal(false);

  protected readonly buttonSnippet = '<orbit-button variant="solid" label="Passa il mouse" />';
  protected readonly tileSnippet =
    '<orbit-selectable-tile label="Seleziona" [selected]="selected" (selectedChange)="selected = $event" />';

  toggleTile(): void {
    this.tileSelected.update((v) => !v);
  }
}
