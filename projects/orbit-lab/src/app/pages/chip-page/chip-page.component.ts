import { ChangeDetectionStrategy, Component } from '@angular/core';
import { OrbitChipComponent } from '@galileo/orbit';
import { LabExampleComponent } from '../../components/example-panel/example-panel.component';

interface ChipDemoTag {
  id: string;
  label: string;
}

@Component({
  selector: 'lab-chip-page',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [OrbitChipComponent, LabExampleComponent],
  templateUrl: './chip-page.component.html',
})
export class ChipPageComponent {
  selected = false;
  protected removableTags: ChipDemoTag[] = [
    { id: 'ui', label: 'UI' },
    { id: 'ux', label: 'UX' },
    { id: 'a11y', label: 'Accessibilità' },
  ];

  protected readonly usageSnippet =
    '<orbit-chip [selected]="selected" (selectedChange)="selected = $event">Frontend</orbit-chip>';

  protected readonly removableSnippet =
    '<orbit-chip removable (removed)="removeTag(tag)">{{ tag.label }}</orbit-chip>';

  protected readonly disabledSnippet = '<orbit-chip disabled removable>Archiviato</orbit-chip>';

  onSelectedChange(value: boolean): void {
    this.selected = value;
  }

  removeTag(tag: ChipDemoTag): void {
    this.removableTags = this.removableTags.filter((t) => t.id !== tag.id);
  }
}
