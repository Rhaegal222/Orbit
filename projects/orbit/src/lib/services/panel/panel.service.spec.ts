import { Component, inject } from '@angular/core';
import { OverlayContainer } from '@angular/cdk/overlay';
import { TestBed } from '@angular/core/testing';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { ORBIT_PANEL_DATA, OrbitPanelService } from './panel.service';

@Component({
  selector: 'test-panel-content',
  template: `<p>{{ data }}</p>`,
})
class TestPanelContentComponent {
  data = inject(ORBIT_PANEL_DATA) as string;
}

describe('OrbitPanelService', () => {
  let service: OrbitPanelService;
  let overlayContainer: OverlayContainer;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OrbitPanelService);
    overlayContainer = TestBed.inject(OverlayContainer);
  });

  afterEach(() => {
    overlayContainer.ngOnDestroy();
  });

  it('attaches the given component to the overlay with the provided data, rendered immediately', () => {
    const ref = service.open(TestPanelContentComponent, { data: 'Ciao' });

    const overlayEl = overlayContainer.getContainerElement();
    expect(overlayEl.textContent).toContain('Ciao');
    expect(ref.componentInstance).toBeInstanceOf(TestPanelContentComponent);
  });

  it('anchors to the right by default and to the left when side is "left"', async () => {
    service.open(TestPanelContentComponent, { data: 'A' });
    await new Promise((resolve) => setTimeout(resolve, 0));
    let pane = overlayContainer
      .getContainerElement()
      .querySelector('.orbit-panel-pane') as HTMLElement;
    expect(pane.classList).toContain('orbit-panel--right');
    let wrapper = overlayContainer
      .getContainerElement()
      .querySelector('.cdk-global-overlay-wrapper') as HTMLElement;
    expect(wrapper.style.justifyContent).toBe('flex-end');
    service.closeAll();

    service.open(TestPanelContentComponent, { data: 'B', side: 'left' });
    await new Promise((resolve) => setTimeout(resolve, 0));
    pane = overlayContainer.getContainerElement().querySelector('.orbit-panel-pane') as HTMLElement;
    expect(pane.classList).toContain('orbit-panel--left');
    wrapper = overlayContainer
      .getContainerElement()
      .querySelector('.cdk-global-overlay-wrapper') as HTMLElement;
    expect(wrapper.style.justifyContent).toBe('flex-start');
  });

  it('closes and detaches on backdrop click', () => {
    service.open(TestPanelContentComponent, { data: 'A' });
    const backdrop = overlayContainer
      .getContainerElement()
      .querySelector('.cdk-overlay-backdrop') as HTMLElement;
    backdrop.click();

    expect(overlayContainer.getContainerElement().textContent).not.toContain('A');
  });

  it('does not close on backdrop click when disableClose is true', () => {
    service.open(TestPanelContentComponent, { data: 'A', disableClose: true });
    const backdrop = overlayContainer
      .getContainerElement()
      .querySelector('.cdk-overlay-backdrop') as HTMLElement;
    backdrop.click();

    expect(overlayContainer.getContainerElement().textContent).toContain('A');
    service.closeAll();
  });

  it('ref.close() detaches the panel', () => {
    const ref = service.open(TestPanelContentComponent, { data: 'A' });
    ref.close();
    expect(overlayContainer.getContainerElement().textContent).not.toContain('A');
  });

  it('applies the sm/md/lg/xl/wide width by default and honors minWidth/maxWidth', () => {
    service.open(TestPanelContentComponent, {
      data: 'A',
      size: 'lg',
      minWidth: '280px',
      maxWidth: '800px',
    });
    const pane = overlayContainer
      .getContainerElement()
      .querySelector('.orbit-panel-pane') as HTMLElement;
    expect(pane.style.width).toBe('600px');
    expect(pane.style.minWidth).toBe('280px');
    expect(pane.style.maxWidth).toBe('800px');
  });

  it('spans the full viewport width when fullWidth is true, ignoring maxWidth', () => {
    service.open(TestPanelContentComponent, { data: 'A', fullWidth: true, maxWidth: '800px' });
    const pane = overlayContainer
      .getContainerElement()
      .querySelector('.orbit-panel-pane') as HTMLElement;
    expect(pane.style.width).toBe('100vw');
    expect(pane.style.maxWidth).toBe('');
  });
});
