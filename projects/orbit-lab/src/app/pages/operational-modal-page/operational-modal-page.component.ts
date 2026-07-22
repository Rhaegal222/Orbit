import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import {
  OrbitAttachmentDropzoneComponent,
  OrbitAttachmentListComponent,
  OrbitBadgeComponent,
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
import { LabExampleComponent } from '../../catalog/example-panel.component';

type ExampleId = 'inline-form' | 'service-selection' | 'document-workspace';

interface ExampleCard {
  id: ExampleId;
  label: string;
  description: string;
}

@Component({
  selector: 'lab-operational-modal-page',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    OrbitAttachmentDropzoneComponent,
    OrbitAttachmentListComponent,
    OrbitBadgeComponent,
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
    LabExampleComponent,
  ],
  templateUrl: './operational-modal-page.component.html',
  styleUrl: './operational-modal-page.component.css',
})
export class OperationalModalPageComponent {
  protected readonly modalSize = signal<'sm' | 'md' | 'lg' | 'xl' | 'xxl' | 'full'>('md');
  protected readonly selectedExample = signal<ExampleId>('inline-form');
  protected readonly examples: readonly ExampleCard[] = [
    {
      id: 'inline-form',
      label: 'Configurazione',
      description: 'Il modale operativo con campi e dropdown.',
    },
    {
      id: 'service-selection',
      label: 'Scelta servizio',
      description: 'Decisione rapida con opzioni e riepilogo.',
    },
    {
      id: 'document-workspace',
      label: 'Workspace documenti',
      description: 'Raccolta, revisione e caricamento evidenze.',
    },
  ];
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

  protected readonly reviewAttachments = [
    {
      id: 'evidence',
      name: 'verbale-verifica.pdf',
      metadata: 'Versione 2 · 1,8 MB',
      status: 'readonly' as const,
      statusLabel: 'Da revisionare',
      readonly: true,
    },
  ];

  protected selectExample(example: ExampleId): void {
    this.selectedExample.set(example);
  }

  protected setModalSize(size: 'sm' | 'md' | 'lg' | 'xl' | 'xxl' | 'full'): void {
    this.modalSize.set(size);
  }
}
