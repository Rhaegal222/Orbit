import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it } from 'vitest';
import { OrbitBannerComponent } from './banner.component';

@Component({
  selector: 'test-banner-host',
  standalone: true,
  imports: [OrbitBannerComponent],
  template: `<orbit-banner>Manutenzione programmata alle 22:00</orbit-banner>`,
})
class TestBannerHostComponent {}

describe('OrbitBannerComponent', () => {
  let fixture: ComponentFixture<OrbitBannerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrbitBannerComponent, TestBannerHostComponent],
    }).compileComponents();
    fixture = TestBed.createComponent(OrbitBannerComponent);
  });

  it('creates with the default info tone', () => {
    fixture.detectChanges();
    expect(fixture.nativeElement.classList.contains('orbit-banner--info')).toBe(true);
  });

  it('renders projected content', () => {
    const hostFixture = TestBed.createComponent(TestBannerHostComponent);
    hostFixture.detectChanges();
    expect(hostFixture.nativeElement.textContent).toContain('Manutenzione programmata alle 22:00');
  });

  it.each([
    ['success', 'check'],
    ['danger', 'alert-circle'],
    ['warning', 'alert-triangle'],
    ['info', 'info'],
  ] as const)('shows the %s icon for the %s tone', (tone, expectedIcon) => {
    fixture.componentRef.setInput('tone', tone);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('orbit-icon')).toBeTruthy();
    expect(fixture.componentInstance['icon']()).toBe(expectedIcon);
  });

  it('uses role="alert" for the danger tone and role="status" otherwise', () => {
    fixture.componentRef.setInput('tone', 'danger');
    fixture.detectChanges();
    expect(fixture.nativeElement.getAttribute('role')).toBe('alert');

    fixture.componentRef.setInput('tone', 'warning');
    fixture.detectChanges();
    expect(fixture.nativeElement.getAttribute('role')).toBe('status');
  });

  it('shows the dismiss button only when dismissible is true', () => {
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.orbit-banner__close')).toBeNull();

    fixture.componentRef.setInput('dismissible', true);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.orbit-banner__close')).toBeTruthy();
  });

  it('emits dismissed when the close button is clicked, without hiding itself', () => {
    fixture.componentRef.setInput('dismissible', true);
    fixture.detectChanges();

    let emitted = false;
    fixture.componentInstance.dismissed.subscribe(() => (emitted = true));
    (fixture.nativeElement.querySelector('.orbit-banner__close button') as HTMLButtonElement).click();

    expect(emitted).toBe(true);
    expect(fixture.nativeElement.classList.contains('orbit-banner')).toBe(true);
  });
});
