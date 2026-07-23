import { OverlayContainer } from '@angular/cdk/overlay';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { OrbitBreadcrumbComponent, OrbitBreadcrumbItem } from './breadcrumb.component';

describe('OrbitBreadcrumbComponent', () => {
  let fixture: ComponentFixture<OrbitBreadcrumbComponent>;
  let overlayContainer: OverlayContainer;

  const SHORT_ITEMS: OrbitBreadcrumbItem[] = [
    { id: 'home', label: 'Home', href: '/' },
    { id: 'section', label: 'Sezione', href: '/section' },
    { id: 'current', label: 'Pagina corrente' },
  ];

  const LONG_ITEMS: OrbitBreadcrumbItem[] = [
    { id: 'home', label: 'Home', href: '/' },
    { id: 'a', label: 'A', href: '/a' },
    { id: 'b', label: 'B', href: '/a/b' },
    { id: 'c', label: 'C', href: '/a/b/c' },
    { id: 'd', label: 'D', href: '/a/b/c/d' },
    { id: 'current', label: 'Pagina corrente' },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrbitBreadcrumbComponent],
    }).compileComponents();
    fixture = TestBed.createComponent(OrbitBreadcrumbComponent);
    overlayContainer = TestBed.inject(OverlayContainer);
  });

  afterEach(() => {
    overlayContainer.ngOnDestroy();
  });

  it('creates', () => {
    fixture.componentRef.setInput('items', SHORT_ITEMS);
    fixture.detectChanges();
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('renders nothing when items is empty', () => {
    fixture.componentRef.setInput('items', []);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('nav')).toBeNull();
  });

  it('does not collapse when at or below the threshold', () => {
    fixture.componentRef.setInput('items', SHORT_ITEMS);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelectorAll('.orbit-breadcrumb__ellipsis').length).toBe(0);
    expect(fixture.nativeElement.querySelectorAll('.orbit-breadcrumb__item').length).toBe(3);
  });

  it('collapses the middle items above the threshold', () => {
    fixture.componentRef.setInput('items', LONG_ITEMS);
    fixture.detectChanges();
    const rendered = fixture.nativeElement.querySelectorAll('.orbit-breadcrumb__item');
    expect(rendered.length).toBe(3);
    expect(fixture.nativeElement.querySelector('.orbit-breadcrumb__ellipsis')).toBeTruthy();
    expect(rendered[0].textContent).toContain('Home');
    expect(rendered[2].textContent).toContain('Pagina corrente');
  });

  it('renders the last item as a non-clickable current-page span', () => {
    fixture.componentRef.setInput('items', SHORT_ITEMS);
    fixture.detectChanges();
    const current = fixture.nativeElement.querySelector('[aria-current="page"]');
    expect(current.tagName).toBe('SPAN');
    expect(current.textContent.trim()).toBe('Pagina corrente');
  });

  it('emits itemSelected when a direct link is clicked', () => {
    fixture.componentRef.setInput('items', SHORT_ITEMS);
    fixture.detectChanges();
    let emitted: OrbitBreadcrumbItem | undefined;
    fixture.componentInstance.itemSelected.subscribe((item) => (emitted = item));
    fixture.nativeElement.querySelector('.orbit-breadcrumb__link').click();
    expect(emitted?.id).toBe('home');
  });

  it('opens a popover listing the hidden items when the ellipsis is clicked', () => {
    fixture.componentRef.setInput('items', LONG_ITEMS);
    fixture.detectChanges();
    fixture.nativeElement.querySelector('.orbit-breadcrumb__ellipsis').click();
    fixture.detectChanges();
    const popoverItems = overlayContainer
      .getContainerElement()
      .querySelectorAll('.orbit-breadcrumb__popover-item');
    expect(popoverItems.length).toBe(4);
    expect(popoverItems[0].textContent).toContain('A');
    expect(popoverItems[3].textContent).toContain('D');
  });

  it('emits itemSelected when a hidden item is chosen from the popover', () => {
    fixture.componentRef.setInput('items', LONG_ITEMS);
    fixture.detectChanges();
    let emitted: OrbitBreadcrumbItem | undefined;
    fixture.componentInstance.itemSelected.subscribe((item) => (emitted = item));
    fixture.nativeElement.querySelector('.orbit-breadcrumb__ellipsis').click();
    fixture.detectChanges();
    const popoverItem = overlayContainer
      .getContainerElement()
      .querySelector('.orbit-breadcrumb__popover-item') as HTMLElement;
    popoverItem.click();
    expect(emitted?.id).toBe('a');
  });
});
