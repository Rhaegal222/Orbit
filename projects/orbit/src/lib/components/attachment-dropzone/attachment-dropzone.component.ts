import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  input,
  output,
  signal,
  ViewChild,
} from '@angular/core';

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
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  accept = input('');
  multiple = input(true, { transform: booleanAttribute });
  maxSizeBytes = input(10 * 1024 * 1024);
  disabled = input(false, { transform: booleanAttribute });
  hint = input('Trascina i file qui oppure clicca per sfogliare');

  filesDropped = output<OrbitFileDropEvent>();
  fileError = output<string>();

  isDragOver = signal(false);
  isDisabled = signal(false);

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
      this.fileError.emit(`Il file "${oversized.name}" supera la dimensione massima di ${this.formatSize(maxSize)}`);
      return;
    }
    this.filesDropped.emit({ files, source });
  }

  formatSize(bytes: number): string {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }
}
