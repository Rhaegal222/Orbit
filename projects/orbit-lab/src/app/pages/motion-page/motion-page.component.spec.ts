import { ComponentFixture, TestBed } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';
import { MotionPageComponent } from './motion-page.component';

describe('MotionPageComponent', () => {
  let fixture: ComponentFixture<MotionPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MotionPageComponent],
    }).compileComponents();
    fixture = TestBed.createComponent(MotionPageComponent);
    fixture.detectChanges();
  });

  it('does not show a blocked banner (token drift resolved by Core)', () => {
    expect(fixture.nativeElement.querySelector('[data-blocked-banner]')).toBeNull();
  });

  it('documents all three motion tokens', () => {
    const text = fixture.nativeElement.textContent;
    expect(text).toContain('--orbit-motion-fast');
    expect(text).toContain('--orbit-motion-base');
    expect(text).toContain('--orbit-easing-standard');
  });

  it('renders a live button example', () => {
    expect(fixture.nativeElement.querySelector('orbit-button')).toBeTruthy();
  });

  it('alternates between playing and stopping a requested motion pattern', () => {
    expect(fixture.nativeElement.querySelector('.motion-page__pattern-demo')).toBeNull();

    const patternButton = [...fixture.nativeElement.querySelectorAll('orbit-button')].find(
      (button: HTMLElement) => button.textContent?.includes('Riproduci'),
    ) as HTMLElement;
    patternButton.querySelector('button')?.click();
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('.motion-page__pattern-demo')).toBeTruthy();
    expect(patternButton.textContent).toContain('Stop');

    patternButton.querySelector('button')?.click();
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('.motion-page__pattern-demo')).toBeNull();
    expect(patternButton.textContent).toContain('Riproduci');
  });

  it('renders a live selectable-tile example and toggles selection on click', () => {
    const tile = fixture.nativeElement.querySelector('orbit-selectable-tile');
    expect(tile).toBeTruthy();

    tile.querySelector('button').click();
    fixture.detectChanges();

    expect(fixture.componentInstance['tileSelected']()).toBe(true);
  });

  it('opens a dialog modal with pattern details when clicking the info button', () => {
    const infoButton = fixture.nativeElement.querySelector(
      '.motion-page__patterns--mobile orbit-icon-button[icon="info"]',
    ) as HTMLElement;
    expect(infoButton).toBeTruthy();

    infoButton.querySelector('button')?.click();
    fixture.detectChanges();

    const modal = document.querySelector('orbit-modal');
    expect(modal).toBeTruthy();
    expect(modal?.textContent).toContain('Dettagli: Overlay');

    const closeBtn = [
      ...((modal?.querySelectorAll('orbit-button') as unknown as HTMLElement[]) || []),
    ].find((btn) => btn.textContent?.includes('Chiudi')) as HTMLElement;
    closeBtn.querySelector('button')?.click();
    fixture.detectChanges();

    expect(document.querySelector('orbit-modal')).toBeNull();
  });
});
