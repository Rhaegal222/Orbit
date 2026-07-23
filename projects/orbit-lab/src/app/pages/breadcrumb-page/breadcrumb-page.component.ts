import { ChangeDetectionStrategy, Component } from '@angular/core';
import { OrbitBreadcrumbComponent, OrbitBreadcrumbItem } from '@galileo/orbit';
import { LabExampleComponent } from '../../catalog/example-panel.component';

@Component({
  selector: 'lab-breadcrumb-page',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [OrbitBreadcrumbComponent, LabExampleComponent],
  templateUrl: './breadcrumb-page.component.html',
})
export class BreadcrumbPageComponent {
  protected readonly shortItems: OrbitBreadcrumbItem[] = [
    { id: 'home', label: 'Home', href: '/' },
    { id: 'catalog', label: 'Catalogo', href: '/catalog' },
    { id: 'breadcrumb', label: 'Breadcrumb' },
  ];

  protected readonly longItems: OrbitBreadcrumbItem[] = [
    { id: 'home', label: 'Home', href: '/' },
    { id: 'clients', label: 'Clienti', href: '/clients' },
    { id: 'client', label: 'Rossi S.p.A.', href: '/clients/rossi' },
    { id: 'projects', label: 'Progetti', href: '/clients/rossi/projects' },
    { id: 'project', label: 'Migrazione ERP', href: '/clients/rossi/projects/erp' },
    { id: 'current', label: 'Dettaglio task' },
  ];

  protected lastSelectedLabel = '';

  protected readonly usageSnippet =
    '<orbit-breadcrumb [items]="items" (itemSelected)="onItemSelected($event)" />';

  onItemSelected(item: OrbitBreadcrumbItem): void {
    this.lastSelectedLabel = item.label;
  }
}
