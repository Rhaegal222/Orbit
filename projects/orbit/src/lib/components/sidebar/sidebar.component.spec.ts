import { Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';
import { OrbitSidebarComponent } from './sidebar.component';

@Component({
  selector: 'test-host',
  imports: [OrbitSidebarComponent],
  template: `
    <orbit-sidebar
      brand="Orbit"
      [sections]="[{ id: 'main', label: 'Principale', items: [{ id: 'home', label: 'Panoramica' }] }]"
      [collapsed]="collapsed()"
    >
      <input orbitSidebarSearch type="search" placeholder="Cerca" />
    </orbit-sidebar>
  `,
})
class TestHostComponent {
  collapsed = signal(false);
}

describe('OrbitSidebarComponent', () => {
  let fixture: ComponentFixture<OrbitSidebarComponent>;
  let component: OrbitSidebarComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [OrbitSidebarComponent] }).compileComponents();
    fixture = TestBed.createComponent(OrbitSidebarComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('brand', 'Orbit');
    fixture.componentRef.setInput('sections', [
      { id: 'main', label: 'Principale', items: [{ id: 'home', label: 'Panoramica', icon: 'home', badge: 3 }] },
    ]);
    fixture.detectChanges();
  });

  it('renders sections, icon items and badges', () => {
    expect(fixture.nativeElement.textContent).toContain('Principale');
    expect(fixture.nativeElement.querySelector('orbit-icon')).toBeTruthy();
    expect(fixture.nativeElement.querySelector('.orbit-sidebar__badge').textContent).toContain('3');
  });

  it('emits the typed selected item', () => {
    let selected = '';
    component.itemSelected.subscribe((item) => (selected = item.id));
    (fixture.nativeElement.querySelector('.orbit-sidebar__item') as HTMLButtonElement).click();
    expect(selected).toBe('home');
  });

  it('emits the requested collapsed state from the accessible toggle', () => {
    let collapsed: boolean | undefined;
    component.collapsedChange.subscribe((value) => (collapsed = value));
    (fixture.nativeElement.querySelector('.orbit-sidebar__toggle') as HTMLButtonElement).click();
    expect(collapsed).toBe(true);
  });
});

describe('OrbitSidebarComponent header search projection', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let host: TestHostComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [TestHostComponent] }).compileComponents();
    fixture = TestBed.createComponent(TestHostComponent);
    host = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('projects content into the header search slot', () => {
    const searchSlot = fixture.nativeElement.querySelector('.orbit-sidebar__header-search');
    expect(searchSlot).toBeTruthy();
    expect(searchSlot.querySelector('input[orbitSidebarSearch]')).toBeTruthy();
  });

  it('hides the header search slot when collapsed', async () => {
    host.collapsed.set(true);
    fixture.detectChanges();
    await fixture.whenStable();
    const searchSlot = fixture.nativeElement.querySelector('.orbit-sidebar__header-search');
    expect(getComputedStyle(searchSlot).display).toBe('none');
  });
});
