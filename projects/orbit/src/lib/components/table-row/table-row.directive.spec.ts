import { Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';
import { OrbitTableRowDirective } from './table-row.directive';

@Component({
  selector: 'test-host',
  imports: [OrbitTableRowDirective],
  template: `<table>
    <tbody>
      <tr orbitTableRow [disabled]="isDisabled()" (click)="clicked = true">
        <td>Riga</td>
      </tr>
    </tbody>
  </table>`,
})
class TestHostComponent {
  isDisabled = signal(false);
  clicked = false;
}

describe('OrbitTableRowDirective', () => {
  let fixture: ComponentFixture<TestHostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [TestHostComponent] }).compileComponents();
    fixture = TestBed.createComponent(TestHostComponent);
    fixture.detectChanges();
  });

  it('adds no disabled class/attribute by default', () => {
    const row = fixture.nativeElement.querySelector('tr');
    expect(row.classList.contains('orbit-table-row--disabled')).toBe(false);
    expect(row.getAttribute('aria-disabled')).toBeNull();
  });

  it('adds the disabled class and aria-disabled when disabled is true', () => {
    fixture.componentInstance.isDisabled.set(true);
    fixture.detectChanges();
    const row = fixture.nativeElement.querySelector('tr');
    expect(row.classList.contains('orbit-table-row--disabled')).toBe(true);
    expect(row.getAttribute('aria-disabled')).toBe('true');
  });

  it('does not suppress a native click handler the consumer attaches to the same row', () => {
    fixture.componentInstance.isDisabled.set(true);
    fixture.detectChanges();
    fixture.nativeElement.querySelector('tr').click();
    expect(fixture.componentInstance.clicked).toBe(true);
  });
});
