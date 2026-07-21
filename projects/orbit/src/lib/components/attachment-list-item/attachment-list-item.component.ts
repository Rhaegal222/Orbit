import { booleanAttribute, ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { OrbitIconButtonComponent, type OrbitIconButtonTone } from '../icon-button/icon-button.component';

export type OrbitAttachmentListItemStatus = 'default' | 'readonly' | 'success' | 'danger';

export interface OrbitAttachmentListItemAction {
  id: string;
  label: string;
  ariaLabel?: string;
  icon?: 'view' | 'download' | 'remove' | 'retry';
  tone?: OrbitIconButtonTone;
  disabled?: boolean;
}

@Component({
  selector: 'orbit-attachment-list-item',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [OrbitIconButtonComponent],
  templateUrl: './attachment-list-item.component.html',
  styleUrl: './attachment-list-item.component.css',
  host: {
    "[class.orbit-attachment-list-item--readonly]": "readonly() || status() === 'readonly'",
    '[class.orbit-attachment-list-item--success]': "status() === 'success'",
    '[class.orbit-attachment-list-item--danger]': "status() === 'danger'",
  },
})
export class OrbitAttachmentListItemComponent {
  name = input.required<string>();
  metadata = input('');
  status = input<OrbitAttachmentListItemStatus>('default');
  statusLabel = input('');
  readonly = input(false, { transform: booleanAttribute });
  actions = input<readonly OrbitAttachmentListItemAction[]>([]);

  actionTriggered = output<OrbitAttachmentListItemAction>();

  triggerAction(action: OrbitAttachmentListItemAction): void {
    if (!action.disabled) this.actionTriggered.emit(action);
  }
}
