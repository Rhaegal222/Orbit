import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'orbit-page-shell',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<main class="orbit-page-shell__content"><ng-content /></main>',
  styleUrl: './page-shell.component.css',
  host: {
    '[class.orbit-page-shell--document]': "width() === 'document'",
    '[class.orbit-page-shell--workspace]': "width() === 'workspace'",
    '[class.orbit-page-shell--full]': "width() === 'full'",
  },
})
export class OrbitPageShellComponent {
  width = input<'document' | 'workspace' | 'full'>('workspace');
}
