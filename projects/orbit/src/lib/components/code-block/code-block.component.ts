import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  linkedSignal,
  signal,
} from '@angular/core';
import { OrbitClipboardService } from '../../services/clipboard';
import { OrbitIconButtonComponent } from '../icon-button/icon-button.component';
import { OrbitIconComponent } from '../../icons/icon.component';

let codeBlockSequence = 0;

@Component({
  selector: 'orbit-code-block',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [OrbitIconButtonComponent, OrbitIconComponent],
  templateUrl: './code-block.component.html',
  styleUrl: './code-block.component.css',
})
export class OrbitCodeBlockComponent {
  code = input.required<string>();
  collapsible = input(true, { transform: booleanAttribute });
  initiallyCollapsed = input(true, { transform: booleanAttribute });
  showActions = input(true, { transform: booleanAttribute });

  private readonly clipboard = inject(OrbitClipboardService);

  protected readonly collapsed = linkedSignal(() => this.collapsible() && this.initiallyCollapsed());
  protected readonly copyLabel = signal('Copia');
  protected readonly panelId = `orbit-code-block-${++codeBlockSequence}`;
  protected readonly lines = computed(() => this.code().split('\n'));

  toggle(): void {
    this.collapsed.update((collapsed) => !collapsed);
  }

  async copy(): Promise<void> {
    const copied = await this.clipboard.copyText(this.code());
    this.copyLabel.set(copied ? 'Copiato' : 'Copia non riuscita');
    setTimeout(() => this.copyLabel.set('Copia'), 1500);
  }
}
