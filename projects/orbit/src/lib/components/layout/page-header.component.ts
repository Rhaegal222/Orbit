import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'orbit-page-header',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template:
    '<header class="orbit-page-header"><div><h1>{{ title() }}</h1>@if (subtitle()) { <p>{{ subtitle() }}</p> }</div><div class="orbit-page-header__actions"><ng-content /></div></header>',
  styleUrl: './page-header.component.css',
})
export class OrbitPageHeaderComponent {
  title = input.required<string>();
  subtitle = input('');
}
