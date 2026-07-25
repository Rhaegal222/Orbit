import { ChangeDetectionStrategy, Component } from '@angular/core';
import { OrbitBadgeComponent, OrbitButtonComponent } from '@galileo/orbit';

@Component({
  selector: 'lab-themes-page',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [OrbitBadgeComponent, OrbitButtonComponent],
  templateUrl: './themes-page.component.html',
  styleUrl: './themes-page.component.css',
})
export class ThemesPageComponent {}
