import { Dialog } from '@angular/cdk/dialog';
import { OverlayContainer } from '@angular/cdk/overlay';
import { Component, inject } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { LabExampleSwitcherModalComponent } from './example-switcher-modal.component';
import type { LabExampleSwitcherItem } from './example-switcher.types';

const ITEMS: readonly LabExampleSwitcherItem[] = [
  { value: 'portfolio', label: 'Portafoglio catalogo', badge: 'Tabella' },
  { value: 'landing', label: 'Landing partner', badge: 'Landing' },
];

@Component({ selector: 'lab-test-host', standalone: true, template: '' })
class HostComponent {
  readonly dialog = inject(Dialog);
}

describe('LabExampleSwitcherModalComponent', () => {
  let fixture: ComponentFixture<HostComponent>;
  let overlayContainer: OverlayContainer;
  let onSelect: (value: string) => void;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [HostComponent] }).compileComponents();
    fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();
    overlayContainer = TestBed.inject(OverlayContainer);
    onSelect = vi.fn();
  });

  afterEach(() => {
    overlayContainer.ngOnDestroy();
  });

  it('renders one selectable tile per example, marking the current one selected', () => {
    fixture.componentInstance.dialog.open(LabExampleSwitcherModalComponent, {
      data: { items: ITEMS, selected: 'landing', onSelect },
    });
    fixture.detectChanges();

    const overlay = overlayContainer.getContainerElement();
    expect(overlay.textContent).toContain('Portafoglio catalogo');
    const selectedTile = overlay.querySelector('.orbit-selectable-tile--selected');
    expect(selectedTile?.textContent).toContain('Landing partner');
  });

  it('emits the selected value and closes when a tile is clicked', () => {
    fixture.componentInstance.dialog.open(LabExampleSwitcherModalComponent, {
      data: { items: ITEMS, selected: 'portfolio', onSelect },
    });
    fixture.detectChanges();

    const overlay = overlayContainer.getContainerElement();
    const landingTile = [...overlay.querySelectorAll('orbit-selectable-tile button')].find(
      (button) => button.textContent?.includes('Landing partner'),
    ) as HTMLElement;
    landingTile.click();
    fixture.detectChanges();

    expect(onSelect).toHaveBeenCalledWith('landing');
    expect(overlay.querySelector('lab-example-switcher-modal')).toBeNull();
  });
});
