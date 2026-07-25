import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it } from 'vitest';
import { OrbitAlertComponent } from './alert.component';

@Component({
  selector: 'test-alert-host',
  standalone: true,
  imports: [OrbitAlertComponent],
  template: `<orbit-alert>Operazione riuscita</orbit-alert>`,
})
class TestAlertHostComponent {}

describe('OrbitAlertComponent', () => {
  let fixture: ComponentFixture<OrbitAlertComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrbitAlertComponent, TestAlertHostComponent],
    }).compileComponents();
    fixture = TestBed.createComponent(OrbitAlertComponent);
  });

  it('creates with the default info tone', () => {
    fixture.detectChanges();
    expect(fixture.nativeElement.classList.contains('orbit-alert--info')).toBe(true);
  });

  it('renders projected content', () => {
    const hostFixture = TestBed.createComponent(TestAlertHostComponent);
    hostFixture.detectChanges();
    expect(hostFixture.nativeElement.textContent).toContain('Operazione riuscita');
  });

  it.each([
    ['success', 'check'],
    ['danger', 'alert-circle'],
    ['warning', 'alert-triangle'],
    ['info', 'info'],
  ] as const)('shows the %s icon for the %s tone', (tone, expectedIcon) => {
    fixture.componentRef.setInput('tone', tone);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector(`orbit-icon`)).toBeTruthy();
    expect(fixture.componentInstance['icon']()).toBe(expectedIcon);
  });

  it('uses role="alert" for the danger tone and role="status" otherwise', () => {
    fixture.componentRef.setInput('tone', 'danger');
    fixture.detectChanges();
    expect(fixture.nativeElement.getAttribute('role')).toBe('alert');

    fixture.componentRef.setInput('tone', 'success');
    fixture.detectChanges();
    expect(fixture.nativeElement.getAttribute('role')).toBe('status');
  });

  it('shows the dismiss button only when dismissible is true', () => {
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.orbit-alert__close')).toBeNull();

    fixture.componentRef.setInput('dismissible', true);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.orbit-alert__close')).toBeTruthy();
  });

  it('emits dismissed when the close button is clicked, without hiding itself', () => {
    fixture.componentRef.setInput('dismissible', true);
    fixture.detectChanges();

    let emitted = false;
    fixture.componentInstance.dismissed.subscribe(() => (emitted = true));
    (
      fixture.nativeElement.querySelector('.orbit-alert__close button') as HTMLButtonElement
    ).click();

    expect(emitted).toBe(true);
    expect(fixture.nativeElement.classList.contains('orbit-alert')).toBe(true);
  });
});
