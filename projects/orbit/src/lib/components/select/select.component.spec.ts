import { OverlayContainer } from '@angular/cdk/overlay';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { OrbitSelectComponent } from './select.component';

describe('OrbitSelectComponent', () => {
  let fixture: ComponentFixture<OrbitSelectComponent>;
  let component: OrbitSelectComponent;
  let overlayContainer: OverlayContainer;

  const OPTIONS = [
    { label: 'Italia', value: 'IT' },
    { label: 'Francia', value: 'FR' },
    { label: 'Germania', value: 'DE' },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrbitSelectComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(OrbitSelectComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('options', OPTIONS);
    fixture.detectChanges();
    overlayContainer = TestBed.inject(OverlayContainer);
  });

  afterEach(() => {
    overlayContainer.ngOnDestroy();
  });

  it('creates', () => {
    expect(component).toBeTruthy();
  });

  it('renders placeholder', () => {
    fixture.componentRef.setInput('placeholder', 'Scegli paese');
    fixture.detectChanges();
    const trigger = fixture.nativeElement.querySelector('button.orbit-select__trigger');
    expect(trigger?.textContent.trim()).toBe('Scegli paese');
  });

  it('opens dropdown on focus', () => {
    fixture.nativeElement.querySelector('.orbit-select__trigger').focus();
    expect(component.isOpen()).toBe(true);
  });

  it('closes dropdown when the toggle is pressed a second time', () => {
    component.onToggleClick();
    expect(component.isOpen()).toBe(true);

    component.onToggleClick();
    expect(component.isOpen()).toBe(false);
  });

  it('closes when interaction moves outside the select', () => {
    component.isOpen.set(true);
    component.onDocumentPointerDown(new PointerEvent('pointerdown'));
    expect(component.isOpen()).toBe(false);
  });

  it('renders options in a CDK overlay (not clipped by an ancestor) when open', () => {
    component.isOpen.set(true);
    fixture.detectChanges();
    const items = overlayContainer.getContainerElement().querySelectorAll('.orbit-select__option');
    expect(items.length).toBe(3);
  });

  it('copies the nearest Orbit theme scope to its CDK overlay', () => {
    fixture.nativeElement.setAttribute('data-orbit-theme', 'dark');
    component.isOpen.set(true);
    fixture.detectChanges();

    const menu = overlayContainer
      .getContainerElement()
      .querySelector('.orbit-select__menu') as HTMLElement;
    expect(menu.parentElement?.getAttribute('data-orbit-theme')).toBe('dark');
  });

  it('does not close when a pointerdown bubbles up from inside the overlay menu', () => {
    component.isOpen.set(true);
    fixture.detectChanges();
    const option = overlayContainer.getContainerElement().querySelector('.orbit-select__option') as HTMLElement;
    option.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true }));
    expect(component.isOpen()).toBe(true);
  });

  it('selects option and closes', () => {
    component.onOptionSelect(OPTIONS[1]);
    fixture.detectChanges();
    expect(component.selectedValue()).toBe('FR');
    expect(component.isOpen()).toBe(false);
    expect(component.inputText()).toBe('Francia');
  });

  it('marks the selected option in the overlay', () => {
    component.writeValue('FR');
    component.isOpen.set(true);
    fixture.detectChanges();

    const selectedOption = overlayContainer
      .getContainerElement()
      .querySelector('.orbit-select__option--selected') as HTMLElement;
    expect(selectedOption.textContent).toContain('Francia');
    expect(selectedOption.querySelector('.orbit-select__option-check')?.textContent).toBe('✓');
  });

  it('emits valueChange on select', () => {
    let emitted: string | undefined;
    component.valueChange.subscribe((v) => (emitted = v as string));
    component.onOptionSelect(OPTIONS[2]);
    expect(emitted).toBe('DE');
  });

  it('implements writeValue', () => {
    component.writeValue('IT');
    expect(component.selectedValue()).toBe('IT');
    expect(component.inputText()).toBe('Italia');
  });

  it('implements setDisabledState', () => {
    component.setDisabledState(true);
    expect(component.isDisabled()).toBe(true);
  });

  it('closes on Escape', () => {
    component.isOpen.set(true);
    const event = new KeyboardEvent('keydown', { key: 'Escape' });
    fixture.nativeElement.querySelector('.orbit-select__trigger').dispatchEvent(event);
    expect(component.isOpen()).toBe(false);
  });

  it('filters options when searchable', () => {
    fixture.componentRef.setInput('searchable', true);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('input')).toBeTruthy();
    component.onInputChange('ita');
    expect(component.filteredOptions.length).toBe(1);
    expect(component.filteredOptions[0].label).toBe('Italia');
  });

  it('does not select disabled option', () => {
    component.onOptionSelect({ label: 'X', value: 'x', disabled: true });
    expect(component.selectedValue()).toBeNull();
  });

  it('makes typing opt-in through searchable', () => {
    component.onInputChange('Fra');
    expect(component.queryText()).toBe('');

    fixture.componentRef.setInput('searchable', true);
    fixture.detectChanges();
    component.onInputChange('Fra');
    expect(component.queryText()).toBe('Fra');
  });
});
