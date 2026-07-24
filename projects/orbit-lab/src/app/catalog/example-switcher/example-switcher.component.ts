import { Dialog } from '@angular/cdk/dialog';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import {
  OrbitBadgeComponent,
  OrbitButtonComponent,
  OrbitIconButtonComponent,
  OrbitPanelService,
} from '@galileo/orbit';
import { LabExampleSwitcherModalComponent } from './example-switcher-modal.component';
import { LabExampleSwitcherSidebarContentComponent } from './example-switcher-sidebar-content.component';
import type { LabExampleSwitcherItem } from './example-switcher.types';

export type LabExampleSwitcherMode = 'offcanvas' | 'modal';

/** Mobile-only scenario switcher for pages with several demo scenarios (currently
 * examples-page): a topbar showing the current example plus a toggle between two equivalent
 * switch-example surfaces (offcanvas drawer vs. modal preview cards), both built from
 * existing Orbit primitives. Carries no breakpoint-hiding CSS itself — see
 * `examples-page.component.css` for the consumer-owned visibility gating. */
@Component({
  selector: 'lab-example-switcher',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [OrbitBadgeComponent, OrbitButtonComponent, OrbitIconButtonComponent],
  templateUrl: './example-switcher.component.html',
  styleUrl: './example-switcher.component.css',
})
export class LabExampleSwitcherComponent {
  items = input.required<readonly LabExampleSwitcherItem[]>();
  selected = input.required<string>();
  selectedChange = output<string>();

  private readonly panelService = inject(OrbitPanelService);
  private readonly dialog = inject(Dialog);

  protected readonly mode = signal<LabExampleSwitcherMode>('offcanvas');
  protected readonly current = computed(
    () => this.items().find((item) => item.value === this.selected()) ?? this.items()[0],
  );

  setMode(mode: LabExampleSwitcherMode): void {
    this.mode.set(mode);
  }

  open(): void {
    const onSelect = (value: string) => this.selectedChange.emit(value);
    if (this.mode() === 'offcanvas') {
      this.panelService.open(LabExampleSwitcherSidebarContentComponent, {
        side: 'left',
        size: 'sm',
        data: { items: this.items(), selected: this.selected(), onSelect },
      });
    } else {
      this.dialog.open(LabExampleSwitcherModalComponent, {
        data: { items: this.items(), selected: this.selected(), onSelect },
      });
    }
  }
}
