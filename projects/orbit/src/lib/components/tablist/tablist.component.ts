import { ChangeDetectionStrategy, Component, contentChildren, input, output } from '@angular/core';
import { OrbitTabComponent } from '../tab/tab.component';

@Component({
  selector: 'orbit-tablist',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ng-content />`,
  host: {
    role: 'tablist',
    '[attr.aria-label]': 'ariaLabel() || null',
    '(keydown)': 'onKeydown($event)',
    '(click)': 'onClick($event)',
  },
})
export class OrbitTablistComponent {
  ariaLabel = input('');
  selectedChange = output<string>();

  private readonly tabs = contentChildren(OrbitTabComponent);

  onClick(event: MouseEvent): void {
    const target = (event.target as HTMLElement).closest('[role="tab"]') as HTMLElement | null;
    if (!target) return;
    const index = this.tabs().findIndex((tab) => target.id === `orbit-tab-${tab.value()}`);
    if (index === -1) return;
    this.activateIndex(index);
  }

  onKeydown(event: KeyboardEvent): void {
    const components = this.tabs();
    if (!components.length) return;

    const currentIndex = components.findIndex(
      (tab) => document.activeElement?.id === `orbit-tab-${tab.value()}`,
    );

    let nextIndex: number | null = null;
    if (event.key === 'Home') nextIndex = this.firstEnabled(components, 0, 1);
    if (event.key === 'End') nextIndex = this.firstEnabled(components, components.length - 1, -1);
    if (event.key === 'ArrowLeft') nextIndex = this.step(components, currentIndex, -1);
    if (event.key === 'ArrowRight') nextIndex = this.step(components, currentIndex, 1);
    if (nextIndex === null) return;

    event.preventDefault();
    this.activateIndex(nextIndex);
  }

  private activateIndex(index: number): void {
    const component = this.tabs()[index];
    if (!component || component.disabled()) return;
    component.focus();
    this.selectedChange.emit(component.value());
  }

  private step(
    components: readonly OrbitTabComponent[],
    from: number,
    direction: number,
  ): number | null {
    if (!components.length) return null;
    let idx = from;
    for (let i = 0; i < components.length; i++) {
      idx = (idx + direction + components.length) % components.length;
      if (!components[idx].disabled()) return idx;
    }
    return null;
  }

  private firstEnabled(
    components: readonly OrbitTabComponent[],
    start: number,
    direction: number,
  ): number | null {
    let idx = start;
    for (let i = 0; i < components.length; i++) {
      if (!components[idx].disabled()) return idx;
      idx = (idx + direction + components.length) % components.length;
    }
    return null;
  }
}
