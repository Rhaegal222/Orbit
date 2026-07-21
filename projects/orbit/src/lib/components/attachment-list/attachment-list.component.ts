import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import {
  OrbitAttachmentListItemAction,
  OrbitAttachmentListItemComponent,
  OrbitAttachmentListItemStatus,
} from '../attachment-list-item/attachment-list-item.component';

export interface OrbitAttachmentListEntry {
  id: string;
  name: string;
  metadata?: string;
  status?: OrbitAttachmentListItemStatus;
  statusLabel?: string;
  readonly?: boolean;
  actions?: readonly OrbitAttachmentListItemAction[];
}

export interface OrbitAttachmentListActionEvent {
  entry: OrbitAttachmentListEntry;
  action: OrbitAttachmentListItemAction;
}

@Component({
  selector: 'orbit-attachment-list',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [OrbitAttachmentListItemComponent],
  templateUrl: './attachment-list.component.html',
  styleUrl: './attachment-list.component.css',
})
export class OrbitAttachmentListComponent {
  entries = input<readonly OrbitAttachmentListEntry[]>([]);
  ariaLabel = input('Elenco allegati');
  emptyLabel = input('');

  actionTriggered = output<OrbitAttachmentListActionEvent>();

  onAction(entry: OrbitAttachmentListEntry, action: OrbitAttachmentListItemAction): void {
    this.actionTriggered.emit({ entry, action });
  }
}
