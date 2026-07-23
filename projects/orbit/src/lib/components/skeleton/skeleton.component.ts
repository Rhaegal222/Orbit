import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

export type OrbitSkeletonShape = 'text' | 'circle' | 'rect';

/**
 * Height of a single text row, derived from the body typography tokens rather
 * than a bare `1em`, so the default stays correct regardless of what
 * font-size the skeleton happens to inherit from its DOM position.
 */
const TEXT_ROW_HEIGHT = 'calc(var(--orbit-font-size-body) * var(--orbit-line-height-body))';

/**
 * Purely presentational loading placeholder. Stateless: the parent decides
 * when to render it instead of real content, typically via
 * `@if (loading()) { <orbit-skeleton ... /> } @else { ... }`.
 *
 * No `.html` template: like `OrbitDividerComponent`, the whole visual is the
 * host element itself, styled and shaped via host bindings + CSS classes.
 */
@Component({
  selector: 'orbit-skeleton',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '',
  styleUrl: './skeleton.component.css',
  host: {
    '[class.orbit-skeleton--text]': "shape() === 'text'",
    '[class.orbit-skeleton--circle]': "shape() === 'circle'",
    '[class.orbit-skeleton--rect]': "shape() === 'rect'",
    '[style.width]': 'width()',
    '[style.height]': 'resolvedHeight()',
    '[attr.aria-hidden]': 'true',
  },
})
export class OrbitSkeletonComponent {
  shape = input<OrbitSkeletonShape>('text');
  width = input<string>('100%');
  /** When unset, derived from `shape()` — see `resolvedHeight`. */
  height = input<string | undefined>(undefined);

  /**
   * Resolves the effective height. An explicit `height()` always wins.
   * Otherwise: `circle` defaults to `width()` (a bare width alone produces a
   * true circle); `text` and `rect` both default to one typography text-row
   * height — the spec only describes a default for `text`; `rect` (used for
   * generic image/block placeholders) is left to the caller to size via an
   * explicit `height` in the common case, but still needs *some* sane
   * default when omitted, so it reuses the same text-row height rather than
   * inventing a new arbitrary constant.
   */
  protected readonly resolvedHeight = computed(() => {
    const explicit = this.height();
    if (explicit) {
      return explicit;
    }
    if (this.shape() === 'circle') {
      return this.width();
    }
    return TEXT_ROW_HEIGHT;
  });
}
