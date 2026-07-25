import { booleanAttribute, ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'orbit-modal-footer',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './modal-footer.component.html',
  styleUrl: './modal-footer.component.css',
  host: {
    '[class.orbit-modal-footer--form]': 'variant() === "form"',
  },
})
export class OrbitModalFooterComponent {
  variant = input<'default' | 'form'>('default');
  loading = input(false, { transform: booleanAttribute });
}
