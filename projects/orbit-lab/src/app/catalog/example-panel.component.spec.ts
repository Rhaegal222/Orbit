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

  it('renders top-right actions when code is set', () => {
    fixture.componentRef.setInput('code', '<orbit-button label="Salva" />');
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.lab-example__actions')).toBeTruthy();
    expect(fixture.nativeElement.querySelector('orbit-code-block')).toBeNull();
  });

  it('renders the source panel when the user expands the code', () => {
    fixture.componentRef.setInput('code', '<orbit-button label="Salva" />');
    fixture.componentInstance.toggleCode();
    fixture.detectChanges();
    const codeBlock = fixture.nativeElement.querySelector('orbit-code-block');
    expect(codeBlock).toBeTruthy();
    expect(codeBlock.classList.contains('lab-example__code')).toBe(true);
    expect(fixture.nativeElement.querySelector('.lab-example__source')).toBeTruthy();
  });

  it('projects preview content', () => {
    fixture.detectChanges();
    const preview = fixture.nativeElement.querySelector('.lab-example__preview');
    expect(preview).toBeTruthy();
  });

  it('enables a full-width projection wrapper when requested', () => {
    fixture.componentRef.setInput('fullWidth', true);
    fixture.detectChanges();

    expect(
      fixture.nativeElement
        .querySelector('.lab-example__content')
        .classList.contains('lab-example__content--full-width'),
    ).toBe(true);
  });
});
