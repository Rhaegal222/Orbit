import { ComponentFixture, TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it } from 'vitest';
import { BannerPageComponent } from './banner-page.component';

describe('BannerPageComponent', () => {
  let fixture: ComponentFixture<BannerPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BannerPageComponent],
    }).compileComponents();
    fixture = TestBed.createComponent(BannerPageComponent);
    fixture.detectChanges();
  });

  it('creates', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('renders a banner for each tone', () => {
    const tones = ['success', 'danger', 'warning', 'info'];
    for (const tone of tones) {
      expect(
        fixture.nativeElement.querySelector(`[data-example="${tone}"] orbit-banner`),
      ).toBeTruthy();
    }
  });

  it('hides the dismissible example banner and shows it again on reset', () => {
    const dismissButton = fixture.nativeElement.querySelector(
      '[data-example="dismissible"] .orbit-banner__close button',
    ) as HTMLButtonElement;
    dismissButton.click();
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('[data-example="dismissible"] orbit-banner')).toBeNull();

    (fixture.nativeElement.querySelector('[data-example="dismissible-reset"] button') as HTMLButtonElement).click();
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('[data-example="dismissible"] orbit-banner')).toBeTruthy();
  });

  it('renders a copyable usage snippet', () => {
    const showCode = [
      ...fixture.nativeElement.querySelectorAll('.lab-example__actions button'),
    ].find((button) => button.textContent?.includes('Mostra codice')) as HTMLButtonElement;
    showCode.click();
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('[data-code-block]').textContent).toContain(
      '<orbit-banner',
    );
  });
});
