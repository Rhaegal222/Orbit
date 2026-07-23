import { ChangeDetectionStrategy, Component, Directive, input } from '@angular/core';

@Directive({
  selector: '[orbitWorkspaceSidebar]',
  standalone: true,
  host: { class: 'orbit-workspace__sidebar' },
})
export class OrbitWorkspaceSidebarDirective {}
@Directive({
  selector: '[orbitWorkspaceMain]',
  standalone: true,
  host: { class: 'orbit-workspace__main' },
})
export class OrbitWorkspaceMainDirective {}
@Component({
  selector: 'orbit-workspace',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content />',
  styleUrl: './workspace.component.css',
  host: { '[style.--orbit-workspace-sidebar-width]': 'sidebarWidth()' },
})
export class OrbitWorkspaceComponent {
  sidebarWidth = input('17.5rem');
}
