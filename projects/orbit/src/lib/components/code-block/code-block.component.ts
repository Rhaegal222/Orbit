import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  linkedSignal,
  signal,
} from '@angular/core';
import { OrbitClipboardService } from '../../services/clipboard';

let codeBlockSequence = 0;

@Component({
  selector: 'orbit-code-block',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './code-block.component.html',
  styleUrl: './code-block.component.css',
})
export class OrbitCodeBlockComponent {
  code = input.required<string>();
  collapsible = input(true, { transform: booleanAttribute });
  initiallyCollapsed = input(true, { transform: booleanAttribute });

  private readonly clipboard = inject(OrbitClipboardService);

  protected readonly collapsed = linkedSignal(() => this.collapsible() && this.initiallyCollapsed());
  protected readonly copyLabel = signal('Copia');
  protected readonly panelId = `orbit-code-block-${++codeBlockSequence}`;

  toggle(): void {
    this.collapsed.update((collapsed) => !collapsed);
  }

  async copy(): Promise<void> {
    const copied = await this.clipboard.copyText(this.code());
    this.copyLabel.set(copied ? 'Copiato' : 'Copia non riuscita');
    setTimeout(() => this.copyLabel.set('Copia'), 1500);
  }
}
