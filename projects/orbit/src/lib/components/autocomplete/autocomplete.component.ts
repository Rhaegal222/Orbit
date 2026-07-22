import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  ElementRef,
  forwardRef,
  inject,
  input,
  OnDestroy,
  output,
  signal,
  TemplateRef,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';
import { ORBIT_I18N } from '../../i18n/orbit-i18n';

export type OrbitAutocompleteValue = string | number;

export interface OrbitAutocompleteOption {
  label: string;
  value: OrbitAutocompleteValue;
  disabled?: boolean;
}

@Component({
  selector: 'orbit-autocomplete',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './autocomplete.component.html',
  styleUrl: './autocomplete.component.css',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => OrbitAutocompleteComponent),
      multi: true,
    },
  ],
  host: {
    '[class.orbit-ac--disabled]': 'isDisabled()',
    '[class.orbit-ac--invalid]': 'invalid()',
  },
})
export class OrbitAutocompleteComponent implements ControlValueAccessor, OnDestroy {
  readonly i18n = inject(ORBIT_I18N);
  private overlay = inject(Overlay);
  private vcr = inject(ViewContainerRef);
  private hostRef = inject(ElementRef<HTMLElement>);

  options = input<OrbitAutocompleteOption[]>([]);
  placeholder = input('');
  inputId = input('');
  required = input(false, { transform: booleanAttribute });
  invalid = input(false, { transform: booleanAttribute });
  debounceMs = input(200);

  optionSelected = output<OrbitAutocompleteOption>();
  searchChange = output<string>();

  @ViewChild('menuTemplate') private menuTemplate!: TemplateRef<unknown>;

  inputText = signal('');
  activeIndex = signal(-1);
  isOpen = signal(false);
  isDisabled = signal(false);
  query = signal('');

  private overlayRef: OverlayRef | null = null;
  private onChange: (value: OrbitAutocompleteValue | null) => void = () => undefined;
  private onTouched: () => void = () => undefined;
  private debounceTimer: ReturnType<typeof setTimeout> | null = null;

  filteredOptions = computed(() => {
    const q = this.query().toLocaleLowerCase('it-IT');
    if (!q) return this.options();
    return this.options().filter((o) =>
      o.label.toLocaleLowerCase('it-IT').includes(q),
    );
  });

  private readonly hasMenuContent = computed(
    () => this.filteredOptions().length > 0 || (this.filteredOptions().length === 0 && !!this.query()),
  );

  private overlaySyncEffect = effect(() => {
    if (this.isOpen() && !this.isDisabled() && this.hasMenuContent()) {
      this.attachOverlay();
    } else {
      this.detachOverlay();
    }
  });

  writeValue(val: OrbitAutocompleteValue | null): void {
    const match = this.options().find((o) => o.value === val);
    this.inputText.set(match?.label || '');
  }

  registerOnChange(fn: (value: OrbitAutocompleteValue | null) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.isDisabled.set(isDisabled);
  }

  onInput(event: Event): void {
    const text = (event.target as HTMLInputElement).value;
    this.inputText.set(text);
    this.activeIndex.set(-1);
    this.isOpen.set(true);

    if (this.debounceTimer) clearTimeout(this.debounceTimer);
    this.debounceTimer = setTimeout(() => {
      this.query.set(text);
      this.searchChange.emit(text);
    }, this.debounceMs());
  }

  onFocus(): void {
    this.isOpen.set(true);
  }

  onBlur(): void {
    this.onTouched();
    setTimeout(() => this.isOpen.set(false), 150);
  }

  onKeydown(event: KeyboardEvent): void {
    if (!this.isOpen()) return;

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        this.moveActive(1);
        break;
      case 'ArrowUp':
        event.preventDefault();
        this.moveActive(-1);
        break;
      case 'Enter':
        event.preventDefault();
        if (this.activeIndex() >= 0) {
          this.selectOption(this.filteredOptions()[this.activeIndex()]);
        }
        break;
      case 'Escape':
        this.isOpen.set(false);
        break;
    }
  }

  selectOption(option: OrbitAutocompleteOption): void {
    if (option.disabled) return;
    this.inputText.set(option.label);
    this.query.set(option.label);
    this.isOpen.set(false);
    this.onChange(option.value);
    this.onTouched();
    this.optionSelected.emit(option);
  }

  trackByValue(_: number, option: OrbitAutocompleteOption): OrbitAutocompleteValue {
    return option.value;
  }

  ngOnDestroy(): void {
    this.detachOverlay();
    if (this.debounceTimer) clearTimeout(this.debounceTimer);
  }

  private moveActive(direction: number): void {
    const opts = this.filteredOptions();
    if (!opts.length) return;
    let idx = this.activeIndex();
    for (let i = 0; i < opts.length; i++) {
      idx = (idx + direction + opts.length) % opts.length;
      if (!opts[idx].disabled) {
        this.activeIndex.set(idx);
        return;
      }
    }
  }

  private attachOverlay(): void {
    if (this.overlayRef) return;

    const triggerWidth = this.hostRef.nativeElement.getBoundingClientRect().width;
    const positionStrategy = this.overlay
      .position()
      .flexibleConnectedTo(this.hostRef)
      .withFlexibleDimensions(false)
      .withPush(false)
      .withPositions([
        { originX: 'start', originY: 'bottom', overlayX: 'start', overlayY: 'top', offsetY: 4 },
        { originX: 'start', originY: 'top', overlayX: 'start', overlayY: 'bottom', offsetY: -4 },
      ]);

    this.overlayRef = this.overlay.create({
      positionStrategy,
      width: triggerWidth,
      panelClass: 'orbit-ac-panel',
      scrollStrategy: this.overlay.scrollStrategies.reposition(),
    });

    const portal = new TemplatePortal(this.menuTemplate, this.vcr);
    this.overlayRef.attach(portal);
  }

  private detachOverlay(): void {
    if (!this.overlayRef) return;
    this.overlayRef.detach();
    this.overlayRef.dispose();
    this.overlayRef = null;
  }
}
