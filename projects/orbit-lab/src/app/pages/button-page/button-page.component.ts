import { ChangeDetectionStrategy, Component } from '@angular/core';
import { OrbitButtonComponent, OrbitButtonTone, OrbitButtonVariant } from '@galileo/orbit';
import { LabExampleComponent } from '../../catalog/example-panel.component';

@Component({
  selector: 'lab-button-page',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [OrbitButtonComponent, LabExampleComponent],
  templateUrl: './button-page.component.html',
})
export class ButtonPageComponent {
  protected readonly variants: OrbitButtonVariant[] = [
    'solid',
    'soft',
    'translucent',
    'outline',
    'flat',
  ];
  protected readonly tones: OrbitButtonTone[] = ['primary', 'success', 'danger', 'neutral'];
  protected readonly usageSnippet =
    '<orbit-button label="Salva" variant="solid" tone="primary" (clicked)="onSave()" />';

  protected readonly defaultSnippet =
    '<orbit-button label="Default" variant="solid" tone="primary" />';
  protected readonly disabledSnippet =
    '<orbit-button label="Disabilitato" variant="solid" tone="primary" [disabled]="true" />';
  protected readonly loadingSnippet =
    '<orbit-button label="Caricamento" variant="solid" tone="primary" [loading]="true" />';

  protected variantSnippet(variant: OrbitButtonVariant): string {
    return `<orbit-button label="Salva" variant="${variant}" tone="primary" />`;
  }
}
