import { ComponentFixture, TestBed } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';
import { LayoutPageComponent } from './layout-page.component';

describe('LayoutPageComponent', () => {
  let fixture: ComponentFixture<LayoutPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LayoutPageComponent],
    }).compileComponents();
    fixture = TestBed.createComponent(LayoutPageComponent);
    fixture.detectChanges();
  });

  it('documents form-grid compositions alongside the layout primitives', () => {
    const grids = fixture.nativeElement.querySelectorAll('orbit-form-grid');

    expect(grids.length).toBe(4);
    expect(grids[0].querySelector('[primary]')).toBeTruthy();
    expect(grids[0].querySelector('[secondary]')).toBeTruthy();
    expect(grids[1].querySelectorAll('[orbitFormGridItem]').length).toBe(3);
    expect(grids[2].classList.contains('orbit-form-grid--single')).toBe(true);
    expect(grids[3].getAttribute('data-orbit-density')).toBe('compact');
  });
});
