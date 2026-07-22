import { Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';
import { OrbitTabComponent } from '../tab/tab.component';
import { OrbitTablistComponent } from './tablist.component';

@Component({
  selector: 'test-host',
  imports: [OrbitTablistComponent, OrbitTabComponent],
  template: `<orbit-tablist ariaLabel="Sezioni" (selectedChange)="active.set($event)">
    <orbit-tab value="a" label="A" [selected]="active() === 'a'" />
    <orbit-tab value="b" label="B" [selected]="active() === 'b'" disabled />
    <orbit-tab value="c" label="C" [selected]="active() === 'c'" />
  </orbit-tablist>`,
})
class TestHostComponent {
  active = signal('a');
}

describe('OrbitTablistComponent', () => {
  let fixture: ComponentFixture<TestHostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [TestHostComponent] }).compileComponents();
    fixture = TestBed.createComponent(TestHostComponent);
    fixture.detectChanges();
  });

  function tabs(): HTMLElement[] {
    return Array.from(fixture.nativeElement.querySelectorAll('[role="tab"]'));
  }

  it('renders a tablist with the given aria-label', () => {
    expect(fixture.nativeElement.querySelector('[role="tablist"]').getAttribute('aria-label')).toBe(
      'Sezioni',
    );
  });

  it('emits selectedChange and moves focus when a tab is clicked', () => {
    tabs()[2].click();
    fixture.detectChanges();
    expect(fixture.componentInstance.active()).toBe('c');
    expect(document.activeElement).toBe(tabs()[2]);
  });

  it('does not activate a disabled tab on click', () => {
    tabs()[1].click();
    fixture.detectChanges();
    expect(fixture.componentInstance.active()).toBe('a');
  });

  it('ArrowRight moves to the next enabled tab, skipping disabled ones', () => {
    tabs()[0].focus();
    tabs()[0].dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));
    fixture.detectChanges();
    expect(fixture.componentInstance.active()).toBe('c');
  });

  it('ArrowLeft from the first tab wraps to the last enabled tab', () => {
    tabs()[0].focus();
    tabs()[0].dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft', bubbles: true }));
    fixture.detectChanges();
    expect(fixture.componentInstance.active()).toBe('c');
  });

  it('End activates the last enabled tab, Home the first', () => {
    tabs()[0].focus();
    tabs()[0].dispatchEvent(new KeyboardEvent('keydown', { key: 'End', bubbles: true }));
    fixture.detectChanges();
    expect(fixture.componentInstance.active()).toBe('c');

    tabs()[2].focus();
    tabs()[2].dispatchEvent(new KeyboardEvent('keydown', { key: 'Home', bubbles: true }));
    fixture.detectChanges();
    expect(fixture.componentInstance.active()).toBe('a');
  });
});
