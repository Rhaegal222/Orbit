import { SharedResizeObserver } from '@angular/cdk/observers/private';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { describe, expect, it } from 'vitest';
import { MotionPageComponent } from './motion-page.component';

function configure(widthPx: number): ComponentFixture<MotionPageComponent> {
  TestBed.resetTestingModule();
  TestBed.configureTestingModule({
    imports: [MotionPageComponent],
    providers: [
      {
        provide: SharedResizeObserver,
        useValue: {
          observe: () => of([{ contentRect: { width: widthPx } }]),
        },
      },
    ],
  });
  const fixture = TestBed.createComponent(MotionPageComponent);
  fixture.detectChanges();
  return fixture;
}

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

  it('renders the pattern map as a single scrollable orbit-table (no desktop/mobile duplicate)', () => {
    const table = fixture.nativeElement.querySelector('orbit-table');
    expect(table).toBeTruthy();
    expect(fixture.nativeElement.querySelectorAll('orbit-table').length).toBe(1);
    expect(fixture.nativeElement.querySelectorAll('tbody tr[orbitTableRow]').length).toBe(5);
  });

  it('does not open the preview overlay on row tap when the table renders wide (desktop)', () => {
    const desktopFixture = configure(1024);
    const row = desktopFixture.nativeElement.querySelector(
      'tbody tr[orbitTableRow]',
    ) as HTMLElement;
    expect(row.classList).not.toContain('motion-page__row--tappable');

    row.click();
    desktopFixture.detectChanges();
    expect(document.querySelector('orbit-modal')).toBeNull();
  });

  it('opens the pattern preview overlay via OrbitDialogService when the table renders narrow (mobile-preview mockup)', () => {
    const mobileFixture = configure(360);
    const row = mobileFixture.nativeElement.querySelector('tbody tr[orbitTableRow]') as HTMLElement;
    expect(row.classList).toContain('motion-page__row--tappable');
    expect(mobileFixture.nativeElement.querySelector('.motion-page__pattern-action')).toBeTruthy();

    row.click();
    mobileFixture.detectChanges();

    const modal = document.querySelector('orbit-modal');
    expect(modal).toBeTruthy();
    expect(modal?.textContent).toContain('Overlay');

    const closeBackdrop = document.querySelector('.orbit-dialog-backdrop') as HTMLElement;
    closeBackdrop?.click();
  });
});
