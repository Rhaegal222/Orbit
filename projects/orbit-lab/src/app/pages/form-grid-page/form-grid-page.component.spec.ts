import { ComponentFixture, TestBed } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';
import { FormGridPageComponent } from './form-grid-page.component';

describe('FormGridPageComponent', () => {
  let fixture: ComponentFixture<FormGridPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormGridPageComponent],
    }).compileComponents();
    fixture = TestBed.createComponent(FormGridPageComponent);
    fixture.detectChanges();
  });

  it('does not show a blocked banner (token drift resolved by Core)', () => {
    expect(fixture.nativeElement.querySelector('[data-blocked-banner]')).toBeNull();
  });

  it('renders a real orbit-form-grid with primary and secondary content', () => {
    const grid = fixture.nativeElement.querySelector('orbit-form-grid');
    expect(grid.querySelector('[primary]')).toBeTruthy();
    expect(grid.querySelector('[secondary]')).toBeTruthy();
  });
});
