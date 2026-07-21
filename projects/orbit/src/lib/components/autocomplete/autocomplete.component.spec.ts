import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OrbitAutocompleteComponent } from './autocomplete.component';

describe('OrbitAutocompleteComponent', () => {
  let fixture: ComponentFixture<OrbitAutocompleteComponent>;
  let component: OrbitAutocompleteComponent;

  const OPTIONS = [
    { label: 'Roma', value: 'RM' },
    { label: 'Milano', value: 'MI' },
    { label: 'Napoli', value: 'NA' },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrbitAutocompleteComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(OrbitAutocompleteComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('options', OPTIONS);
    fixture.detectChanges();
  });

  it('creates', () => {
    expect(component).toBeTruthy();
  });

  it('filters options by query', () => {
    component.query.set('rom');
    expect(component.filteredOptions().length).toBe(1);
    expect(component.filteredOptions()[0].label).toBe('Roma');
  });

  it('returns all options when query is empty', () => {
    component.query.set('');
    expect(component.filteredOptions().length).toBe(3);
  });

  it('implements writeValue', () => {
    component.writeValue('MI');
    expect(component.inputText()).toBe('Milano');
  });

  it('implements setDisabledState', () => {
    component.setDisabledState(true);
    expect(component.isDisabled()).toBe(true);
  });

  it('selects option', () => {
    let emitted: any;
    component.registerOnChange((v: any) => (emitted = v));
    component.selectOption(OPTIONS[1]);
    expect(emitted).toBe('MI');
    expect(component.inputText()).toBe('Milano');
    expect(component.isOpen()).toBe(false);
  });

  it('does not select disabled option', () => {
    component.selectOption({ label: 'X', value: 'x', disabled: true });
    expect(component.inputText()).toBe('');
  });

  it('emits optionSelected', () => {
    let emitted: any;
    component.optionSelected.subscribe((o) => (emitted = o));
    component.selectOption(OPTIONS[0]);
    expect(emitted.value).toBe('RM');
  });

  it('sets query on input', () => {
    component.onInput({ target: { value: 'nap' } } as any);
    expect(component.inputText()).toBe('nap');
  });
});
