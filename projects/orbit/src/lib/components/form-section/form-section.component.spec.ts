import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OrbitFormSectionComponent } from './form-section.component';

describe('OrbitFormSectionComponent', () => {
  let fixture: ComponentFixture<OrbitFormSectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrbitFormSectionComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(OrbitFormSectionComponent);
    fixture.componentRef.setInput('title', 'Colori');
    fixture.componentRef.setInput('collapsible', true);
    fixture.detectChanges();
  });

  it('renders an expanded native toggle linked to its region', () => {
    const button = fixture.nativeElement.querySelector('button') as HTMLButtonElement;
    const body = fixture.nativeElement.querySelector('.orbit-form-section__body') as HTMLElement;

    expect(button.type).toBe('button');
    expect(button.getAttribute('aria-expanded')).toBe('true');
    expect(button.getAttribute('aria-controls')).toBe(body.id);
    expect(body.getAttribute('role')).toBe('region');
    expect(body.getAttribute('aria-hidden')).toBe('false');
    expect(body.classList).not.toContain('orbit-form-section__body--collapsed');
  });

  it('collapses and expands from the native button', () => {
    const button = fixture.nativeElement.querySelector('button') as HTMLButtonElement;
    const body = fixture.nativeElement.querySelector('.orbit-form-section__body') as HTMLElement;

    button.click();
    fixture.detectChanges();
    expect(button.getAttribute('aria-expanded')).toBe('false');
    expect(body.getAttribute('aria-hidden')).toBe('true');
    expect(body.classList).toContain('orbit-form-section__body--collapsed');

    button.click();
    fixture.detectChanges();
    expect(button.getAttribute('aria-expanded')).toBe('true');
    expect(body.getAttribute('aria-hidden')).toBe('false');
    expect(body.classList).not.toContain('orbit-form-section__body--collapsed');
  });

  it('preserves a non-interactive heading when not collapsible', () => {
    fixture.componentRef.setInput('collapsible', false);
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('button')).toBeNull();
    expect(fixture.nativeElement.querySelector('.orbit-form-section__body').getAttribute('aria-hidden')).toBe('false');
  });

  it('renders an optional workflow index and labels the collapsible region', () => {
    fixture.componentRef.setInput('index', '03');
    fixture.detectChanges();

    const title = fixture.nativeElement.querySelector('.orbit-form-section__title') as HTMLElement;
    const body = fixture.nativeElement.querySelector('.orbit-form-section__body') as HTMLElement;

    expect(title.textContent).toContain('03');
    expect(body.getAttribute('aria-labelledby')).toBe(title.id);
  });

  it('accepts an explicit density override', () => {
    fixture.componentRef.setInput('density', 'dense');
    fixture.detectChanges();
    expect(fixture.nativeElement.getAttribute('data-orbit-density')).toBe('dense');
  });
});
