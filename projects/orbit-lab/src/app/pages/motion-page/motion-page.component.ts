import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import {
  OrbitButtonComponent,
  OrbitDatePickerComponent,
  OrbitFormSectionComponent,
  OrbitPopoverComponent,
  OrbitSelectableTileComponent,
  OrbitIconButtonComponent,
  OrbitModalComponent,
  ORBIT_DIALOG_DATA,
  OrbitDialogService,
} from '@galileo/orbit';
import { LabExampleComponent } from '../../catalog/example-panel.component';

@Component({
  selector: 'lab-motion-pattern-details-dialog',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [OrbitModalComponent, OrbitButtonComponent],
  template: `<orbit-modal labelledBy="pattern-details-title">
    <div
      class="pattern-details-dialog__body"
      style="padding: var(--orbit-space-5); font-family: var(--orbit-font-sans);"
    >
      <h2
        id="pattern-details-title"
        style="margin: 0 0 var(--orbit-space-4); color: var(--orbit-text-primary); font-size: var(--orbit-font-size-subtitle); font-weight: var(--orbit-font-weight-emphasis);"
      >
        Dettagli: {{ data.pattern.area }}
      </h2>
      <div
        class="pattern-details-dialog__info"
        style="display: flex; flex-direction: column; gap: var(--orbit-space-3); margin-bottom: var(--orbit-space-5);"
      >
        <div>
          <b
            style="display: block; text-transform: uppercase; font-size: var(--orbit-font-size-xs); color: var(--orbit-text-label); margin-bottom: var(--orbit-space-1);"
            >Enter</b
          >
          <span
            style="color: var(--orbit-text-secondary); font-size: var(--orbit-font-size-body);"
            >{{ data.pattern.enter }}</span
          >
        </div>
        <div>
          <b
            style="display: block; text-transform: uppercase; font-size: var(--orbit-font-size-xs); color: var(--orbit-text-label); margin-bottom: var(--orbit-space-1);"
            >Exit</b
          >
          <span
            style="color: var(--orbit-text-secondary); font-size: var(--orbit-font-size-body);"
            >{{ data.pattern.exit }}</span
          >
        </div>
        <div>
          <b
            style="display: block; text-transform: uppercase; font-size: var(--orbit-font-size-xs); color: var(--orbit-text-label); margin-bottom: var(--orbit-space-1);"
            >Token</b
          >
          <code
            style="display: inline-block; padding: var(--orbit-space-1) var(--orbit-space-2); background: var(--orbit-surface-subtle); border-radius: var(--orbit-radius-sm); font-size: var(--orbit-font-size-sm); font-family: var(--orbit-font-mono);"
            >{{ data.pattern.token }}</code
          >
        </div>
        <div
          style="display: flex; align-items: center; gap: var(--orbit-space-3); margin-top: var(--orbit-space-2);"
        >
          <b
            style="text-transform: uppercase; font-size: var(--orbit-font-size-xs); color: var(--orbit-text-label);"
            >Preview:</b
          >
          <div
            class="motion-page__pattern-preview"
            style="display: inline-grid; place-items: center; width: var(--orbit-control-height); height: var(--orbit-control-height);"
          >
            @for (run of data.patternRuns(data.pattern.area); track run) {
              <span
                [class]="
                  'motion-page__pattern-demo motion-page__pattern-demo--' + data.pattern.preview
                "
              ></span>
            }
          </div>
          <orbit-button
            [label]="data.isPatternPlaying(data.pattern.area) ? 'Stop' : 'Riproduci'"
            variant="outline"
            tone="neutral"
            (clicked)="data.togglePattern(data.pattern.area)"
          />
        </div>
      </div>
    </div>
    <div
      class="pattern-details-dialog__actions"
      style="display: flex; justify-content: flex-end; gap: var(--orbit-space-2); padding: var(--orbit-space-3) var(--orbit-space-5); border-top: 1px solid var(--orbit-border-subtle);"
    >
      <orbit-button label="Chiudi" tone="neutral" variant="outline" (clicked)="close()" />
    </div>
  </orbit-modal>`,
})
class LabMotionPatternDetailsDialogComponent {
  readonly data = inject(ORBIT_DIALOG_DATA) as any;
  private readonly dialogService = inject(OrbitDialogService);

  close(): void {
    this.dialogService.closeAll();
  }
}

@Component({
  selector: 'lab-motion-page',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    OrbitButtonComponent,
    OrbitIconButtonComponent,
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
    {
      name: '--orbit-motion-fast',
      value: '120ms',
      usage: 'Hover e stati transitori dei controlli (button, pill-switch, tile).',
      duration: 'var(--orbit-motion-fast)',
      easing: 'var(--orbit-easing-standard)',
    },
    {
      name: '--orbit-motion-base',
      value: '180ms',
      usage: 'Dropdown, popover, tooltip e sezioni espandibili.',
      duration: 'var(--orbit-motion-base)',
      easing: 'var(--orbit-easing-standard)',
    },
    {
      name: '--orbit-motion-slow',
      value: '240ms',
      usage: 'Modal, drawer e overlay di grande scala.',
      duration: 'var(--orbit-motion-slow)',
      easing: 'var(--orbit-easing-standard)',
    },
    {
      name: '--orbit-easing-standard',
      value: 'cubic-bezier(0.2, 0, 0, 1)',
      usage: 'Decelerazione per enter e state change.',
      duration: 'var(--orbit-motion-base)',
      easing: 'var(--orbit-easing-standard)',
    },
    {
      name: '--orbit-easing-accelerate',
      value: 'cubic-bezier(0.4, 0, 1, 1)',
      usage: 'Accelerazione per collapse ed exit.',
      duration: 'var(--orbit-motion-base)',
      easing: 'var(--orbit-easing-accelerate)',
    },
    {
      name: '--orbit-easing-shared',
      value: 'cubic-bezier(0.4, 0, 0.2, 1)',
      usage: 'Movimenti condivisi, come chevron e toggle.',
      duration: 'var(--orbit-motion-base)',
      easing: 'var(--orbit-easing-shared)',
    },
  ] as const;

  protected readonly patterns = [
    {
      area: 'Overlay',
      enter: 'Fade + scale',
      exit: 'Fade rapido',
      token: 'slow / fast',
      preview: 'overlay',
    },
    {
      area: 'Menu e picker',
      enter: 'Fade + scale Y',
      exit: 'Fade rapido',
      token: 'base / fast',
      preview: 'menu',
    },
    {
      area: 'Tooltip',
      enter: 'Fade + translate',
      exit: 'Fade rapido',
      token: 'fast / fast',
      preview: 'tooltip',
    },
    {
      area: 'Sezioni',
      enter: 'Grid height + fade',
      exit: 'Collapse + fade',
      token: 'base / base',
      preview: 'section',
    },
    {
      area: 'Feedback',
      enter: 'Pop / colore',
      exit: 'Fast',
      token: 'fast',
      preview: 'feedback',
    },
  ] as const;

  protected readonly tileSelected = signal(false);
  protected readonly date = new FormControl<Date | null>(new Date(2026, 6, 22));
  protected readonly activePattern = signal<{ area: string; run: number } | null>(null);
  private patternRun = 0;

  protected readonly buttonSnippet = '<orbit-button variant="solid" label="Passa il mouse" />';
  protected readonly tileSnippet =
    '<orbit-selectable-tile label="Seleziona" [selected]="selected" (selectedChange)="selected = $event" />';
  protected readonly collapsibleSnippet =
    '<orbit-form-section title="Dettagli" collapsible>…</orbit-form-section>';
  protected readonly floatingSnippet = `<orbit-date-picker [formControl]="date" />
<orbit-popover content="Contenuto contestuale"><orbit-button label="Apri popover" /></orbit-popover>`;

  private readonly dialog = inject(OrbitDialogService);

  toggleTile(): void {
    this.tileSelected.update((v) => !v);
  }

  togglePattern(area: string): void {
    if (this.isPatternPlaying(area)) {
      this.activePattern.set(null);
      return;
    }

    this.activePattern.set({ area, run: ++this.patternRun });
  }

  isPatternPlaying(area: string): boolean {
    return this.activePattern()?.area === area;
  }

  patternRuns(area: string): readonly number[] {
    const active = this.activePattern();
    return active?.area === area ? [active.run] : [];
  }

  openDetails(pattern: (typeof this.patterns)[number]): void {
    this.dialog.open(LabMotionPatternDetailsDialogComponent, {
      size: 'sm',
      data: {
        pattern,
        togglePattern: (area: string) => this.togglePattern(area),
        isPatternPlaying: (area: string) => this.isPatternPlaying(area),
        patternRuns: (area: string) => this.patternRuns(area),
      },
    });
  }
}
