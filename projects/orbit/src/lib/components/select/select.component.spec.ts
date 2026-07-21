import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OrbitSelectComponent } from './select.component';

describe('OrbitSelectComponent', () => {
  let fixture: ComponentFixture<OrbitSelectComponent>;
  let component: OrbitSelectComponent;

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
  });

  it('creates', () => {
    expect(component).toBeTruthy();
  });

  it('renders placeholder', () => {
    fixture.componentRef.setInput('placeholder', 'Scegli paese');
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('input')?.getAttribute('placeholder')).toBe('Scegli paese');
  });

  it('opens dropdown on focus', () => {
    fixture.nativeElement.querySelector('input').focus();
    expect(component.isOpen()).toBe(true);
  });

  it('closes dropdown when the toggle is pressed a second time', () => {
    component.onToggleClick();
    expect(component.isOpen()).toBe(true);

    component.onToggleClick();
    expect(component.isOpen()).toBe(false);
  });

  it('renders options when open', () => {
    component.isOpen.set(true);
    fixture.detectChanges();
    const items = fixture.nativeElement.querySelectorAll('.orbit-select__option');
    expect(items.length).toBe(3);
  });

  it('selects option and closes', () => {
    component.onOptionSelect(OPTIONS[1]);
    fixture.detectChanges();
    expect(component.selectedValue()).toBe('FR');
    expect(component.isOpen()).toBe(false);
    expect(component.inputText()).toBe('Francia');
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
    fixture.nativeElement.querySelector('input').dispatchEvent(event);
    expect(component.isOpen()).toBe(false);
  });

  it('filters options when searchable', () => {
    fixture.componentRef.setInput('searchable', true);
    fixture.detectChanges();
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
