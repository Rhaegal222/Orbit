import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Component } from '@angular/core';
import { describe, expect, it, vi } from 'vitest';
import { OrbitSwitchComponent } from './switch.component';

@Component({
  imports: [OrbitSwitchComponent, ReactiveFormsModule],
  template: `<orbit-switch inputId="motion" ariaLabel="Animazioni" [formControl]="motion" />`,
})
class TestHostComponent {
  readonly motion = new FormControl(true, { nonNullable: true });
}

describe('OrbitSwitchComponent', () => {
  let fixture: ComponentFixture<TestHostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [TestHostComponent] }).compileComponents();
    fixture = TestBed.createComponent(TestHostComponent);
    fixture.detectChanges();
  });

  it('renders an accessible native switch bound to the form value', () => {
    const control = fixture.nativeElement.querySelector('input') as HTMLInputElement;

    expect(control.id).toBe('motion');
    expect(control.getAttribute('role')).toBe('switch');
    expect(control.getAttribute('aria-checked')).toBe('true');
    expect(control.checked).toBe(true);
  });

  it('updates the reactive form and emits checkedChange', () => {
    const switchComponent = fixture.debugElement.query(
      (debugElement) => debugElement.componentInstance instanceof OrbitSwitchComponent,
    ).componentInstance as OrbitSwitchComponent;
    const checkedChange = vi.fn();
    switchComponent.checkedChange.subscribe(checkedChange);
    const control = fixture.nativeElement.querySelector('input') as HTMLInputElement;

    control.checked = false;
    control.dispatchEvent(new Event('change'));
    fixture.detectChanges();

    expect(fixture.componentInstance.motion.value).toBe(false);
    expect(checkedChange).toHaveBeenCalledWith(false);
  });

  it('honours the disabled form-control state', () => {
    fixture.componentInstance.motion.disable();
    fixture.detectChanges();

    expect((fixture.nativeElement.querySelector('input') as HTMLInputElement).disabled).toBe(true);
  });
});
