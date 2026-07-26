import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import {
  OrbitModalBodyComponent,
  OrbitModalComponent,
  OrbitModalHeaderComponent,
  OrbitSelectableTileComponent,
} from '@galileo/orbit';
import type { LabExampleSwitcherItem } from './example-switcher.types';

export interface LabExampleSwitcherModalData {
  readonly items: readonly LabExampleSwitcherItem[];
  readonly selected: string;
  readonly onSelect: (value: string) => void;
}

/** Modal content opened by `LabExampleSwitcherComponent` in 'modal' mode: one selectable tile
 * per example, offered as an alternative to the offcanvas switcher. */
@Component({
  selector: 'lab-example-switcher-modal',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    OrbitModalBodyComponent,
    OrbitModalComponent,
    OrbitModalHeaderComponent,
    OrbitSelectableTileComponent,
  ],
  template: `<orbit-modal labelledBy="example-switcher-modal-title" size="sm">
    <orbit-modal-header
      titleId="example-switcher-modal-title"
      title="Cambia scheda"
      (closeClicked)="close()"
    />
    <orbit-modal-body>
      <div class="lab-example-switcher-modal__grid">
        @for (item of data.items; track item.value) {
          <orbit-selectable-tile
            [label]="item.label"
            [description]="item.badge"
            [selected]="item.value === data.selected"
            (selectedChange)="select(item.value)"
          />
        }
      </div>
    </orbit-modal-body>
  </orbit-modal>`,
  styleUrl: './example-switcher-modal.component.css',
})
export class LabExampleSwitcherModalComponent {
  private readonly dialogRef = inject(DialogRef<LabExampleSwitcherModalComponent>);
  protected readonly data = inject(DIALOG_DATA) as LabExampleSwitcherModalData;

  select(value: string): void {
    this.data.onSelect(value);
    this.close();
  }

  close(): void {
    this.dialogRef.close();
  }
}
