import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZonelessChangeDetection } from '@angular/core';
import { OVERLAY_DEFAULT_CONFIG, OverlayContainer } from '@angular/cdk/overlay';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { LabScopedOverlayContainer } from './shell/lab-mobile-preview-overlay-container';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZonelessChangeDetection(),
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    { provide: OverlayContainer, useClass: LabScopedOverlayContainer },
    /**
     * CDK 22 renders overlays through the native Popover API (`popover="manual"`) by default,
     * which paints them in the browser's top-layer — a stacking context that ignores every
     * ancestor's `transform`/`contain`/`filter`, so LabScopedOverlayContainer's phone-mockup
     * redirect (which relies on exactly that containment) would otherwise still paint full-
     * viewport. Disabling it falls back to the classic DOM-order/z-index overlay container,
     * which correctly respects the phone frame's containing block.
     */
    { provide: OVERLAY_DEFAULT_CONFIG, useValue: { usePopover: false } },
  ],
};
