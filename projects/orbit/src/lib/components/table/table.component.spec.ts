import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';
import { OrbitTableComponent } from './table.component';

@Component({
  selector: 'test-host',
  imports: [OrbitTableComponent],
  template: `<orbit-table>
    <thead><tr><th>Nome</th></tr></thead>
    <tbody><tr><td>Mario Rossi</td></tr></tbody>
  </orbit-table>`,
})
class TestHostComponent {}

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
});
