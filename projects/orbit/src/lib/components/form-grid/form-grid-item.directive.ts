import { Directive, HostBinding, input } from '@angular/core';

type OrbitFormGridSpan = number | `${number}`;

function coerceSpan(value: OrbitFormGridSpan | undefined, fallback: number): number {
  const parsed = Number(value);

  if (!Number.isFinite(parsed)) {
    return fallback;
  }

  return Math.min(12, Math.max(1, Math.round(parsed)));
}

/** Places an element on the twelve-column Orbit form grid. */
@Directive({
  selector: '[orbitFormGridItem]',
  standalone: true,
})
export class OrbitFormGridItemDirective {
  /** Span on narrow screens. Breakpoint spans progressively override it. */
  span = input<OrbitFormGridSpan>(12);
  spanSm = input<OrbitFormGridSpan | undefined>(undefined);
  spanMd = input<OrbitFormGridSpan | undefined>(undefined);
  spanLg = input<OrbitFormGridSpan | undefined>(undefined);
  spanXl = input<OrbitFormGridSpan | undefined>(undefined);

  @HostBinding('class.orbit-form-grid__item')
  readonly itemClass = true;

  @HostBinding('style.--orbit-form-grid-span')
  get baseSpan(): string {
    return String(coerceSpan(this.span(), 12));
  }

  @HostBinding('style.--orbit-form-grid-span-sm')
  get smallSpan(): string | null {
    return this.spanSm() === undefined
      ? null
      : String(coerceSpan(this.spanSm(), coerceSpan(this.span(), 12)));
  }

  @HostBinding('style.--orbit-form-grid-span-md')
  get mediumSpan(): string | null {
    return this.spanMd() === undefined
      ? null
      : String(coerceSpan(this.spanMd(), coerceSpan(this.span(), 12)));
  }

  @HostBinding('style.--orbit-form-grid-span-lg')
  get largeSpan(): string | null {
    return this.spanLg() === undefined
      ? null
      : String(coerceSpan(this.spanLg(), coerceSpan(this.span(), 12)));
  }

  @HostBinding('style.--orbit-form-grid-span-xl')
  get extraLargeSpan(): string | null {
    return this.spanXl() === undefined
      ? null
      : String(coerceSpan(this.spanXl(), coerceSpan(this.span(), 12)));
  }
}
