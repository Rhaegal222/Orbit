import { ComponentFixture, TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it } from 'vitest';
import { AlertPageComponent } from './alert-page.component';

describe('AlertPageComponent', () => {
  let fixture: ComponentFixture<AlertPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AlertPageComponent],
    }).compileComponents();
    fixture = TestBed.createComponent(AlertPageComponent);
    fixture.detectChanges();
  });

  it('creates', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('renders an alert for each tone', () => {
    const tones = ['success', 'danger', 'warning', 'info'];
    for (const tone of tones) {
      expect(
        fixture.nativeElement.querySelector(`[data-example="${tone}"] orbit-alert`),
      ).toBeTruthy();
    }
  });

  it('hides the dismissible example alert and shows it again on reset', () => {
    const dismissButton = fixture.nativeElement.querySelector(
      '[data-example="dismissible"] .orbit-alert__close button',
    ) as HTMLButtonElement;
    dismissButton.click();
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('[data-example="dismissible"] orbit-alert')).toBeNull();

    (fixture.nativeElement.querySelector('[data-example="dismissible-reset"] button') as HTMLButtonElement).click();
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('[data-example="dismissible"] orbit-alert')).toBeTruthy();
  });

  it('renders a copyable usage snippet', () => {
    const showCode = [
      ...fixture.nativeElement.querySelectorAll('.lab-example__actions button'),
    ].find((button) => button.textContent?.includes('Mostra codice')) as HTMLButtonElement;
    showCode.click();
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('[data-code-block]').textContent).toContain(
      '<orbit-alert',
    );
  });
});
