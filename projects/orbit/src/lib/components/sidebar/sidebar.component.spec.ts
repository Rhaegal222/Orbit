import { ComponentFixture, TestBed } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';
import { OrbitSidebarComponent } from './sidebar.component';

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
