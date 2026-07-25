import { ChangeDetectionStrategy, Component } from '@angular/core';
import { OrbitBadgeComponent, OrbitBadgeTone } from '@galileo/orbit';
import { LabExampleComponent } from '../../components/example-panel/example-panel.component';

@Component({
  selector: 'lab-badge-page',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [OrbitBadgeComponent, LabExampleComponent],
  templateUrl: './badge-page.component.html',
})
export class BadgePageComponent {
  protected readonly tones: OrbitBadgeTone[] = [
    'primary',
    'success',
    'danger',
    'warning',
    'info',
    'neutral',
  ];
  protected readonly labels: Record<OrbitBadgeTone, string> = {
    primary: 'In corso',
    success: 'Attivo',
    danger: 'Errore',
    warning: 'Da verificare',
    info: 'Informazione',
    neutral: 'Bozza',
  };
  protected readonly usageSnippet = '<orbit-badge label="Attivo" tone="success" />';

  protected toneSnippet(tone: OrbitBadgeTone): string {
    return `<orbit-badge label="${this.labels[tone]}" tone="${tone}" />`;
  }
}
