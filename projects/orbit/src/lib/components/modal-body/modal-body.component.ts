import { booleanAttribute, ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'orbit-modal-body',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './modal-body.component.html',
  styleUrl: './modal-body.component.css',
})
export class OrbitModalBodyComponent {
  loading = input(false, { transform: booleanAttribute });
  loadingLabel = input('Operazione in corso');
  loaderSmall = input(false, { transform: booleanAttribute });
}
