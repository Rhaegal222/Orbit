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

  it('applies tone class to the nav element', () => {
    fixture.componentRef.setInput('tone', 'dark');
    fixture.detectChanges();

    const nav = fixture.nativeElement.querySelector('nav') as HTMLElement;
    expect(nav.classList.contains('orbit-navbar--dark')).toBe(true);
  });

  it('applies size class to the nav element', () => {
    fixture.componentRef.setInput('size', 'lg');
    fixture.detectChanges();

    const nav = fixture.nativeElement.querySelector('nav') as HTMLElement;
    expect(nav.classList.contains('orbit-navbar--lg')).toBe(true);
  });

  it('applies variant class to the nav element', () => {
    fixture.componentRef.setInput('variant', 'underline');
    fixture.detectChanges();

    const nav = fixture.nativeElement.querySelector('nav') as HTMLElement;
    expect(nav.classList.contains('orbit-navbar--underline')).toBe(true);
  });

  it('combines multiple modifier classes', () => {
    fixture.componentRef.setInput('tone', 'primary');
    fixture.componentRef.setInput('size', 'sm');
    fixture.componentRef.setInput('variant', 'pills');
    fixture.detectChanges();

    const nav = fixture.nativeElement.querySelector('nav') as HTMLElement;
    expect(nav.classList.contains('orbit-navbar--primary')).toBe(true);
    expect(nav.classList.contains('orbit-navbar--sm')).toBe(true);
    expect(nav.classList.contains('orbit-navbar--pills')).toBe(true);
  });

  it('applies no modifier classes for default tone, md size, filled variant', () => {
    const nav = fixture.nativeElement.querySelector('nav') as HTMLElement;
    const modifierClasses = Array.from(nav.classList).filter((c) => c.startsWith('orbit-navbar--'));
    expect(modifierClasses).toEqual([]);
  });

  it('applies center layout class', () => {
    fixture.componentRef.setInput('layout', 'center');
    fixture.componentRef.setInput('rightItems', [{ id: 'right', label: 'Destra' }]);
    fixture.detectChanges();

    const nav = fixture.nativeElement.querySelector('nav') as HTMLElement;
    expect(nav.classList.contains('orbit-navbar--center')).toBe(true);
  });

  it('renders left items in left list and right items in right list in center layout', () => {
    fixture.componentRef.setInput('layout', 'center');
    fixture.componentRef.setInput('rightItems', [{ id: 'contacts', label: 'Contatti' }]);
    fixture.detectChanges();

    const leftList = fixture.nativeElement.querySelector('.orbit-navbar__list--left');
    const rightList = fixture.nativeElement.querySelector('.orbit-navbar__list--right');
    const defaultList = fixture.nativeElement.querySelector(
      '.orbit-navbar__list:not([class*="--left"]):not([class*="--right"])',
    );

    expect(leftList).toBeTruthy();
    expect(rightList).toBeTruthy();
    expect(defaultList).toBeFalsy();
    expect(leftList.querySelectorAll('.orbit-navbar__item')).toHaveLength(2);
    expect(rightList.querySelectorAll('.orbit-navbar__item')).toHaveLength(1);
  });

  it('renders brand text between left and right lists in center layout', () => {
    fixture.componentRef.setInput('layout', 'center');
    fixture.componentRef.setInput('rightItems', []);
    fixture.detectChanges();

    const nav = fixture.nativeElement.querySelector('nav') as HTMLElement;
    const brand = nav.querySelector('.orbit-navbar__brand') as HTMLElement;
    const leftList = nav.querySelector('.orbit-navbar__list--left') as HTMLElement;

    expect(brand).toBeTruthy();
    expect(brand.textContent?.trim()).toBe('Orbit');
    expect(nav.contains(brand)).toBe(true);

    const children = Array.from(nav.children).filter(
      (el) => !el.classList.contains('orbit-navbar__actions'),
    );
    const brandIndex = children.indexOf(brand);
    const leftIndex = children.indexOf(leftList);
    expect(leftIndex).toBeLessThan(brandIndex);
  });

  it('renders default layout: brand, list, actions', () => {
    const nav = fixture.nativeElement.querySelector('nav') as HTMLElement;
    const brand = nav.querySelector('.orbit-navbar__brand');
    const list = nav.querySelector('.orbit-navbar__list');
    const actions = nav.querySelector('.orbit-navbar__actions');

    expect(brand).toBeTruthy();
    expect(list).toBeTruthy();
    expect(actions).toBeTruthy();

    const children = Array.from(nav.children);
    expect(children.indexOf(brand!)).toBeLessThan(children.indexOf(list!));
    expect(children.indexOf(list!)).toBeLessThan(children.indexOf(actions!));
  });
});
