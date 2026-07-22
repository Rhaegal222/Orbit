import { ComponentFixture, TestBed } from '@angular/core/testing';
import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';
import { SkeletonPageComponent } from './skeleton-page.component';

describe('SkeletonPageComponent', () => {
  let fixture: ComponentFixture<SkeletonPageComponent>;

  beforeEach(async () => {
    vi.useFakeTimers();
    await TestBed.configureTestingModule({
      imports: [SkeletonPageComponent],
    }).compileComponents();
    fixture = TestBed.createComponent(SkeletonPageComponent);
    fixture.detectChanges();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('creates', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('renders the three static shape examples', () => {
    const skeletons = fixture.nativeElement.querySelectorAll('orbit-skeleton');
    // 3 static examples (text, circle, rect) + 2 per loading card while loading (3 cards).
    expect(skeletons.length).toBe(3 + 3 * 2);
  });

  it('shows skeletons instead of real content in the simulated-loading example before the timeout', () => {
    const loadingContainer = fixture.nativeElement.querySelector('[data-example="loading-cards"]');
    expect(loadingContainer.querySelectorAll('orbit-skeleton').length).toBe(6);
    expect(loadingContainer.querySelectorAll('h3').length).toBe(0);
  });

  it('replaces the skeletons with real card content once the simulated load completes', () => {
    vi.advanceTimersByTime(1800);
    fixture.detectChanges();

    const loadingContainer = fixture.nativeElement.querySelector('[data-example="loading-cards"]');
    expect(loadingContainer.querySelectorAll('orbit-skeleton').length).toBe(0);
    expect(loadingContainer.querySelectorAll('h3').length).toBe(3);
    expect(loadingContainer.textContent).toContain('Rilascio v2.4');
  });

  it('renders a copyable usage snippet', () => {
    const showCode = [
      ...fixture.nativeElement.querySelectorAll('.lab-example__actions button'),
    ].find((button) => button.textContent?.includes('Mostra codice')) as HTMLButtonElement;
    showCode.click();
    fixture.detectChanges();

    const snippet = fixture.nativeElement.querySelector('[data-code-block]');
    expect(snippet.textContent).toContain('<orbit-skeleton');
  });
});
