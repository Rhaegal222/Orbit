import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import {
  OrbitAttachmentDropzoneComponent,
  OrbitAttachmentListComponent,
  OrbitBadgeComponent,
  OrbitButtonComponent,
  OrbitDividerComponent,
  OrbitDatePickerComponent,
  OrbitFormActionBarComponent,
  OrbitFormFieldComponent,
  OrbitFormGridComponent,
  OrbitFormGridItemDirective,
  OrbitFormSectionComponent,
  OrbitModalBodyComponent,
  OrbitModalComponent,
  OrbitModalFooterComponent,
  OrbitModalHeaderComponent,
  OrbitSelectableTileComponent,
  OrbitSelectComponent,
  OrbitTextInputComponent,
  OrbitTimePickerComponent,
} from '@galileo/orbit';

@Component({
  selector: 'lab-operational-modal-page',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    OrbitAttachmentDropzoneComponent,
    OrbitAttachmentListComponent,
    OrbitBadgeComponent,
    OrbitButtonComponent,
    OrbitDividerComponent,
    OrbitDatePickerComponent,
    OrbitFormActionBarComponent,
    OrbitFormFieldComponent,
    OrbitFormGridComponent,
    OrbitFormGridItemDirective,
    OrbitFormSectionComponent,
    OrbitModalBodyComponent,
    OrbitModalComponent,
    OrbitModalFooterComponent,
    OrbitModalHeaderComponent,
    OrbitSelectableTileComponent,
    OrbitSelectComponent,
    OrbitTextInputComponent,
    OrbitTimePickerComponent,
    ReactiveFormsModule,
  ],
  templateUrl: './operational-modal-page.component.html',
  styleUrl: './operational-modal-page.component.css',
})
export class OperationalModalPageComponent {
  protected readonly primaryAmount = new FormControl('842,00', { nonNullable: true });
  protected readonly secondaryAmount = new FormControl('690,16', { nonNullable: true });

  protected readonly categoryOptions = [
    { value: 'standard', label: 'Standard' },
    { value: 'priority', label: 'Priorità' },
  ];

  protected readonly attachments = [
    {
      id: 'source',
      name: 'riepilogo.pdf',
      metadata: 'Origine importata',
      status: 'readonly' as const,
      statusLabel: 'Sola lettura',
      readonly: true,
    },
  ];
}
