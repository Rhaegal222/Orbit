import { ChangeDetectionStrategy, Component } from '@angular/core';
import { OrbitBadgeComponent, OrbitBadgeTone } from '@galileo/orbit';
import { LabExampleComponent } from '../../catalog/example-panel.component';

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
  protected readonly usageSnippet = '<orbit-badge label="Attivo" tone="success" />';

  protected toneSnippet(tone: OrbitBadgeTone): string {
    return `<orbit-badge label="${tone}" tone="${tone}" />`;
  }
}
