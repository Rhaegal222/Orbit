import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OrbitBadgeComponent } from './badge.component';

describe('OrbitBadgeComponent', () => {
  let fixture: ComponentFixture<OrbitBadgeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrbitBadgeComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(OrbitBadgeComponent);
    fixture.detectChanges();
  });

  it('creates', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('renders label', () => {
    fixture.componentRef.setInput('label', 'Nuovo');
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.orbit-badge')?.textContent?.trim()).toBe('Nuovo');
  });

  it('defaults to neutral tone', () => {
    fixture.componentRef.setInput('label', 'Test');
    fixture.detectChanges();
    const badge = fixture.nativeElement.querySelector('.orbit-badge');
    expect(badge.classList.contains('orbit-badge--neutral')).toBe(true);
  });

  it('applies tone class', () => {
    fixture.componentRef.setInput('label', 'OK');
    fixture.componentRef.setInput('tone', 'success');
    fixture.detectChanges();
    const badge = fixture.nativeElement.querySelector('.orbit-badge');
    expect(badge.classList.contains('orbit-badge--success')).toBe(true);
  });

  it('renders all tones', () => {
    const tones = ['primary', 'success', 'danger', 'warning', 'info', 'neutral'] as const;
    for (const tone of tones) {
      fixture.componentRef.setInput('tone', tone);
      fixture.componentRef.setInput('label', tone);
      fixture.detectChanges();
      const badge = fixture.nativeElement.querySelector('.orbit-badge');
      expect(badge.classList.contains(`orbit-badge--${tone}`)).toBe(true);
    }
  });
});
