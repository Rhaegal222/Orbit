import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';
import { OrbitTableComponent } from './table.component';

@Component({
  selector: 'test-host',
  imports: [OrbitTableComponent],
  template: `<orbit-table>
    <thead>
      <tr>
        <th>Nome</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>Mario Rossi</td>
      </tr>
    </tbody>
  </orbit-table>`,
})
class TestHostComponent {}

@Component({
  selector: 'test-host-variants',
  imports: [OrbitTableComponent],
  template: `<orbit-table [bordered]="bordered" [striped]="striped">
    <thead>
      <tr>
        <th>Nome</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>Mario Rossi</td>
      </tr>
    </tbody>
  </orbit-table>`,
})
class TestHostVariantsComponent {
  bordered = false;
  striped = false;
}

describe('OrbitTableComponent', () => {
  let fixture: ComponentFixture<TestHostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [TestHostComponent] }).compileComponents();
    fixture = TestBed.createComponent(TestHostComponent);
    fixture.detectChanges();
  });

  it('wraps projected thead/tbody in a real <table>', () => {
    const table = fixture.nativeElement.querySelector('table.orbit-table');
    expect(table).toBeTruthy();
    expect(table.querySelector('th').textContent).toBe('Nome');
    expect(table.querySelector('td').textContent).toBe('Mario Rossi');
  });

  it('has no bordered/striped class by default', () => {
    const table = fixture.nativeElement.querySelector('table.orbit-table');
    expect(table.classList.contains('orbit-table--bordered')).toBe(false);
    expect(table.classList.contains('orbit-table--striped')).toBe(false);
  });
});

describe('OrbitTableComponent variants', () => {
  let fixture: ComponentFixture<TestHostVariantsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostVariantsComponent],
    }).compileComponents();
    fixture = TestBed.createComponent(TestHostVariantsComponent);
  });

  it('applies orbit-table--bordered when bordered is true', () => {
    fixture.componentInstance.bordered = true;
    fixture.detectChanges();
    const table = fixture.nativeElement.querySelector('table.orbit-table');
    expect(table.classList.contains('orbit-table--bordered')).toBe(true);
  });

  it('applies orbit-table--striped when striped is true', () => {
    fixture.componentInstance.striped = true;
    fixture.detectChanges();
    const table = fixture.nativeElement.querySelector('table.orbit-table');
    expect(table.classList.contains('orbit-table--striped')).toBe(true);
  });
});
