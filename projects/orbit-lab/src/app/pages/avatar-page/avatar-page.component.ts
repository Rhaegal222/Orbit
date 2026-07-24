import { ChangeDetectionStrategy, Component } from '@angular/core';
import { OrbitAvatarComponent } from '@galileo/orbit';
import { LabExampleComponent } from '../../catalog/example-panel.component';

@Component({
  selector: 'lab-avatar-page',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [OrbitAvatarComponent, LabExampleComponent],
  templateUrl: './avatar-page.component.html',
})
export class AvatarPageComponent {
  protected readonly usageSnippet =
    '<orbit-avatar name="Mario Rossi" src="https://example.test/avatar.png" />';

  protected readonly initialsSnippet = '<orbit-avatar name="Mario Rossi" />';

  protected readonly sizesSnippet =
    '<orbit-avatar name="Mario Rossi" size="sm" />\n<orbit-avatar name="Mario Rossi" size="md" />\n<orbit-avatar name="Mario Rossi" size="lg" />';

  protected readonly loadingSnippet =
    '<orbit-avatar name="Mario Rossi" [loading]="true" size="sm" />\n<orbit-avatar name="Mario Rossi" [loading]="true" size="md" />\n<orbit-avatar name="Mario Rossi" [loading]="true" size="lg" />';
}
