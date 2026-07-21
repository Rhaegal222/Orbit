import { booleanAttribute, ChangeDetectionStrategy, Component, input, signal } from '@angular/core';

let formSectionSequence = 0;

@Component({
  selector: 'orbit-form-section',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './form-section.component.html',
  styleUrl: './form-section.component.css',
  host: {
    '[class.orbit-form-section--fill]': 'fill()',
  },
})
export class OrbitFormSectionComponent {
  title = input('');
  /** Optional visual workflow index, for example 1 or "01". */
  index = input<string | number | null>(null);
  divided = input(false, { transform: booleanAttribute });
  fill = input(false, { transform: booleanAttribute });
  contentSpacing = input(false, { transform: booleanAttribute });
  collapsible = input(false, { transform: booleanAttribute });
  /** Overrides density for this section without changing its parent form. */
  density = input<'inherit' | 'comfortable' | 'compact'>('inherit');

  readonly collapsed = signal(false);
  readonly bodyId = `orbit-form-section-body-${++formSectionSequence}`;

  get labelledBy(): string | null {
    return this.title() || this.index() !== null ? `${this.bodyId}-title` : null;
  }

  toggle(): void {
    this.collapsed.update((collapsed) => !collapsed);
  }
}
