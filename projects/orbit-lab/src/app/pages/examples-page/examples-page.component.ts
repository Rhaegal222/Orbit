import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import {
  OrbitAttachmentDropzoneComponent,
  OrbitAttachmentListComponent,
  OrbitBadgeComponent,
  OrbitButtonComponent,
  OrbitDateRangePickerComponent,
  OrbitDividerComponent,
  OrbitFormActionBarComponent,
  OrbitFormFieldComponent,
  OrbitFormGridComponent,
  OrbitFormGridItemDirective,
  OrbitFormSectionComponent,
  OrbitIconButtonComponent,
  OrbitIconComponent,
  OrbitModalBodyComponent,
  OrbitModalComponent,
  OrbitModalFooterComponent,
  OrbitModalHeaderComponent,
  OrbitNavbarComponent,
  type OrbitNavbarItem,
  OrbitPanelComponent,
  OrbitSelectableTileComponent,
  OrbitSelectComponent,
  OrbitTabComponent,
  OrbitTabPanelComponent,
  OrbitTablistComponent,
  OrbitTableColumnComponent,
  OrbitTableComponent,
  OrbitTableRowDirective,
  OrbitTextInputComponent,
} from '@galileo/orbit';
import { LabExampleComponent } from '../../components/example-panel/example-panel.component';

type ExampleId = 'portfolio' | 'dossier' | 'quick-action' | 'landing';
type ProductSectionId = 'overview' | 'pricing' | 'variants' | 'media' | 'channels';

interface ProductRow {
  sku: string;
  name: string;
  category: string;
  owner: string;
  price: string;
  completeness: string;
  status: string;
  tone: 'success' | 'warning' | 'neutral' | 'danger';
}

const CENTER_LEFT_ITEMS: readonly OrbitNavbarItem[] = [
  { id: 'solutions', label: 'Soluzioni' },
  { id: 'catalog', label: 'Catalogo' },
  { id: 'about', label: 'Chi siamo' },
];

const CENTER_RIGHT_ITEMS: readonly OrbitNavbarItem[] = [
  { id: 'services', label: 'Servizi' },
  { id: 'blog', label: 'Blog' },
  { id: 'contacts', label: 'Contatti' },
];

@Component({
  selector: 'lab-examples-page',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    OrbitAttachmentDropzoneComponent,
    OrbitAttachmentListComponent,
    OrbitBadgeComponent,
    OrbitButtonComponent,
    OrbitDateRangePickerComponent,
    OrbitDividerComponent,
    OrbitFormActionBarComponent,
    OrbitFormFieldComponent,
    OrbitFormGridComponent,
    OrbitFormGridItemDirective,
    OrbitFormSectionComponent,
    OrbitIconButtonComponent,
    OrbitIconComponent,
    OrbitModalBodyComponent,
    OrbitModalComponent,
    OrbitModalFooterComponent,
    OrbitModalHeaderComponent,
    OrbitNavbarComponent,
    OrbitPanelComponent,
    OrbitSelectableTileComponent,
    OrbitSelectComponent,
    OrbitTabComponent,
    OrbitTabPanelComponent,
    OrbitTablistComponent,
    OrbitTableColumnComponent,
    OrbitTableComponent,
    OrbitTableRowDirective,
    OrbitTextInputComponent,
    ReactiveFormsModule,
    LabExampleComponent,
  ],
  templateUrl: './examples-page.component.html',
  styleUrl: './examples-page.component.css',
})
export class ExamplesPageComponent {
  protected readonly selectedExample = signal<ExampleId>('portfolio');
  protected readonly selectedProductSection = signal<ProductSectionId>('overview');
  protected readonly skuSort = signal<'asc' | 'desc' | null>(null);
  protected readonly search = new FormControl('', { nonNullable: true });
  protected readonly categoryFilter = new FormControl<string | null>(null);
  protected readonly channelFilter = new FormControl<string | null>(null);
  protected readonly modifiedRange = new FormControl({ start: null, end: null });
  protected readonly listPrice = new FormControl('240,00', { nonNullable: true });
  protected readonly updateType = signal('percent');
  protected readonly selectedLandingNav = signal('solutions');
  protected readonly landingNavItems = CENTER_LEFT_ITEMS;
  protected readonly landingRightItems = CENTER_RIGHT_ITEMS;
  protected readonly offcanvasOpen = signal(false);
  protected readonly landingAnnouncement = signal(
    'Benvenuti nel nostro catalogo — Scopri le ultime novità',
  );

  protected readonly categoryOptions = [
    { value: 'lighting', label: 'Illuminazione' },
    { value: 'electronics', label: 'Elettronica' },
    { value: 'smart', label: 'Controlli Smart' },
    { value: 'accessories', label: 'Accessori' },
  ];

  protected readonly channelOptions = [
    { value: 'italy', label: 'B2B Italia' },
    { value: 'eu', label: 'B2B Europa' },
    { value: 'marketplace', label: 'Marketplace partner' },
  ];

  protected readonly products = computed(() => {
    const rows: ProductRow[] = [
      {
        sku: 'PRD-8012-X',
        name: 'Modulo Proiettore LED Industrial 150W',
        category: 'Illuminazione',
        owner: 'Marco Rossi',
        price: '€ 240,00',
        completeness: '98%',
        status: 'Attivo a Catalogo',
        tone: 'success',
      },
      {
        sku: 'PRD-8015-B',
        name: 'Sensore di Presenza High-Bay IP65',
        category: 'Elettronica',
        owner: 'Elena Bianchi',
        price: '€ 85,00',
        completeness: '60%',
        status: 'In Revisione Qualità',
        tone: 'warning',
      },
      {
        sku: 'PRD-9020-K',
        name: 'Centralina Gateway DALI-3 Wireless',
        category: 'Controlli Smart',
        owner: 'Roberto Riva',
        price: '€ 410,00',
        completeness: '100%',
        status: 'Attivo a Catalogo',
        tone: 'success',
      },
      {
        sku: 'PRD-9022-S',
        name: 'Staffa Regolabile ad Alta Resistenza',
        category: 'Accessori',
        owner: 'Marco Rossi',
        price: '€ 28,50',
        completeness: '35%',
        status: 'Bozza Scheda',
        tone: 'neutral',
      },
      {
        sku: 'PRD-7001-A',
        name: 'Lampada Emergenza Compact 24V',
        category: 'Illuminazione',
        owner: 'Sofia Conti',
        price: '€ 62,00',
        completeness: '100%',
        status: 'In Esaurimento',
        tone: 'danger',
      },
      {
        sku: 'PRD-7055-M',
        name: 'Driver Dimmerabile 100W Multi-Tensione',
        category: 'Elettronica',
        owner: 'Matteo Ferri',
        price: '€ 54,00',
        completeness: '90%',
        status: 'Attivo a Catalogo',
        tone: 'success',
      },
    ];
    return this.skuSort() === 'desc' ? [...rows].reverse() : rows;
  });

  protected readonly attachments = [
    {
      id: 'manual',
      name: 'MANUALE_INSTALLAZIONE_v2.pdf',
      metadata: '5.4 MB · Caricato il 10/05/2026 da M. Rossi',
      status: 'success' as const,
      statusLabel: 'Validato',
      readonly: true,
    },
    {
      id: 'safety',
      name: 'SCHEDA_SICUREZZA_CE_2026.pdf',
      metadata: '1.2 MB · Caricato il 14/05/2026 da E. Bianchi',
      status: 'success' as const,
      statusLabel: 'Approvato',
      readonly: true,
    },
    {
      id: 'diagram',
      name: 'DIAGRAMMA_FOTOMETRICO_3D.dxf',
      metadata: '12.8 MB · Caricato il 02/06/2026 da R. Riva',
      status: 'readonly' as const,
      statusLabel: 'In Revisione',
      readonly: true,
    },
    {
      id: 'image',
      name: 'IMMAGINE_PRODOTTO_HIGHRES.png',
      metadata: '8.1 MB · Caricato il 05/06/2026 da M. Rossi',
      status: 'success' as const,
      statusLabel: 'Pronto per Web',
      readonly: true,
    },
  ];

  selectExample(example: string): void {
    if (
      example === 'portfolio' ||
      example === 'dossier' ||
      example === 'quick-action' ||
      example === 'landing'
    ) {
      this.selectedExample.set(example);
    }
  }

  protected selectLandingNav(item: OrbitNavbarItem): void {
    this.selectedLandingNav.set(item.id);
  }

  protected toggleOffcanvas(): void {
    this.offcanvasOpen.update((v) => !v);
  }

  protected closeOffcanvas(): void {
    this.offcanvasOpen.set(false);
  }

  protected setSkuSort(direction: 'asc' | 'desc'): void {
    this.skuSort.set(direction);
  }

  protected setProductSection(section: string): void {
    if (
      section === 'overview' ||
      section === 'pricing' ||
      section === 'variants' ||
      section === 'media' ||
      section === 'channels'
    ) {
      this.selectedProductSection.set(section);
    }
  }

  protected setUpdateType(type: string): void {
    this.updateType.set(type);
  }
}
