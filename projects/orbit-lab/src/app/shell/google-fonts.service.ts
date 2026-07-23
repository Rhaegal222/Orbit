import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { inject, Injectable, PLATFORM_ID } from '@angular/core';

/** A curated, license-friendly subset of the Google Fonts catalogue for the Lab. */
export const LAB_GOOGLE_FONTS = [
  { family: 'DM Sans', category: 'Sans serif' },
  { family: 'DM Serif Display', category: 'Serif' },
  { family: 'Figtree', category: 'Sans serif' },
  { family: 'Geist', category: 'Sans serif' },
  { family: 'IBM Plex Sans', category: 'Sans serif' },
  { family: 'Lato', category: 'Sans serif' },
  { family: 'Manrope', category: 'Sans serif' },
  { family: 'Merriweather', category: 'Serif' },
  { family: 'Montserrat', category: 'Sans serif' },
  { family: 'Noto Sans', category: 'Sans serif' },
  { family: 'Nunito Sans', category: 'Sans serif' },
  { family: 'Open Sans', category: 'Sans serif' },
  { family: 'Playfair Display', category: 'Serif' },
  { family: 'Plus Jakarta Sans', category: 'Sans serif' },
  { family: 'Poppins', category: 'Sans serif' },
  { family: 'Raleway', category: 'Sans serif' },
  { family: 'Roboto', category: 'Sans serif' },
  { family: 'Roboto Mono', category: 'Monospace' },
  { family: 'Source Sans 3', category: 'Sans serif' },
  { family: 'Space Grotesk', category: 'Sans serif' },
  { family: 'Work Sans', category: 'Sans serif' },
] as const;

export type LabGoogleFont = (typeof LAB_GOOGLE_FONTS)[number];

/** Loads a selected Google Font only in the browser, leaving SSR output untouched. */
@Injectable({ providedIn: 'root' })
export class LabGoogleFontsService {
  private readonly document = inject(DOCUMENT);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  load(family: string): void {
    if (!this.isBrowser) return;

    const id = `orbit-google-font-${family.toLowerCase().replaceAll(/[^a-z0-9]+/g, '-')}`;
    if (this.document.getElementById(id)) return;

    const link = this.document.createElement('link');
    link.id = id;
    link.rel = 'stylesheet';
    link.href = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(family).replaceAll('%20', '+')}:wght@400;500;600;700&display=swap`;
    this.document.head.append(link);
  }
}
