import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  ElementRef,
  inject,
  input,
  output,
  signal,
  ViewChild,
} from '@angular/core';
import { ORBIT_I18N } from '../../i18n/orbit-i18n';

export interface OrbitFileDropEvent {
  files: File[];
  source: 'drop' | 'click';
}

@Component({
  selector: 'orbit-attachment-dropzone',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './attachment-dropzone.component.html',
  styleUrl: './attachment-dropzone.component.css',
  host: {
    '[class.orbit-drop--disabled]': 'isDisabled()',
  },
})
export class OrbitAttachmentDropzoneComponent {
  readonly i18n = inject(ORBIT_I18N);
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  accept = input('');
  multiple = input(true, { transform: booleanAttribute });
  maxSizeBytes = input(10 * 1024 * 1024);
  disabled = input(false, { transform: booleanAttribute });
  hint = input('');
  label = input('');
  error = input('');

  filesDropped = output<OrbitFileDropEvent>();
  fileError = output<string>();

  isDragOver = signal(false);
  isDisabled = signal(false);
  private readonly internalError = signal('');
  readonly visibleError = computed(() => this.error() || this.internalError());

  private dragCounter = 0;

  onDragEnter(event: DragEvent): void {
    event.preventDefault();
    this.dragCounter++;
    if (!this.disabled()) this.isDragOver.set(true);
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
  }

  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    this.dragCounter--;
    if (this.dragCounter === 0) this.isDragOver.set(false);
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    this.dragCounter = 0;
    this.isDragOver.set(false);
    if (this.disabled()) return;

    const files = Array.from(event.dataTransfer?.files ?? []);
    this.processFiles(files, 'drop');
  }

  onZoneClick(): void {
    if (this.disabled()) return;
    this.fileInput.nativeElement.click();
  }

  onZoneKeydown(event: KeyboardEvent): void {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      this.onZoneClick();
    }
  }

  onInputChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    const files = Array.from(input.files ?? []);
    this.processFiles(files, 'click');
    input.value = '';
  }

  private processFiles(files: File[], source: 'drop' | 'click'): void {
    const maxSize = this.maxSizeBytes();
    const oversized = files.find((f) => f.size > maxSize);
    if (oversized) {
      const error = `Il file "${oversized.name}" supera la dimensione massima di ${this.formatSize(maxSize)}`;
      this.internalError.set(error);
      this.fileError.emit(error);
      return;
    }
    this.internalError.set('');
    this.filesDropped.emit({ files, source });
  }

  formatSize(bytes: number): string {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }
}
