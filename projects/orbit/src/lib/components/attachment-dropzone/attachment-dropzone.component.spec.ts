import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { OrbitAttachmentDropzoneComponent } from './attachment-dropzone.component';

describe('OrbitAttachmentDropzoneComponent', () => {
  let fixture: ComponentFixture<OrbitAttachmentDropzoneComponent>;
  let component: OrbitAttachmentDropzoneComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrbitAttachmentDropzoneComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(OrbitAttachmentDropzoneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('creates', () => {
    expect(component).toBeTruthy();
  });

  it('renders hint text', () => {
    expect(fixture.nativeElement.textContent).toContain('Trascina i file qui');
  });

  it('emits filesDropped on processFiles', () => {
    const file = new File(['test'], 'test.txt', { type: 'text/plain' });
    let emitted: any;
    component.filesDropped.subscribe((e) => (emitted = e));
    component['processFiles']([file], 'click');
    expect(emitted.files.length).toBe(1);
    expect(emitted.source).toBe('click');
  });

  it('emits fileError for oversized file', () => {
    const bigFile = new File(['x'.repeat(20 * 1024 * 1024)], 'big.pdf', {
      type: 'application/pdf',
    });
    let emittedError: string | undefined;
    component.fileError.subscribe((e) => (emittedError = e));
    component['processFiles']([bigFile], 'drop');
    expect(emittedError).toContain('supera la dimensione massima');
  });

  it('formats file size correctly', () => {
    expect(component.formatSize(500)).toBe('500 B');
    expect(component.formatSize(1024)).toBe('1.0 KB');
    expect(component.formatSize(1024 * 1024)).toBe('1.0 MB');
  });

  it('does not process files when disabled', () => {
    fixture.componentRef.setInput('disabled', true);
    fixture.detectChanges();
    let emitted = false;
    component.filesDropped.subscribe(() => (emitted = true));
    component.onDrop({ preventDefault: () => {}, dataTransfer: { files: [] } } as any);
    expect(emitted).toBe(false);
  });
});
