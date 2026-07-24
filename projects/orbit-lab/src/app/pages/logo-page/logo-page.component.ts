import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'lab-logo-page',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './logo-page.component.html',
  styleUrls: ['./logo-page.component.css'],
})
export class LogoPageComponent {}
