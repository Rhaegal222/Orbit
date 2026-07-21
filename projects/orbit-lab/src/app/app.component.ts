import { Component } from '@angular/core';
import { OrbitButtonComponent } from '@galileo/orbit';

@Component({
  selector: 'lab-root',
  standalone: true,
  imports: [OrbitButtonComponent],
  template: `
    <div style="padding: 2rem; font-family: var(--orbit-font-sans)">
      <h1 style="font-size: var(--orbit-ref-font-size-xl); margin-bottom: 1rem;">Orbit Lab</h1>

      <section style="margin-bottom: 2rem;">
        <h2 style="font-size: var(--orbit-ref-font-size-lg); margin-bottom: 0.75rem;">Button</h2>

        <div style="display: flex; gap: 0.75rem; flex-wrap: wrap; align-items: center;">
          <orbit-button label="Salva" variant="solid" tone="primary" />
          <orbit-button label="Annulla" variant="outline" tone="neutral" />
          <orbit-button label="Elimina" variant="soft" tone="danger" />
          <orbit-button label="Reset" variant="flat" tone="neutral" />
          <orbit-button label="Conferma" variant="solid" tone="success" />
          <orbit-button label="Caricamento" variant="solid" tone="primary" [loading]="true" />
          <orbit-button label="Disabilitato" variant="solid" tone="primary" [disabled]="true" />
        </div>
      </section>

      <section>
        <h2 style="font-size: var(--orbit-ref-font-size-lg); margin-bottom: 0.75rem;">Token Check</h2>
        <p style="color: var(--orbit-text-secondary); font-size: var(--orbit-ref-font-size-sm);">
          Se vedi questo testo stilato, i token CSS funzionano.
        </p>
      </section>
    </div>
  `,
})
export class LabRootComponent {}
