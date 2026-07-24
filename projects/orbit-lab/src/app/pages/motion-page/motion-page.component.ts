import { SharedResizeObserver } from '@angular/cdk/observers/private';
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  inject,
  output,
  signal,
  viewChild,
} from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { EMPTY, map, switchMap } from 'rxjs';
import {
  OrbitButtonComponent,
  OrbitDatePickerComponent,
  OrbitFormSectionComponent,
  OrbitModalBodyComponent,
  OrbitModalComponent,
  OrbitModalHeaderComponent,
  OrbitPopoverComponent,
  OrbitSelectableTileComponent,
  OrbitTableComponent,
  OrbitTableRowDirective,
  ORBIT_DIALOG_DATA,
  OrbitDialogService,
} from '@galileo/orbit';
import { LabExampleComponent } from '../../catalog/example-panel.component';

/** Matches the `@container lab-viewport (max-width: 48rem)` breakpoint in the stylesheet. */
const MOBILE_BREAKPOINT_REM = 48;

interface LabMotionPatternPreviewData {
  pattern: { area: string; enter: string; exit: string; token: string; preview: string };
  togglePattern: (area: string) => void;
  isPatternPlaying: (area: string) => boolean;
  patternRuns: (area: string) => readonly number[];
}

/**
 * Always opened through OrbitDialogService: when Orbit Lab's mobile-preview mockup is active,
 * LabScopedOverlayContainer transparently redirects the CDK overlay into the phone bezel
 * instead of document.body, so this needs no preview-aware branching of its own.
 */
@Component({
  selector: 'lab-motion-pattern-preview-dialog',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    OrbitModalComponent,
    OrbitModalHeaderComponent,
    OrbitModalBodyComponent,
    OrbitButtonComponent,
  ],
  template: `<orbit-modal size="sm" labelledBy="pattern-preview-title">
    <orbit-modal-header
      [title]="data.pattern.area"
      titleId="pattern-preview-title"
      (closeClicked)="close()"
    />
    <orbit-modal-body>
      <div style="display: flex; flex-direction: column; gap: var(--orbit-space-3);">
        <p style="margin: 0; color: var(--orbit-text-secondary);">
          <b>Enter</b> {{ data.pattern.enter }} · <b>Exit</b> {{ data.pattern.exit }}
        </p>
        <code style="align-self: flex-start;">{{ data.pattern.token }}</code>
        <div
          class="motion-page__pattern-preview"
          aria-hidden="true"
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
    </orbit-modal-body>
  </orbit-modal>`,
})
export class LabMotionPatternPreviewDialogComponent {
  readonly data = inject(ORBIT_DIALOG_DATA) as LabMotionPatternPreviewData;
  private readonly dialog = inject(OrbitDialogService);
  readonly closed = output<void>();

  close(): void {
    this.closed.emit();
    this.dialog.closeAll();
  }
}

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
    OrbitTableComponent,
    OrbitTableRowDirective,
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
  private readonly resizeObserver = inject(SharedResizeObserver);

  // Measures the table's actual rendered width rather than the browser viewport, since this
  // page also renders inside Orbit Lab's mobile-preview mockup (a fixed-width div that never
  // changes the real viewport, so BreakpointObserver would never report it as narrow).
  private readonly patternsTable = viewChild('patternsTable', { read: ElementRef });
  protected readonly isMobile = toSignal(
    toObservable(this.patternsTable).pipe(
      switchMap((ref: ElementRef<HTMLElement> | undefined) =>
        ref ? this.resizeObserver.observe(ref.nativeElement) : EMPTY,
      ),
      map(([entry]) => entry.contentRect.width < this.mobileBreakpointPx()),
    ),
    { initialValue: false },
  );

  private mobileBreakpointPx(): number {
    const rootFontSize = parseFloat(getComputedStyle(document.documentElement).fontSize) || 16;
    return MOBILE_BREAKPOINT_REM * rootFontSize;
  }

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

  onRowTap(pattern: (typeof this.patterns)[number]): void {
    if (!this.isMobile()) return;

    this.dialog.open(LabMotionPatternPreviewDialogComponent, {
      size: 'sm',
      data: this.buildPatternPreviewData(pattern),
    });
  }

  private buildPatternPreviewData(
    pattern: (typeof this.patterns)[number],
  ): LabMotionPatternPreviewData {
    return {
      pattern,
      togglePattern: (area: string) => this.togglePattern(area),
      isPatternPlaying: (area: string) => this.isPatternPlaying(area),
      patternRuns: (area: string) => this.patternRuns(area),
    };
  }
}
