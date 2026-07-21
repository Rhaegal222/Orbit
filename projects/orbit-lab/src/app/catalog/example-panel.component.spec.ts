import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LabExampleComponent } from './example-panel.component';

describe('LabExampleComponent', () => {
  let fixture: ComponentFixture<LabExampleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LabExampleComponent],
    }).compileComponents();
    fixture = TestBed.createComponent(LabExampleComponent);
  });

  it('creates', () => {
    fixture.detectChanges();
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('does not render orbit-code-block when code is empty', () => {
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('orbit-code-block')).toBeNull();
  });

  it('renders orbit-code-block full width below the preview when code is set', () => {
    fixture.componentRef.setInput('code', '<orbit-button label="Salva" />');
    fixture.detectChanges();
    const codeBlock = fixture.nativeElement.querySelector('orbit-code-block');
    expect(codeBlock).toBeTruthy();
    expect(codeBlock.classList.contains('lab-example__code')).toBe(true);
  });

  it('projects preview content', () => {
    fixture.detectChanges();
    const preview = fixture.nativeElement.querySelector('.lab-example__preview');
    expect(preview).toBeTruthy();
  });
});
