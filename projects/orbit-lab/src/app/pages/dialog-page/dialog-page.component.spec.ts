import { OverlayContainer } from '@angular/cdk/overlay';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { afterEach, describe, expect, it } from 'vitest';
import { DialogPageComponent } from './dialog-page.component';

describe('DialogPageComponent', () => {
  let fixture: ComponentFixture<DialogPageComponent>;
  let overlayContainer: OverlayContainer;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DialogPageComponent],
    }).compileComponents();
    fixture = TestBed.createComponent(DialogPageComponent);
    fixture.detectChanges();
    overlayContainer = TestBed.inject(OverlayContainer);
  });

  afterEach(() => {
    overlayContainer.ngOnDestroy();
  });

  it('does not show a blocked banner (token drift resolved by Core)', () => {
    expect(fixture.nativeElement.querySelector('[data-blocked-banner]')).toBeNull();
  });

  it('opens a real orbit-confirm-dialog on the overlay and records the confirmed outcome', () => {
    const openButton = Array.from(
      fixture.nativeElement.querySelectorAll('orbit-button button'),
    ).find((btn) =>
      (btn as HTMLButtonElement).textContent?.includes('Elimina allegato'),
    ) as HTMLButtonElement;
    expect(openButton).toBeTruthy();
    openButton.click();
    fixture.detectChanges();

    const overlayEl = overlayContainer.getContainerElement();
    expect(overlayEl.querySelector('orbit-confirm-dialog')).toBeTruthy();

    const confirmButton = Array.from(overlayEl.querySelectorAll('orbit-button button')).find(
      (btn) => btn.textContent?.includes('Elimina'),
    ) as HTMLButtonElement;
    expect(confirmButton).toBeTruthy();

    confirmButton.click();
    fixture.detectChanges();

    expect(fixture.componentInstance['lastResult']()).toBe('confirmed');
    expect(overlayEl.querySelector('orbit-confirm-dialog')).toBeNull();
  });
});
