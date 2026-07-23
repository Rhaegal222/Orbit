import { DialogRef, DIALOG_DATA } from '@angular/cdk/dialog';
import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { startWith } from 'rxjs';
import {
  OrbitButtonComponent,
  OrbitIconButtonComponent,
  OrbitModalBodyComponent,
  OrbitModalComponent,
  OrbitModalFooterComponent,
  OrbitModalHeaderComponent,
  OrbitTextInputComponent,
} from '@galileo/orbit';
import {
  LAB_GOOGLE_FONTS,
  LabGoogleFontsService,
  type LabGoogleFont,
} from './google-fonts.service';

export interface LabGoogleFontsDialogData {
  installedFonts: readonly string[];
  addFont: (font: LabGoogleFont) => void;
  theme: 'default' | 'dark';
  density: string;
  shape: string;
  textScale: string;
}

@Component({
  selector: 'lab-google-fonts-dialog',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    OrbitButtonComponent,
    OrbitIconButtonComponent,
    OrbitModalBodyComponent,
    OrbitModalComponent,
    OrbitModalFooterComponent,
    OrbitModalHeaderComponent,
    OrbitTextInputComponent,
    ReactiveFormsModule,
  ],
  host: {
    '[attr.data-orbit-theme]': 'data.theme === "dark" ? "dark" : null',
    '[attr.data-orbit-density]': 'data.density',
    '[attr.data-orbit-shape]': 'data.shape',
    '[style.--orbit-text-scale]': 'data.textScale',
  },
  template: `<orbit-modal labelledBy="google-fonts-title" size="xl">
    <orbit-modal-header
      titleId="google-fonts-title"
      title="Aggiungi Google Fonts"
      subtitle="Confronta le famiglie, poi aggiungi alla configurazione della preview."
      (closeClicked)="close()"
    />
    <orbit-modal-body>
      <div class="lab-google-fonts__content">
        <orbit-text-input
          inputId="google-font-search"
          type="search"
          placeholder="Cerca un font"
          ariaLabel="Cerca nella libreria Google Fonts"
          [formControl]="searchControl"
        />
        <p class="lab-google-fonts__hint">
          Se non trovi la famiglia desiderata, esplora il
          <a href="https://fonts.google.com" target="_blank" rel="noopener noreferrer"
            >catalogo Google Fonts</a
          >.
        </p>
        <div class="lab-google-fonts__list">
          @for (font of filteredFonts(); track font.family) {
            <article class="lab-google-fonts__item" [style.font-family]="fontStack(font.family)">
              <orbit-icon-button
                class="lab-google-fonts__add"
                [icon]="isInstalled(font.family) ? 'check' : 'download'"
                [ariaLabel]="addLabel(font.family)"
                tone="primary"
                [disabled]="isInstalled(font.family)"
                (clicked)="add(font)"
              />
              <div class="lab-google-fonts__preview" aria-hidden="true">Aa</div>
              <div class="lab-google-fonts__details">
                <h3>{{ font.family }}</h3>
                <p>{{ font.category }}</p>
              </div>
            </article>
          } @empty {
            <p class="lab-google-fonts__empty">Nessun font corrisponde alla ricerca.</p>
          }
        </div>
      </div>
    </orbit-modal-body>
    <orbit-modal-footer>
      <span orbitModalFooterLeft>Google Fonts · licenze open source</span>
      <span orbitModalFooterRight>
        <orbit-button label="Chiudi" variant="outline" tone="neutral" (clicked)="close()" />
      </span>
    </orbit-modal-footer>
  </orbit-modal>`,
  styleUrl: './google-fonts-dialog.component.css',
})
export class LabGoogleFontsDialogComponent {
  readonly data = inject(DIALOG_DATA) as LabGoogleFontsDialogData;
  readonly searchControl = new FormControl('', { nonNullable: true });
  private readonly installedFonts = signal(new Set(this.data.installedFonts));
  private readonly dialogRef = inject(DialogRef<LabGoogleFontsDialogComponent>);
  private readonly googleFonts = inject(LabGoogleFontsService);
  private readonly searchQuery = toSignal(
    this.searchControl.valueChanges.pipe(startWith(this.searchControl.value)),
    { initialValue: this.searchControl.value },
  );

  readonly filteredFonts = computed(() => {
    const query = this.searchQuery().trim().toLowerCase();
    return LAB_GOOGLE_FONTS.filter(
      (font) =>
        font.family.toLowerCase().includes(query) || font.category.toLowerCase().includes(query),
    );
  });

  constructor() {
    LAB_GOOGLE_FONTS.forEach((font) => this.googleFonts.load(font.family));
  }

  isInstalled(family: string): boolean {
    return this.installedFonts().has(family);
  }

  addLabel(family: string): string {
    return this.isInstalled(family) ? `${family} già aggiunto` : `Aggiungi ${family}`;
  }

  fontStack(family: string): string {
    return `'${family}', ui-sans-serif, system-ui, sans-serif`;
  }

  add(font: LabGoogleFont): void {
    if (this.isInstalled(font.family)) return;
    this.data.addFont(font);
    this.installedFonts.update((fonts) => new Set(fonts).add(font.family));
  }

  close(): void {
    this.dialogRef.close();
  }
}
