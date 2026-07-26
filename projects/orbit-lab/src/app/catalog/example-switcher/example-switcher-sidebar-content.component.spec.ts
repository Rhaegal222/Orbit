import { OverlayContainer } from '@angular/cdk/overlay';
import { Component, inject } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { OrbitPanelService } from '@galileo/orbit';
import { LabExampleSwitcherSidebarContentComponent } from './example-switcher-sidebar-content.component';
import type { LabExampleSwitcherItem } from './example-switcher.types';

const ITEMS: readonly LabExampleSwitcherItem[] = [
  { value: 'portfolio', label: 'Portafoglio catalogo', badge: 'Tabella' },
  { value: 'dossier', label: 'Dossier prodotto', badge: 'Workspace' },
];

@Component({ selector: 'lab-test-host', standalone: true, template: '' })
class HostComponent {
  readonly panel = inject(OrbitPanelService);
}

describe('LabExampleSwitcherSidebarContentComponent', () => {
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

  it('renders one sidebar item per example with its badge', () => {
    fixture.componentInstance.panel.open(LabExampleSwitcherSidebarContentComponent, {
      side: 'left',
      size: 'sm',
      data: { items: ITEMS, selected: 'portfolio', onSelect },
    });

    const overlay = overlayContainer.getContainerElement();
    expect(overlay.textContent).toContain('Portafoglio catalogo');
    expect(overlay.textContent).toContain('Workspace');
  });

  it('emits the selected value and closes when an item is clicked', () => {
    fixture.componentInstance.panel.open(LabExampleSwitcherSidebarContentComponent, {
      side: 'left',
      size: 'sm',
      data: { items: ITEMS, selected: 'portfolio', onSelect },
    });

    const overlay = overlayContainer.getContainerElement();
    const dossierButton = [...overlay.querySelectorAll('button.orbit-sidebar__item')].find(
      (button) => button.textContent?.includes('Dossier prodotto'),
    ) as HTMLElement;
    dossierButton.click();
    fixture.detectChanges();

    expect(onSelect).toHaveBeenCalledWith('dossier');
    expect(overlay.querySelector('lab-example-switcher-sidebar-content')).toBeNull();
  });
});
