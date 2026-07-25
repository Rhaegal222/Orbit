import { ComponentFixture, TestBed } from '@angular/core/testing';
import { describe, expect, it, vi } from 'vitest';
import { OrbitToastComponent } from './toast.component';
import { ORBIT_TOAST_DATA, ORBIT_TOAST_REF } from '../../services/toast/toast.service';
import type { OrbitToastRef } from '../../services/toast/toast-ref';

function createFixture(
  data: { message: string; tone: 'success' | 'danger' | 'warning' | 'info'; dismissible: boolean },
  ref: Partial<OrbitToastRef> = {},
): ComponentFixture<OrbitToastComponent> {
  TestBed.resetTestingModule();
  TestBed.configureTestingModule({
    imports: [OrbitToastComponent],
    providers: [
      { provide: ORBIT_TOAST_DATA, useValue: data },
      { provide: ORBIT_TOAST_REF, useValue: ref },
    ],
  });
  const fixture = TestBed.createComponent(OrbitToastComponent);
  fixture.detectChanges();
  return fixture;
}

describe('OrbitToastComponent', () => {
  it('renders the message', () => {
    const fixture = createFixture({
      message: 'Operazione completata',
      tone: 'info',
      dismissible: false,
    });
    expect(fixture.nativeElement.textContent).toContain('Operazione completata');
  });

  it('uses role="alert" for the danger tone', () => {
    const fixture = createFixture({ message: 'Errore', tone: 'danger', dismissible: false });
    expect(fixture.nativeElement.getAttribute('role')).toBe('alert');
  });

  it.each(['success', 'warning', 'info'] as const)('uses role="status" for the %s tone', (tone) => {
    const fixture = createFixture({ message: 'Info', tone, dismissible: false });
    expect(fixture.nativeElement.getAttribute('role')).toBe('status');
  });

  it('shows the close button only when dismissible', () => {
    const dismissibleFixture = createFixture({ message: 'A', tone: 'info', dismissible: true });
    expect(dismissibleFixture.nativeElement.querySelector('.orbit-toast__close')).toBeTruthy();

    const nonDismissibleFixture = createFixture({ message: 'B', tone: 'info', dismissible: false });
    expect(nonDismissibleFixture.nativeElement.querySelector('.orbit-toast__close')).toBeNull();
  });

  it('calls ref.dismiss() when the close button is clicked', () => {
    const dismiss = vi.fn();
    const fixture = createFixture({ message: 'A', tone: 'info', dismissible: true }, { dismiss });
    (
      fixture.nativeElement.querySelector('.orbit-toast__close button') as HTMLButtonElement
    ).click();
    expect(dismiss).toHaveBeenCalledOnce();
  });

  it('pauses on mouseenter and resumes on mouseleave', () => {
    const pauseAutoDismiss = vi.fn();
    const resumeAutoDismiss = vi.fn();
    const fixture = createFixture(
      { message: 'A', tone: 'info', dismissible: false },
      { pauseAutoDismiss, resumeAutoDismiss },
    );

    fixture.nativeElement.dispatchEvent(new MouseEvent('mouseenter'));
    expect(pauseAutoDismiss).toHaveBeenCalledOnce();

    fixture.nativeElement.dispatchEvent(new MouseEvent('mouseleave'));
    expect(resumeAutoDismiss).toHaveBeenCalledOnce();
  });
});
