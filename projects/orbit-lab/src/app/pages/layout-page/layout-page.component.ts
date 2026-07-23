import { ChangeDetectionStrategy, Component } from '@angular/core';
import {
  OrbitClusterComponent,
  OrbitDataAlignDirective,
  OrbitFormFieldComponent,
  OrbitFormGridComponent,
  OrbitFormGridItemDirective,
  OrbitPageHeaderComponent,
  OrbitPageShellComponent,
  OrbitStackComponent,
  OrbitTextInputComponent,
  OrbitWorkspaceComponent,
  OrbitWorkspaceMainDirective,
  OrbitWorkspaceSidebarDirective,
} from '@galileo/orbit';
import { LabExampleComponent } from '../../catalog/example-panel.component';

@Component({
  selector: 'lab-layout-page',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    OrbitStackComponent,
    OrbitClusterComponent,
    OrbitFormGridComponent,
    OrbitFormGridItemDirective,
    OrbitFormFieldComponent,
    OrbitTextInputComponent,
    OrbitPageShellComponent,
    OrbitPageHeaderComponent,
    OrbitWorkspaceComponent,
    OrbitWorkspaceSidebarDirective,
    OrbitWorkspaceMainDirective,
    OrbitDataAlignDirective,
    LabExampleComponent,
  ],
  templateUrl: './layout-page.component.html',
})
export class LayoutPageComponent {
  protected readonly stackSnippet = `<orbit-stack gap="lg">
  <strong>Catalogo prodotti</strong>
  <span>Gestisci attributi, listini e canali B2B.</span>
  <orbit-cluster gap="sm">
    <span>Attivo</span>
    <span>98% completo</span>
    <span>Ultima revisione oggi</span>
  </orbit-cluster>
</orbit-stack>`;
  protected readonly pageShellSnippet = `<orbit-page-shell width="document">
  <orbit-page-header title="Listino Italia" subtitle="Aggiornato il 22 luglio 2026">
    <orbit-cluster gap="sm">
      <span>Bozza</span>
      <span>3 modifiche</span>
    </orbit-cluster>
  </orbit-page-header>
</orbit-page-shell>`;
  protected readonly workspaceSnippet =
    '<orbit-workspace><aside orbitWorkspaceSidebar>…</aside><main orbitWorkspaceMain>…</main></orbit-workspace>';
  protected readonly formCompositionSnippet = `<orbit-form-grid layout="7-5">
  <div primary> <!-- Colonna principale: 7/12 su desktop -->
    <orbit-form-field label="Nome prodotto" inputId="nome-prodotto">
      <orbit-text-input inputId="nome-prodotto" />
    </orbit-form-field>
  </div>
  <div secondary> <!-- Colonna secondaria: 5/12 su desktop -->
    <orbit-form-field label="Codice SKU" inputId="codice-sku">
      <orbit-text-input inputId="codice-sku" />
    </orbit-form-field>
  </div>
</orbit-form-grid>`;
  protected readonly formSpansSnippet = `<orbit-form-grid>
  <div orbitFormGridItem [span]="12" [spanMd]="6" [spanLg]="4"> <!-- 1 / 2 / 3 colonne -->
    <orbit-form-field label="Famiglia" inputId="famiglia"><orbit-text-input inputId="famiglia" /></orbit-form-field>
  </div>
  <div orbitFormGridItem [span]="12" [spanMd]="6" [spanLg]="4">
    <orbit-form-field label="Canale" inputId="canale"><orbit-text-input inputId="canale" /></orbit-form-field>
  </div>
  <div orbitFormGridItem [span]="12" [spanLg]="4">
    <orbit-form-field label="Margine target" inputId="margine"><orbit-text-input inputId="margine" /></orbit-form-field>
  </div>
</orbit-form-grid>`;
  protected readonly formSingleSnippet = `<orbit-form-grid layout="single">
  <div primary> <!-- Occupa tutte le 12 colonne -->
    <orbit-form-field label="Ragione sociale" inputId="ragione-sociale"><orbit-text-input inputId="ragione-sociale" /></orbit-form-field>
  </div>
  <div secondary> <!-- Va sotto la colonna principale -->
    <orbit-form-field label="Note" inputId="note"><orbit-text-input inputId="note" /></orbit-form-field>
  </div>
</orbit-form-grid>`;
  protected readonly formCompactSnippet = `<orbit-form-grid density="compact">
  <div orbitFormGridItem [span]="12" [spanSm]="6">
    <orbit-form-field label="Codice interno" inputId="codice-interno"><orbit-text-input inputId="codice-interno" /></orbit-form-field>
  </div>
  <div orbitFormGridItem [span]="12" [spanSm]="6">
    <orbit-form-field label="Versione" inputId="versione"><orbit-text-input inputId="versione" /></orbit-form-field>
  </div>
</orbit-form-grid>`;
}
