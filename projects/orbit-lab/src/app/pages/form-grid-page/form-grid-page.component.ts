import { ChangeDetectionStrategy, Component } from '@angular/core';
import {
  OrbitFormFieldComponent,
  OrbitFormGridComponent,
  OrbitFormGridItemDirective,
  OrbitTextInputComponent,
} from '@galileo/orbit';
import { LabExampleComponent } from '../../catalog/example-panel.component';

@Component({
  selector: 'lab-form-grid-page',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    OrbitFormGridComponent,
    OrbitFormGridItemDirective,
    OrbitFormFieldComponent,
    OrbitTextInputComponent,
    LabExampleComponent,
  ],
  templateUrl: './form-grid-page.component.html',
})
export class FormGridPageComponent {
  protected readonly usageSnippet =
    '<orbit-form-grid>\n  <div primary>...</div>\n  <div secondary>...</div>\n</orbit-form-grid>';
  protected readonly spansSnippet =
    '<orbit-form-grid>\n  <div orbitFormGridItem [span]="12" [spanMd]="6">…</div>\n  <div orbitFormGridItem [span]="12" [spanMd]="6">…</div>\n</orbit-form-grid>';
}
