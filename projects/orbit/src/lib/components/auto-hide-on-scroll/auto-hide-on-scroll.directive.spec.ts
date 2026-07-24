/**
 * @vitest-environment jsdom
 */
import { Component, ElementRef, viewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { OrbitAutoHideOnScrollDirective } from './auto-hide-on-scroll.directive';

@Component({
  standalone: true,
  imports: [OrbitAutoHideOnScrollDirective],
  template: `
    <div class="container" style="overflow-y: auto;">
      <div class="inner">
        <div class="toolbar" orbitAutoHideOnScroll>toolbar</div>
        <div class="content">content</div>
      </div>
    </div>
  `,
})
class HostComponent {
  container = viewChild.required<ElementRef<HTMLElement>>(ElementRef);
}

/** jsdom never computes real layout, so `scrollHeight`/`clientHeight` are always 0 unless a test
 * defines them explicitly — this is what makes the ancestor "scrollable" for the directive's own
 * `scrollHeight > clientHeight` check. */
function makeScrollable(el: HTMLElement, scrollHeight: number, clientHeight: number): void {
  Object.defineProperty(el, 'scrollHeight', { value: scrollHeight, configurable: true });
  Object.defineProperty(el, 'clientHeight', { value: clientHeight, configurable: true });
}

/** jsdom's own `matchMedia` stub always reports `matches: false` and never really evaluates the
 * query — this fake gives tests control over which breakpoint state is "current" and lets them
 * fire a `change` event to simulate a viewport resize. */
class FakeMediaQueryList extends EventTarget implements MediaQueryList {
  matches: boolean;
  readonly media = '';
  onchange = null;
  addListener(): void {}
  removeListener(): void {}

  constructor(matches: boolean) {
    super();
    this.matches = matches;
  }

  setMatches(matches: boolean): void {
    this.matches = matches;
    this.dispatchEvent(Object.assign(new Event('change'), { matches }));
  }
}

describe('OrbitAutoHideOnScrollDirective', () => {
  let fixture: ComponentFixture<HostComponent>;
  let container: HTMLElement;
  let toolbar: HTMLElement;
  let fakeMediaQueryList: FakeMediaQueryList;

  function setup(options: { belowBreakpoint: boolean; scrollable: boolean }): void {
    fakeMediaQueryList = new FakeMediaQueryList(options.belowBreakpoint);
    // Ensure window.matchMedia exists before spying on it
    if (!window.matchMedia) {
      Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: () => fakeMediaQueryList,
      });
    }
    vi.spyOn(window, 'matchMedia').mockReturnValue(fakeMediaQueryList as unknown as MediaQueryList);

    fixture = TestBed.createComponent(HostComponent);
    container = fixture.nativeElement.querySelector('.container');
    toolbar = fixture.nativeElement.querySelector('.toolbar');
    if (options.scrollable) {
      makeScrollable(container, 1000, 200);
    }
    fixture.detectChanges();
  }

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('does nothing when no scrollable ancestor exists', () => {
    setup({ belowBreakpoint: true, scrollable: false });
    expect(toolbar.style.transform).toBe('translateY(0)');
    expect(toolbar.getAttribute('aria-hidden')).toBeNull();
    expect(toolbar.hasAttribute('inert')).toBe(false);
  });

  it('does not attach a scroll listener above the md breakpoint', () => {
    setup({ belowBreakpoint: false, scrollable: true });
    const addEventListenerSpy = vi.spyOn(container, 'addEventListener');
    container.scrollTop = 500;
    container.dispatchEvent(new Event('scroll'));
    expect(addEventListenerSpy).not.toHaveBeenCalledWith(
      'scroll',
      expect.anything(),
      expect.anything(),
    );
    expect(toolbar.getAttribute('aria-hidden')).toBeNull();
  });

  it('attaches the listener and reacts to scroll once resized below the md breakpoint', async () => {
    setup({ belowBreakpoint: false, scrollable: true });
    fakeMediaQueryList.setMatches(true);

    container.scrollTop = 100;
    container.dispatchEvent(new Event('scroll'));
    await new Promise((resolve) => requestAnimationFrame(resolve));
    fixture.detectChanges();

    expect(toolbar.getAttribute('aria-hidden')).toBe('true');
  });

  it('hides after scrolling down past the 8px threshold', async () => {
    setup({ belowBreakpoint: true, scrollable: true });

    container.scrollTop = 20; // > 8px past the initial 0
    container.dispatchEvent(new Event('scroll'));
    await new Promise((resolve) => requestAnimationFrame(resolve));
    fixture.detectChanges();

    expect(toolbar.getAttribute('aria-hidden')).toBe('true');
    expect(toolbar.style.transform).toBe('translateY(-100%)');
    expect(toolbar.hasAttribute('inert')).toBe(true);
  });

  it('does not hide for a downward scroll at or under the 8px threshold', async () => {
    setup({ belowBreakpoint: true, scrollable: true });

    container.scrollTop = 5;
    container.dispatchEvent(new Event('scroll'));
    await new Promise((resolve) => requestAnimationFrame(resolve));
    fixture.detectChanges();

    expect(toolbar.getAttribute('aria-hidden')).toBeNull();
  });

  it('shows again immediately on any upward scroll', async () => {
    setup({ belowBreakpoint: true, scrollable: true });

    container.scrollTop = 50;
    container.dispatchEvent(new Event('scroll'));
    await new Promise((resolve) => requestAnimationFrame(resolve));
    fixture.detectChanges();
    expect(toolbar.getAttribute('aria-hidden')).toBe('true');
    expect(toolbar.hasAttribute('inert')).toBe(true);

    container.scrollTop = 49;
    container.dispatchEvent(new Event('scroll'));
    await new Promise((resolve) => requestAnimationFrame(resolve));
    fixture.detectChanges();

    expect(toolbar.getAttribute('aria-hidden')).toBeNull();
    expect(toolbar.style.transform).toBe('translateY(0)');
    expect(toolbar.hasAttribute('inert')).toBe(false);
  });

  it('is always visible when scrollTop returns to 0', async () => {
    setup({ belowBreakpoint: true, scrollable: true });

    container.scrollTop = 50;
    container.dispatchEvent(new Event('scroll'));
    await new Promise((resolve) => requestAnimationFrame(resolve));
    fixture.detectChanges();
    expect(toolbar.getAttribute('aria-hidden')).toBe('true');

    container.scrollTop = 0;
    container.dispatchEvent(new Event('scroll'));
    await new Promise((resolve) => requestAnimationFrame(resolve));
    fixture.detectChanges();

    expect(toolbar.getAttribute('aria-hidden')).toBeNull();
  });

  it('forces itself visible and detaches the listener when resized back above md', async () => {
    setup({ belowBreakpoint: true, scrollable: true });

    container.scrollTop = 50;
    container.dispatchEvent(new Event('scroll'));
    await new Promise((resolve) => requestAnimationFrame(resolve));
    fixture.detectChanges();
    expect(toolbar.getAttribute('aria-hidden')).toBe('true');

    fakeMediaQueryList.setMatches(false);
    fixture.detectChanges();
    expect(toolbar.getAttribute('aria-hidden')).toBeNull();

    const addEventListenerSpy = vi.spyOn(container, 'addEventListener');
    container.scrollTop = 100;
    container.dispatchEvent(new Event('scroll'));
    expect(addEventListenerSpy).not.toHaveBeenCalled();
  });

  it('removes its scroll and media-query listeners on destroy', async () => {
    setup({ belowBreakpoint: true, scrollable: true });
    const removeEventListenerSpy = vi.spyOn(container, 'removeEventListener');
    const mediaRemoveSpy = vi.spyOn(fakeMediaQueryList, 'removeEventListener');

    fixture.destroy();

    expect(removeEventListenerSpy).toHaveBeenCalledWith('scroll', expect.any(Function));
    expect(mediaRemoveSpy).toHaveBeenCalledWith('change', expect.any(Function));
  });
});
