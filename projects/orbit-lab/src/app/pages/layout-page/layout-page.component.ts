import { ChangeDetectionStrategy, Component } from '@angular/core';
import {
  OrbitClusterComponent,
  OrbitDataAlignDirective,
  OrbitPageHeaderComponent,
  OrbitPageShellComponent,
  OrbitStackComponent,
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
  protected readonly stackSnippet = '<orbit-stack gap="lg">…</orbit-stack>';
  protected readonly clusterSnippet = '<orbit-cluster gap="sm" justify="between">…</orbit-cluster>';
  protected readonly workspaceSnippet =
    '<orbit-workspace><aside orbitWorkspaceSidebar>…</aside><main orbitWorkspaceMain>…</main></orbit-workspace>';
}
