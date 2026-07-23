import { InjectionToken } from '@angular/core';

/**
 * Minimal surface an accordion item needs from its parent accordion.
 * Kept in its own file so `accordion-item.component.ts` never imports
 * `accordion.component.ts` directly — `accordion.component.ts` needs a
 * value-level import of the item (for `contentChildren`), so the reverse
 * import would form a circular module dependency.
 */
export interface OrbitAccordionItemHandle {
  collapse(): void;
}

export interface OrbitAccordionController {
  isMulti(): boolean;
  notifyExpanded(item: OrbitAccordionItemHandle): void;
}

export const ORBIT_ACCORDION_CONTROLLER = new InjectionToken<OrbitAccordionController>(
  'ORBIT_ACCORDION_CONTROLLER',
);
