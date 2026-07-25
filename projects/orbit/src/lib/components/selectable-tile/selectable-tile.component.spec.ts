import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';
import { OrbitSelectableTileComponent } from './selectable-tile.component';

@Component({
  standalone: true,
  imports: [OrbitSelectableTileComponent],
  template: `<orbit-selectable-tile label="Opzione" [selected]="selected" />`,
})
class TestHostComponent {
  selected = false;
}

describe('OrbitSelectableTileComponent', () => {
  let fixture: ComponentFixture<TestHostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [TestHostComponent] }).compileComponents();
    fixture = TestBed.createComponent(TestHostComponent);
  });

  it('marks the indicator as selected so the pop-in animation applies', () => {
    fixture.componentInstance.selected = true;
    fixture.detectChanges();

    const indicator = fixture.nativeElement.querySelector('.orbit-selectable-tile__indicator');
    expect(indicator.closest('.orbit-selectable-tile--selected')).toBeTruthy();
  });
});
