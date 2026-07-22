import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import {
  OrbitButtonComponent,
  OrbitDatePickerComponent,
  OrbitFormSectionComponent,
  OrbitPopoverComponent,
  OrbitSelectableTileComponent,
} from '@galileo/orbit';
import { LabExampleComponent } from '../../catalog/example-panel.component';

@Component({
  selector: 'lab-motion-page',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    OrbitButtonComponent,
    OrbitDatePickerComponent,
    OrbitFormSectionComponent,
    OrbitPopoverComponent,
    OrbitSelectableTileComponent,
    LabExampleComponent,
    ReactiveFormsModule,
  ],
  templateUrl: './motion-page.component.html',
  styleUrl: './motion-page.component.css',
})
export class MotionPageComponent {
  protected readonly tokens = [
    { name: '--orbit-motion-fast', value: '120ms', usage: 'Hover e stati transitori dei controlli (button, pill-switch, tile).' },
    { name: '--orbit-motion-base', value: '180ms', usage: 'Dropdown, popover, tooltip e sezioni espandibili.' },
    { name: '--orbit-motion-slow', value: '240ms', usage: 'Modal, drawer e overlay di grande scala.' },
    { name: '--orbit-easing-standard', value: 'cubic-bezier(0.2, 0, 0, 1)', usage: 'Decelerazione per enter e state change.' },
    { name: '--orbit-easing-accelerate', value: 'cubic-bezier(0.4, 0, 1, 1)', usage: 'Accelerazione per collapse ed exit.' },
    { name: '--orbit-easing-shared', value: 'cubic-bezier(0.4, 0, 0.2, 1)', usage: 'Movimenti condivisi, come chevron e toggle.' },
  ] as const;

  protected readonly patterns = [
    { area: 'Overlay', enter: 'Fade + scale', exit: 'Fade rapido', token: 'slow / fast' },
    { area: 'Menu e picker', enter: 'Fade + scale Y', exit: 'Fade rapido', token: 'base / fast' },
    { area: 'Tooltip', enter: 'Fade + translate', exit: 'Fade rapido', token: 'fast / fast' },
    { area: 'Sezioni', enter: 'Grid height + fade', exit: 'Collapse + fade', token: 'base / base' },
    { area: 'Feedback', enter: 'Pop / colore', exit: 'Fast', token: 'fast' },
  ] as const;

  protected readonly tileSelected = signal(false);
  protected readonly date = new FormControl<Date | null>(new Date(2026, 6, 22));

  protected readonly buttonSnippet = '<orbit-button variant="solid" label="Passa il mouse" />';
  protected readonly tileSnippet =
    '<orbit-selectable-tile label="Seleziona" [selected]="selected" (selectedChange)="selected = $event" />';
  protected readonly collapsibleSnippet =
    '<orbit-form-section title="Dettagli" [collapsible]="true">…</orbit-form-section>';
  protected readonly floatingSnippet = `<orbit-date-picker [formControl]="date" />
<orbit-popover content="Contenuto contestuale"><orbit-button label="Apri popover" /></orbit-popover>`;

  toggleTile(): void {
    this.tileSelected.update((v) => !v);
  }
}
