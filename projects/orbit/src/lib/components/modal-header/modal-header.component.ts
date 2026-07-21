import { booleanAttribute, ChangeDetectionStrategy, Component, input, output } from '@angular/core';

@Component({
  selector: 'orbit-modal-header',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './modal-header.component.html',
  styleUrl: './modal-header.component.css',
  host: {
    '[class.orbit-modal-header--form]': 'variant() === "form"',
  },
})
export class OrbitModalHeaderComponent {
  title = input('');
  subtitle = input('');
  variant = input<'default' | 'form'>('default');
  closable = input(true, { transform: booleanAttribute });
  loading = input(false, { transform: booleanAttribute });

  closeClicked = output<void>();

  onClose(): void {
    this.closeClicked.emit();
  }
}
