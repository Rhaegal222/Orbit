import { ComponentFixture, TestBed } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';
import { OrbitNavbarComponent } from './navbar.component';

describe('OrbitNavbarComponent', () => {
  let fixture: ComponentFixture<OrbitNavbarComponent>;
  let component: OrbitNavbarComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [OrbitNavbarComponent] }).compileComponents();
    fixture = TestBed.createComponent(OrbitNavbarComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('brand', 'Orbit');
    fixture.componentRef.setInput('activeId', 'overview');
    fixture.componentRef.setInput('items', [
      { id: 'overview', label: 'Panoramica', href: '/overview' },
      { id: 'settings', label: 'Configurazione', disabled: true },
    ]);
    fixture.detectChanges();
  });

  it('renders a labelled navigation with the active link', () => {
    const nav = fixture.nativeElement.querySelector('nav') as HTMLElement;
    const activeItem = fixture.nativeElement.querySelector('.orbit-navbar__item--active');

    expect(nav.getAttribute('aria-label')).toBe('Navigazione principale');
    expect(activeItem.getAttribute('aria-current')).toBe('page');
    expect(activeItem.getAttribute('href')).toBe('/overview');
  });

  it('emits the selected enabled item and keeps disabled items inactive', () => {
    const selected: string[] = [];
    component.itemSelected.subscribe((item) => selected.push(item.id));

    (fixture.nativeElement.querySelector('a.orbit-navbar__item') as HTMLAnchorElement).click();
    (fixture.nativeElement.querySelector('button.orbit-navbar__item') as HTMLButtonElement).click();

    expect(selected).toEqual(['overview']);
  });
});
