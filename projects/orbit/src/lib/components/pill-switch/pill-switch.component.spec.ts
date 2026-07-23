import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { OrbitPillSwitchComponent, OrbitPillSwitchOption } from './pill-switch.component';

@Component({
  standalone: true,
  imports: [OrbitPillSwitchComponent],
  template: `<orbit-pill-switch [options]="options" [disabled]="disabled" />`,
})
class TestHostComponent {
  disabled = false;
  options: OrbitPillSwitchOption[] = [
    { label: 'Mensile', value: 'monthly' },
    { label: 'Annuale', value: 'yearly' },
    { label: 'Disabilitato', value: 'x', disabled: true },
  ];
}

describe('OrbitPillSwitchComponent', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let pillComponent: OrbitPillSwitchComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    fixture.detectChanges();
    pillComponent = fixture.debugElement.children[0].componentInstance;
  });

  it('creates', () => {
    expect(pillComponent).toBeTruthy();
  });

  it('renders all options', () => {
    const buttons = fixture.nativeElement.querySelectorAll('button');
    expect(buttons.length).toBe(3);
  });

  it('selects an option', () => {
    pillComponent.select(pillComponent.options()[0]);
    fixture.detectChanges();
    expect(pillComponent.selectedValue()).toBe('monthly');
  });

  it('emits valueChange', () => {
    let emitted: string | undefined;
    pillComponent.valueChange.subscribe((v) => (emitted = v as string));
    pillComponent.select(pillComponent.options()[1]);
    expect(emitted).toBe('yearly');
  });

  it('does not select disabled option', () => {
    pillComponent.select(pillComponent.options()[2]);
    expect(pillComponent.selectedValue()).toBeNull();
  });

  it('implements writeValue', () => {
    pillComponent.writeValue('yearly');
    expect(pillComponent.selectedValue()).toBe('yearly');
  });

  it('implements setDisabledState', () => {
    pillComponent.setDisabledState(true);
    expect(pillComponent.isDisabled()).toBe(true);
    pillComponent.select(pillComponent.options()[0]);
    expect(pillComponent.selectedValue()).toBeNull();
  });

  it('honours the public disabled input', () => {
    fixture.componentInstance.disabled = true;
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('button').disabled).toBe(true);
  });

  it('selects the next enabled option with ArrowRight', () => {
    pillComponent.select(pillComponent.options()[0]);
    pillComponent.onKeydown(new KeyboardEvent('keydown', { key: 'ArrowRight' }), 0);

    expect(pillComponent.selectedValue()).toBe('yearly');
  });

  it('does not re-select same value', () => {
    pillComponent.select(pillComponent.options()[0]);
    let emissionCount = 0;
    pillComponent.valueChange.subscribe(() => emissionCount++);
    pillComponent.select(pillComponent.options()[0]);
    expect(emissionCount).toBe(0);
  });
});
