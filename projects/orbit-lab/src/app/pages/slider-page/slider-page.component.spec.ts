import { ComponentFixture, TestBed } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';
import { SliderPageComponent } from './slider-page.component';

describe('SliderPageComponent', () => {
  let fixture: ComponentFixture<SliderPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SliderPageComponent],
    }).compileComponents();
    fixture = TestBed.createComponent(SliderPageComponent);
    fixture.detectChanges();
  });

  it('creates', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('shows the initial value in the base example', () => {
    const input = fixture.nativeElement.querySelector(
      '[data-example="base"] input',
    ) as HTMLInputElement;
    expect(input.value).toBe('50');
  });

  it('disables the native input in the disabled example via a disabled FormControl', () => {
    const input = fixture.nativeElement.querySelector(
      '[data-example="disabled"] input',
    ) as HTMLInputElement;
    expect(input.disabled).toBe(true);
  });

  it('applies the custom min, max and step in the stepped example', () => {
    const input = fixture.nativeElement.querySelector(
      '[data-example="stepped"] input',
    ) as HTMLInputElement;
    expect(input.min).toBe('0');
    expect(input.max).toBe('100');
    expect(input.step).toBe('25');
  });

  it('renders a copyable usage snippet', () => {
    expect(fixture.nativeElement.querySelector('[data-code-block]').textContent).toContain(
      '<orbit-slider',
    );
  });
});
