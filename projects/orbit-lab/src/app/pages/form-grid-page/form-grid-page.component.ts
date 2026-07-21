import { ChangeDetectionStrategy, Component } from '@angular/core';
import { OrbitFormGridComponent } from '@galileo/orbit';
import { LabExampleComponent } from '../../catalog/example-panel.component';

@Component({
  selector: 'lab-form-grid-page',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [OrbitFormGridComponent, LabExampleComponent],
  templateUrl: './form-grid-page.component.html',
})
export class FormGridPageComponent {
  protected readonly usageSnippet =
    '<orbit-form-grid>\n  <div primary>...</div>\n  <div secondary>...</div>\n</orbit-form-grid>';
}
