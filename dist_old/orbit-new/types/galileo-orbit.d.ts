import * as _angular_core from '@angular/core';
import { OnDestroy, ElementRef, InjectionToken } from '@angular/core';
import { ControlValueAccessor } from '@angular/forms';
import { OverlayRef } from '@angular/cdk/overlay';
import { ComponentType } from '@angular/cdk/portal';

type OrbitButtonTone = 'primary' | 'success' | 'danger' | 'neutral';
type OrbitButtonVariant = 'solid' | 'soft' | 'outline' | 'flat';
declare class OrbitButtonComponent {
    label: _angular_core.InputSignal<string>;
    variant: _angular_core.InputSignal<OrbitButtonVariant>;
    tone: _angular_core.InputSignal<OrbitButtonTone>;
    type: _angular_core.InputSignal<"button" | "submit" | "reset">;
    disabled: _angular_core.InputSignalWithTransform<boolean, unknown>;
    loading: _angular_core.InputSignalWithTransform<boolean, unknown>;
    iconOnly: _angular_core.InputSignalWithTransform<boolean, unknown>;
    icon: _angular_core.InputSignal<string>;
    ariaLabel: _angular_core.InputSignal<string>;
    clicked: _angular_core.OutputEmitterRef<void>;
    onClick(): void;
    static ɵfac: _angular_core.ɵɵFactoryDeclaration<OrbitButtonComponent, never>;
    static ɵcmp: _angular_core.ɵɵComponentDeclaration<OrbitButtonComponent, "orbit-button", never, { "label": { "alias": "label"; "required": false; "isSignal": true; }; "variant": { "alias": "variant"; "required": false; "isSignal": true; }; "tone": { "alias": "tone"; "required": false; "isSignal": true; }; "type": { "alias": "type"; "required": false; "isSignal": true; }; "disabled": { "alias": "disabled"; "required": false; "isSignal": true; }; "loading": { "alias": "loading"; "required": false; "isSignal": true; }; "iconOnly": { "alias": "iconOnly"; "required": false; "isSignal": true; }; "icon": { "alias": "icon"; "required": false; "isSignal": true; }; "ariaLabel": { "alias": "ariaLabel"; "required": false; "isSignal": true; }; }, { "clicked": "clicked"; }, never, never, true, never>;
}

type OrbitIconButtonTone = 'primary' | 'neutral' | 'danger';
declare class OrbitIconButtonComponent {
    icon: _angular_core.InputSignal<string>;
    ariaLabel: _angular_core.InputSignal<string>;
    tone: _angular_core.InputSignal<OrbitIconButtonTone>;
    type: _angular_core.InputSignal<"button" | "submit" | "reset">;
    disabled: _angular_core.InputSignalWithTransform<boolean, unknown>;
    clicked: _angular_core.OutputEmitterRef<void>;
    onClick(): void;
    static ɵfac: _angular_core.ɵɵFactoryDeclaration<OrbitIconButtonComponent, never>;
    static ɵcmp: _angular_core.ɵɵComponentDeclaration<OrbitIconButtonComponent, "orbit-icon-button", never, { "icon": { "alias": "icon"; "required": false; "isSignal": true; }; "ariaLabel": { "alias": "ariaLabel"; "required": true; "isSignal": true; }; "tone": { "alias": "tone"; "required": false; "isSignal": true; }; "type": { "alias": "type"; "required": false; "isSignal": true; }; "disabled": { "alias": "disabled"; "required": false; "isSignal": true; }; }, { "clicked": "clicked"; }, never, ["*"], true, never>;
}

declare class OrbitDividerComponent {
    variant: _angular_core.InputSignal<"solid" | "dashed">;
    static ɵfac: _angular_core.ɵɵFactoryDeclaration<OrbitDividerComponent, never>;
    static ɵcmp: _angular_core.ɵɵComponentDeclaration<OrbitDividerComponent, "orbit-divider", never, { "variant": { "alias": "variant"; "required": false; "isSignal": true; }; }, {}, never, never, true, never>;
}

declare class OrbitSelectableTileComponent {
    label: _angular_core.InputSignal<string>;
    description: _angular_core.InputSignal<string>;
    selected: _angular_core.InputSignalWithTransform<boolean, unknown>;
    disabled: _angular_core.InputSignalWithTransform<boolean, unknown>;
    selectedChange: _angular_core.OutputEmitterRef<boolean>;
    toggle(): void;
    static ɵfac: _angular_core.ɵɵFactoryDeclaration<OrbitSelectableTileComponent, never>;
    static ɵcmp: _angular_core.ɵɵComponentDeclaration<OrbitSelectableTileComponent, "orbit-selectable-tile", never, { "label": { "alias": "label"; "required": true; "isSignal": true; }; "description": { "alias": "description"; "required": false; "isSignal": true; }; "selected": { "alias": "selected"; "required": false; "isSignal": true; }; "disabled": { "alias": "disabled"; "required": false; "isSignal": true; }; }, { "selectedChange": "selectedChange"; }, never, never, true, never>;
}

type OrbitBadgeTone = 'primary' | 'success' | 'danger' | 'warning' | 'info' | 'neutral';
declare class OrbitBadgeComponent {
    tone: _angular_core.InputSignal<OrbitBadgeTone>;
    label: _angular_core.InputSignal<string>;
    static ɵfac: _angular_core.ɵɵFactoryDeclaration<OrbitBadgeComponent, never>;
    static ɵcmp: _angular_core.ɵɵComponentDeclaration<OrbitBadgeComponent, "orbit-badge", never, { "tone": { "alias": "tone"; "required": false; "isSignal": true; }; "label": { "alias": "label"; "required": false; "isSignal": true; }; }, {}, never, ["*"], true, never>;
}

declare class OrbitCheckboxComponent implements ControlValueAccessor {
    label: _angular_core.InputSignal<string>;
    inputId: _angular_core.InputSignal<string>;
    disabled: _angular_core.InputSignalWithTransform<boolean, unknown>;
    required: _angular_core.InputSignalWithTransform<boolean, unknown>;
    checked: _angular_core.OutputEmitterRef<boolean>;
    isChecked: _angular_core.WritableSignal<boolean>;
    isDisabled: _angular_core.WritableSignal<boolean>;
    private onChange;
    private onTouched;
    writeValue(val: boolean): void;
    registerOnChange(fn: (value: boolean) => void): void;
    registerOnTouched(fn: () => void): void;
    setDisabledState(isDisabled: boolean): void;
    toggle(): void;
    onKeydown(event: KeyboardEvent): void;
    static ɵfac: _angular_core.ɵɵFactoryDeclaration<OrbitCheckboxComponent, never>;
    static ɵcmp: _angular_core.ɵɵComponentDeclaration<OrbitCheckboxComponent, "orbit-checkbox", never, { "label": { "alias": "label"; "required": false; "isSignal": true; }; "inputId": { "alias": "inputId"; "required": false; "isSignal": true; }; "disabled": { "alias": "disabled"; "required": false; "isSignal": true; }; "required": { "alias": "required"; "required": false; "isSignal": true; }; }, { "checked": "checked"; }, never, never, true, never>;
}

declare class OrbitFormFieldComponent {
    label: _angular_core.InputSignal<string>;
    inputId: _angular_core.InputSignal<string>;
    hint: _angular_core.InputSignal<string>;
    error: _angular_core.InputSignal<string>;
    required: _angular_core.InputSignalWithTransform<boolean, unknown>;
    disabled: _angular_core.InputSignalWithTransform<boolean, unknown>;
    static ɵfac: _angular_core.ɵɵFactoryDeclaration<OrbitFormFieldComponent, never>;
    static ɵcmp: _angular_core.ɵɵComponentDeclaration<OrbitFormFieldComponent, "orbit-form-field", never, { "label": { "alias": "label"; "required": false; "isSignal": true; }; "inputId": { "alias": "inputId"; "required": false; "isSignal": true; }; "hint": { "alias": "hint"; "required": false; "isSignal": true; }; "error": { "alias": "error"; "required": false; "isSignal": true; }; "required": { "alias": "required"; "required": false; "isSignal": true; }; "disabled": { "alias": "disabled"; "required": false; "isSignal": true; }; }, {}, never, ["*"], true, never>;
}

declare class OrbitFormGridComponent {
    /** Overrides density for this grid without changing the surrounding form. */
    density: _angular_core.InputSignal<"inherit" | "comfortable" | "compact">;
    static ɵfac: _angular_core.ɵɵFactoryDeclaration<OrbitFormGridComponent, never>;
    static ɵcmp: _angular_core.ɵɵComponentDeclaration<OrbitFormGridComponent, "orbit-form-grid", never, { "density": { "alias": "density"; "required": false; "isSignal": true; }; }, {}, never, ["*"], true, never>;
}

type OrbitFormGridSpan = number | `${number}`;
/** Places an element on the twelve-column Orbit form grid. */
declare class OrbitFormGridItemDirective {
    /** Span on narrow screens. Breakpoint spans progressively override it. */
    span: _angular_core.InputSignal<OrbitFormGridSpan>;
    spanSm: _angular_core.InputSignal<OrbitFormGridSpan | undefined>;
    spanMd: _angular_core.InputSignal<OrbitFormGridSpan | undefined>;
    spanLg: _angular_core.InputSignal<OrbitFormGridSpan | undefined>;
    spanXl: _angular_core.InputSignal<OrbitFormGridSpan | undefined>;
    readonly itemClass = true;
    get baseSpan(): string;
    get smallSpan(): string | null;
    get mediumSpan(): string | null;
    get largeSpan(): string | null;
    get extraLargeSpan(): string | null;
    static ɵfac: _angular_core.ɵɵFactoryDeclaration<OrbitFormGridItemDirective, never>;
    static ɵdir: _angular_core.ɵɵDirectiveDeclaration<OrbitFormGridItemDirective, "[orbitFormGridItem]", never, { "span": { "alias": "span"; "required": false; "isSignal": true; }; "spanSm": { "alias": "spanSm"; "required": false; "isSignal": true; }; "spanMd": { "alias": "spanMd"; "required": false; "isSignal": true; }; "spanLg": { "alias": "spanLg"; "required": false; "isSignal": true; }; "spanXl": { "alias": "spanXl"; "required": false; "isSignal": true; }; }, {}, never, never, true, never>;
}

declare class OrbitFormSectionComponent {
    title: _angular_core.InputSignal<string>;
    /** Optional visual workflow index, for example 1 or "01". */
    index: _angular_core.InputSignal<string | number | null>;
    divided: _angular_core.InputSignalWithTransform<boolean, unknown>;
    fill: _angular_core.InputSignalWithTransform<boolean, unknown>;
    contentSpacing: _angular_core.InputSignalWithTransform<boolean, unknown>;
    collapsible: _angular_core.InputSignalWithTransform<boolean, unknown>;
    /** Overrides density for this section without changing its parent form. */
    density: _angular_core.InputSignal<"inherit" | "comfortable" | "compact">;
    readonly collapsed: _angular_core.WritableSignal<boolean>;
    readonly bodyId: string;
    get labelledBy(): string | null;
    toggle(): void;
    static ɵfac: _angular_core.ɵɵFactoryDeclaration<OrbitFormSectionComponent, never>;
    static ɵcmp: _angular_core.ɵɵComponentDeclaration<OrbitFormSectionComponent, "orbit-form-section", never, { "title": { "alias": "title"; "required": false; "isSignal": true; }; "index": { "alias": "index"; "required": false; "isSignal": true; }; "divided": { "alias": "divided"; "required": false; "isSignal": true; }; "fill": { "alias": "fill"; "required": false; "isSignal": true; }; "contentSpacing": { "alias": "contentSpacing"; "required": false; "isSignal": true; }; "collapsible": { "alias": "collapsible"; "required": false; "isSignal": true; }; "density": { "alias": "density"; "required": false; "isSignal": true; }; }, {}, never, ["*"], true, never>;
}

type OrbitPillSwitchValue = string | number;
interface OrbitPillSwitchOption {
    label: string;
    value: OrbitPillSwitchValue;
    disabled?: boolean;
}
declare class OrbitPillSwitchComponent implements ControlValueAccessor {
    ariaLabel: _angular_core.InputSignal<string>;
    options: _angular_core.InputSignal<OrbitPillSwitchOption[]>;
    disabled: _angular_core.InputSignalWithTransform<boolean, unknown>;
    valueChange: _angular_core.OutputEmitterRef<OrbitPillSwitchValue>;
    selectedValue: _angular_core.WritableSignal<OrbitPillSwitchValue | null>;
    isDisabled: _angular_core.WritableSignal<boolean>;
    private onChange;
    private onTouched;
    writeValue(val: OrbitPillSwitchValue | null): void;
    registerOnChange(fn: (value: OrbitPillSwitchValue) => void): void;
    registerOnTouched(fn: () => void): void;
    setDisabledState(isDisabled: boolean): void;
    select(option: OrbitPillSwitchOption): void;
    trackByValue(_: number, option: OrbitPillSwitchOption): OrbitPillSwitchValue;
    static ɵfac: _angular_core.ɵɵFactoryDeclaration<OrbitPillSwitchComponent, never>;
    static ɵcmp: _angular_core.ɵɵComponentDeclaration<OrbitPillSwitchComponent, "orbit-pill-switch", never, { "ariaLabel": { "alias": "ariaLabel"; "required": false; "isSignal": true; }; "options": { "alias": "options"; "required": false; "isSignal": true; }; "disabled": { "alias": "disabled"; "required": false; "isSignal": true; }; }, { "valueChange": "valueChange"; }, never, never, true, never>;
}

type OrbitSelectValue = string | number;
interface OrbitSelectOption {
    label: string;
    value: OrbitSelectValue;
    disabled?: boolean;
}
declare class OrbitSelectComponent implements ControlValueAccessor {
    options: _angular_core.InputSignal<OrbitSelectOption[]>;
    placeholder: _angular_core.InputSignal<string>;
    inputId: _angular_core.InputSignal<string>;
    required: _angular_core.InputSignalWithTransform<boolean, unknown>;
    invalid: _angular_core.InputSignalWithTransform<boolean, unknown>;
    searchable: _angular_core.InputSignalWithTransform<boolean, unknown>;
    valueChange: _angular_core.OutputEmitterRef<OrbitSelectValue | null>;
    selectedValue: _angular_core.WritableSignal<OrbitSelectValue | null>;
    inputText: _angular_core.WritableSignal<string>;
    isOpen: _angular_core.WritableSignal<boolean>;
    queryText: _angular_core.WritableSignal<string>;
    activeIndex: _angular_core.WritableSignal<number>;
    isDisabled: _angular_core.WritableSignal<boolean>;
    private onChange;
    private onTouched;
    writeValue(val: OrbitSelectValue | null): void;
    registerOnChange(fn: (value: OrbitSelectValue | null) => void): void;
    registerOnTouched(fn: () => void): void;
    setDisabledState(isDisabled: boolean): void;
    get filteredOptions(): OrbitSelectOption[];
    onInputChange(text: string): void;
    onOptionSelect(option: OrbitSelectOption): void;
    onFocus(): void;
    onInputClick(): void;
    onToggleClick(): void;
    onBlur(): void;
    onKeydown(event: KeyboardEvent): void;
    trackByValue(_: number, option: OrbitSelectOption): OrbitSelectValue;
    private openAll;
    private moveActive;
    private setValue;
    private getOptionLabel;
    static ɵfac: _angular_core.ɵɵFactoryDeclaration<OrbitSelectComponent, never>;
    static ɵcmp: _angular_core.ɵɵComponentDeclaration<OrbitSelectComponent, "orbit-select", never, { "options": { "alias": "options"; "required": false; "isSignal": true; }; "placeholder": { "alias": "placeholder"; "required": false; "isSignal": true; }; "inputId": { "alias": "inputId"; "required": false; "isSignal": true; }; "required": { "alias": "required"; "required": false; "isSignal": true; }; "invalid": { "alias": "invalid"; "required": false; "isSignal": true; }; "searchable": { "alias": "searchable"; "required": false; "isSignal": true; }; }, { "valueChange": "valueChange"; }, never, never, true, never>;
}

type OrbitTextInputType = 'text' | 'email' | 'password' | 'number' | 'search' | 'tel' | 'url' | 'currency';
declare class OrbitTextInputComponent implements ControlValueAccessor {
    type: _angular_core.InputSignal<OrbitTextInputType>;
    placeholder: _angular_core.InputSignal<string>;
    inputId: _angular_core.InputSignal<string>;
    autocomplete: _angular_core.InputSignal<string>;
    required: _angular_core.InputSignalWithTransform<boolean, unknown>;
    invalid: _angular_core.InputSignalWithTransform<boolean, unknown>;
    leadingIcon: _angular_core.InputSignal<string>;
    trailingIcon: _angular_core.InputSignal<string>;
    trailingIconLabel: _angular_core.InputSignal<string>;
    currencySymbol: _angular_core.InputSignal<string>;
    blurred: _angular_core.OutputEmitterRef<void>;
    trailingIconClick: _angular_core.OutputEmitterRef<void>;
    value: _angular_core.WritableSignal<string>;
    showPassword: _angular_core.WritableSignal<boolean>;
    isDisabled: _angular_core.WritableSignal<boolean>;
    private onChange;
    private onTouched;
    writeValue(val: string | number | null): void;
    registerOnChange(fn: (value: string) => void): void;
    registerOnTouched(fn: () => void): void;
    setDisabledState(isDisabled: boolean): void;
    get nativeType(): string;
    get inputMode(): string;
    onInput(event: Event): void;
    onBlur(): void;
    togglePasswordVisibility(): void;
    private formatCurrency;
    static ɵfac: _angular_core.ɵɵFactoryDeclaration<OrbitTextInputComponent, never>;
    static ɵcmp: _angular_core.ɵɵComponentDeclaration<OrbitTextInputComponent, "orbit-text-input", never, { "type": { "alias": "type"; "required": false; "isSignal": true; }; "placeholder": { "alias": "placeholder"; "required": false; "isSignal": true; }; "inputId": { "alias": "inputId"; "required": false; "isSignal": true; }; "autocomplete": { "alias": "autocomplete"; "required": false; "isSignal": true; }; "required": { "alias": "required"; "required": false; "isSignal": true; }; "invalid": { "alias": "invalid"; "required": false; "isSignal": true; }; "leadingIcon": { "alias": "leadingIcon"; "required": false; "isSignal": true; }; "trailingIcon": { "alias": "trailingIcon"; "required": false; "isSignal": true; }; "trailingIconLabel": { "alias": "trailingIconLabel"; "required": false; "isSignal": true; }; "currencySymbol": { "alias": "currencySymbol"; "required": false; "isSignal": true; }; }, { "blurred": "blurred"; "trailingIconClick": "trailingIconClick"; }, never, never, true, never>;
}

type OrbitAutocompleteValue = string | number;
interface OrbitAutocompleteOption {
    label: string;
    value: OrbitAutocompleteValue;
    disabled?: boolean;
}
declare class OrbitAutocompleteComponent implements ControlValueAccessor, OnDestroy {
    private overlay;
    private vcr;
    private hostRef;
    options: _angular_core.InputSignal<OrbitAutocompleteOption[]>;
    placeholder: _angular_core.InputSignal<string>;
    inputId: _angular_core.InputSignal<string>;
    required: _angular_core.InputSignalWithTransform<boolean, unknown>;
    invalid: _angular_core.InputSignalWithTransform<boolean, unknown>;
    debounceMs: _angular_core.InputSignal<number>;
    optionSelected: _angular_core.OutputEmitterRef<OrbitAutocompleteOption>;
    searchChange: _angular_core.OutputEmitterRef<string>;
    inputText: _angular_core.WritableSignal<string>;
    activeIndex: _angular_core.WritableSignal<number>;
    isOpen: _angular_core.WritableSignal<boolean>;
    isDisabled: _angular_core.WritableSignal<boolean>;
    query: _angular_core.WritableSignal<string>;
    private overlayRef;
    private onChange;
    private onTouched;
    private debounceTimer;
    filteredOptions: _angular_core.Signal<OrbitAutocompleteOption[]>;
    private closeEffect;
    writeValue(val: OrbitAutocompleteValue | null): void;
    registerOnChange(fn: (value: OrbitAutocompleteValue | null) => void): void;
    registerOnTouched(fn: () => void): void;
    setDisabledState(isDisabled: boolean): void;
    onInput(event: Event): void;
    onFocus(): void;
    onBlur(): void;
    onKeydown(event: KeyboardEvent): void;
    selectOption(option: OrbitAutocompleteOption): void;
    trackByValue(_: number, option: OrbitAutocompleteOption): OrbitAutocompleteValue;
    ngOnDestroy(): void;
    private moveActive;
    private detachOverlay;
    static ɵfac: _angular_core.ɵɵFactoryDeclaration<OrbitAutocompleteComponent, never>;
    static ɵcmp: _angular_core.ɵɵComponentDeclaration<OrbitAutocompleteComponent, "orbit-autocomplete", never, { "options": { "alias": "options"; "required": false; "isSignal": true; }; "placeholder": { "alias": "placeholder"; "required": false; "isSignal": true; }; "inputId": { "alias": "inputId"; "required": false; "isSignal": true; }; "required": { "alias": "required"; "required": false; "isSignal": true; }; "invalid": { "alias": "invalid"; "required": false; "isSignal": true; }; "debounceMs": { "alias": "debounceMs"; "required": false; "isSignal": true; }; }, { "optionSelected": "optionSelected"; "searchChange": "searchChange"; }, never, never, true, never>;
}

interface CalendarDay {
    date: Date;
    day: number;
    currentMonth: boolean;
    today: boolean;
    selected: boolean;
    disabled: boolean;
}
declare class OrbitDatePickerComponent implements ControlValueAccessor {
    placeholder: _angular_core.InputSignal<string>;
    required: _angular_core.InputSignalWithTransform<boolean, unknown>;
    invalid: _angular_core.InputSignalWithTransform<boolean, unknown>;
    minDate: _angular_core.InputSignal<Date | null>;
    maxDate: _angular_core.InputSignal<Date | null>;
    weekStartsOn: _angular_core.InputSignal<0 | 1>;
    valueChange: _angular_core.OutputEmitterRef<Date | null>;
    isOpen: _angular_core.WritableSignal<boolean>;
    isDisabled: _angular_core.WritableSignal<boolean>;
    selectedDate: _angular_core.WritableSignal<Date | null>;
    viewMonth: _angular_core.WritableSignal<number>;
    viewYear: _angular_core.WritableSignal<number>;
    inputText: _angular_core.WritableSignal<string>;
    private onChange;
    private onTouched;
    readonly WEEKDAYS_IT: string[];
    readonly MONTHS_IT: string[];
    get calendarDays(): CalendarDay[];
    writeValue(val: Date | null): void;
    registerOnChange(fn: (value: Date | null) => void): void;
    registerOnTouched(fn: () => void): void;
    setDisabledState(isDisabled: boolean): void;
    toggle(): void;
    selectDay(day: CalendarDay): void;
    prevMonth(): void;
    nextMonth(): void;
    onInputChange(text: string): void;
    onInputBlur(): void;
    onInputFocus(): void;
    private formatDate;
    private parseDate;
    private makeDay;
    static ɵfac: _angular_core.ɵɵFactoryDeclaration<OrbitDatePickerComponent, never>;
    static ɵcmp: _angular_core.ɵɵComponentDeclaration<OrbitDatePickerComponent, "orbit-date-picker", never, { "placeholder": { "alias": "placeholder"; "required": false; "isSignal": true; }; "required": { "alias": "required"; "required": false; "isSignal": true; }; "invalid": { "alias": "invalid"; "required": false; "isSignal": true; }; "minDate": { "alias": "minDate"; "required": false; "isSignal": true; }; "maxDate": { "alias": "maxDate"; "required": false; "isSignal": true; }; "weekStartsOn": { "alias": "weekStartsOn"; "required": false; "isSignal": true; }; }, { "valueChange": "valueChange"; }, never, never, true, never>;
}

interface OrbitTimeValue {
    hours: number;
    minutes: number;
}
declare class OrbitTimePickerComponent implements ControlValueAccessor {
    required: _angular_core.InputSignalWithTransform<boolean, unknown>;
    invalid: _angular_core.InputSignalWithTransform<boolean, unknown>;
    stepMinutes: _angular_core.InputSignal<number>;
    valueChange: _angular_core.OutputEmitterRef<OrbitTimeValue | null>;
    isOpen: _angular_core.WritableSignal<boolean>;
    isDisabled: _angular_core.WritableSignal<boolean>;
    selectedHours: _angular_core.WritableSignal<number | null>;
    selectedMinutes: _angular_core.WritableSignal<number | null>;
    activeTab: _angular_core.WritableSignal<"hours" | "minutes">;
    private onChange;
    private onTouched;
    readonly hours: number[];
    minutes: _angular_core.Signal<number[]>;
    displayText: _angular_core.Signal<string>;
    writeValue(val: OrbitTimeValue | null): void;
    registerOnChange(fn: (value: OrbitTimeValue | null) => void): void;
    registerOnTouched(fn: () => void): void;
    setDisabledState(isDisabled: boolean): void;
    toggle(): void;
    selectHour(hour: number): void;
    selectMinute(minute: number): void;
    onInputBlur(): void;
    formatHour(h: number): string;
    formatMinute(m: number): string;
    static ɵfac: _angular_core.ɵɵFactoryDeclaration<OrbitTimePickerComponent, never>;
    static ɵcmp: _angular_core.ɵɵComponentDeclaration<OrbitTimePickerComponent, "orbit-time-picker", never, { "required": { "alias": "required"; "required": false; "isSignal": true; }; "invalid": { "alias": "invalid"; "required": false; "isSignal": true; }; "stepMinutes": { "alias": "stepMinutes"; "required": false; "isSignal": true; }; }, { "valueChange": "valueChange"; }, never, never, true, never>;
}

interface OrbitFileDropEvent {
    files: File[];
    source: 'drop' | 'click';
}
declare class OrbitAttachmentDropzoneComponent {
    fileInput: ElementRef<HTMLInputElement>;
    accept: _angular_core.InputSignal<string>;
    multiple: _angular_core.InputSignalWithTransform<boolean, unknown>;
    maxSizeBytes: _angular_core.InputSignal<number>;
    disabled: _angular_core.InputSignalWithTransform<boolean, unknown>;
    hint: _angular_core.InputSignal<string>;
    filesDropped: _angular_core.OutputEmitterRef<OrbitFileDropEvent>;
    fileError: _angular_core.OutputEmitterRef<string>;
    isDragOver: _angular_core.WritableSignal<boolean>;
    isDisabled: _angular_core.WritableSignal<boolean>;
    private dragCounter;
    onDragEnter(event: DragEvent): void;
    onDragOver(event: DragEvent): void;
    onDragLeave(event: DragEvent): void;
    onDrop(event: DragEvent): void;
    onZoneClick(): void;
    onInputChange(event: Event): void;
    private processFiles;
    formatSize(bytes: number): string;
    static ɵfac: _angular_core.ɵɵFactoryDeclaration<OrbitAttachmentDropzoneComponent, never>;
    static ɵcmp: _angular_core.ɵɵComponentDeclaration<OrbitAttachmentDropzoneComponent, "orbit-attachment-dropzone", never, { "accept": { "alias": "accept"; "required": false; "isSignal": true; }; "multiple": { "alias": "multiple"; "required": false; "isSignal": true; }; "maxSizeBytes": { "alias": "maxSizeBytes"; "required": false; "isSignal": true; }; "disabled": { "alias": "disabled"; "required": false; "isSignal": true; }; "hint": { "alias": "hint"; "required": false; "isSignal": true; }; }, { "filesDropped": "filesDropped"; "fileError": "fileError"; }, never, never, true, never>;
}

declare class OrbitModalHeaderComponent {
    title: _angular_core.InputSignal<string>;
    titleId: _angular_core.InputSignal<string>;
    subtitle: _angular_core.InputSignal<string>;
    variant: _angular_core.InputSignal<"default" | "form">;
    closable: _angular_core.InputSignalWithTransform<boolean, unknown>;
    loading: _angular_core.InputSignalWithTransform<boolean, unknown>;
    closeClicked: _angular_core.OutputEmitterRef<void>;
    onClose(): void;
    static ɵfac: _angular_core.ɵɵFactoryDeclaration<OrbitModalHeaderComponent, never>;
    static ɵcmp: _angular_core.ɵɵComponentDeclaration<OrbitModalHeaderComponent, "orbit-modal-header", never, { "title": { "alias": "title"; "required": false; "isSignal": true; }; "titleId": { "alias": "titleId"; "required": false; "isSignal": true; }; "subtitle": { "alias": "subtitle"; "required": false; "isSignal": true; }; "variant": { "alias": "variant"; "required": false; "isSignal": true; }; "closable": { "alias": "closable"; "required": false; "isSignal": true; }; "loading": { "alias": "loading"; "required": false; "isSignal": true; }; }, { "closeClicked": "closeClicked"; }, never, never, true, never>;
}

declare class OrbitModalBodyComponent {
    loading: _angular_core.InputSignalWithTransform<boolean, unknown>;
    loadingLabel: _angular_core.InputSignal<string>;
    loaderSmall: _angular_core.InputSignalWithTransform<boolean, unknown>;
    static ɵfac: _angular_core.ɵɵFactoryDeclaration<OrbitModalBodyComponent, never>;
    static ɵcmp: _angular_core.ɵɵComponentDeclaration<OrbitModalBodyComponent, "orbit-modal-body", never, { "loading": { "alias": "loading"; "required": false; "isSignal": true; }; "loadingLabel": { "alias": "loadingLabel"; "required": false; "isSignal": true; }; "loaderSmall": { "alias": "loaderSmall"; "required": false; "isSignal": true; }; }, {}, never, ["*"], true, never>;
}

declare class OrbitModalFooterComponent {
    variant: _angular_core.InputSignal<"default" | "form">;
    loading: _angular_core.InputSignalWithTransform<boolean, unknown>;
    static ɵfac: _angular_core.ɵɵFactoryDeclaration<OrbitModalFooterComponent, never>;
    static ɵcmp: _angular_core.ɵɵComponentDeclaration<OrbitModalFooterComponent, "orbit-modal-footer", never, { "variant": { "alias": "variant"; "required": false; "isSignal": true; }; "loading": { "alias": "loading"; "required": false; "isSignal": true; }; }, {}, never, ["*"], true, never>;
}

declare class OrbitFormActionBarComponent {
    confirmLabel: _angular_core.InputSignal<string>;
    draftLabel: _angular_core.InputSignal<string>;
    cancelLabel: _angular_core.InputSignal<string>;
    showCancel: _angular_core.InputSignalWithTransform<boolean, unknown>;
    showDraft: _angular_core.InputSignalWithTransform<boolean, unknown>;
    loading: _angular_core.InputSignalWithTransform<boolean, unknown>;
    confirmDisabled: _angular_core.InputSignalWithTransform<boolean, unknown>;
    confirmTone: _angular_core.InputSignal<OrbitButtonTone>;
    cancel: _angular_core.OutputEmitterRef<void>;
    saveDraft: _angular_core.OutputEmitterRef<void>;
    confirm: _angular_core.OutputEmitterRef<void>;
    static ɵfac: _angular_core.ɵɵFactoryDeclaration<OrbitFormActionBarComponent, never>;
    static ɵcmp: _angular_core.ɵɵComponentDeclaration<OrbitFormActionBarComponent, "orbit-form-action-bar", never, { "confirmLabel": { "alias": "confirmLabel"; "required": false; "isSignal": true; }; "draftLabel": { "alias": "draftLabel"; "required": false; "isSignal": true; }; "cancelLabel": { "alias": "cancelLabel"; "required": false; "isSignal": true; }; "showCancel": { "alias": "showCancel"; "required": false; "isSignal": true; }; "showDraft": { "alias": "showDraft"; "required": false; "isSignal": true; }; "loading": { "alias": "loading"; "required": false; "isSignal": true; }; "confirmDisabled": { "alias": "confirmDisabled"; "required": false; "isSignal": true; }; "confirmTone": { "alias": "confirmTone"; "required": false; "isSignal": true; }; }, { "cancel": "cancel"; "saveDraft": "saveDraft"; "confirm": "confirm"; }, never, never, true, never>;
}

declare class OrbitTooltipDirective implements OnDestroy {
    orbitTooltip: _angular_core.InputSignal<string>;
    orbitTooltipPosition: _angular_core.InputSignal<"top" | "bottom" | "left" | "right">;
    orbitTooltipDelay: _angular_core.InputSignal<number>;
    private overlay;
    private el;
    private renderer;
    private destroy$;
    private overlayRef;
    private showTimeout;
    private hideTimeout;
    tooltipId: string;
    constructor();
    show(): void;
    hide(): void;
    scheduleHide(): void;
    ngOnDestroy(): void;
    private attach;
    private detach;
    static ɵfac: _angular_core.ɵɵFactoryDeclaration<OrbitTooltipDirective, never>;
    static ɵdir: _angular_core.ɵɵDirectiveDeclaration<OrbitTooltipDirective, "[orbitTooltip]", ["orbitTooltip"], { "orbitTooltip": { "alias": "orbitTooltip"; "required": true; "isSignal": true; }; "orbitTooltipPosition": { "alias": "orbitTooltipPosition"; "required": false; "isSignal": true; }; "orbitTooltipDelay": { "alias": "orbitTooltipDelay"; "required": false; "isSignal": true; }; }, {}, never, never, true, never>;
}

declare class TooltipComponent {
    text: string;
    id: string;
    static ɵfac: _angular_core.ɵɵFactoryDeclaration<TooltipComponent, never>;
    static ɵcmp: _angular_core.ɵɵComponentDeclaration<TooltipComponent, "orbit-tooltip", never, {}, {}, never, never, true, never>;
}

declare class OrbitPopoverComponent implements OnDestroy {
    content: _angular_core.InputSignal<string>;
    position: _angular_core.InputSignal<"top" | "bottom" | "left" | "right">;
    closeOnBackdrop: _angular_core.InputSignalWithTransform<boolean, unknown>;
    closeOnEscape: _angular_core.InputSignalWithTransform<boolean, unknown>;
    opened: _angular_core.OutputEmitterRef<void>;
    closed: _angular_core.OutputEmitterRef<void>;
    isOpen: _angular_core.WritableSignal<boolean>;
    private overlay;
    private el;
    private renderer;
    private vcr;
    private overlayRef;
    private listeners;
    constructor();
    toggle(): void;
    open(): void;
    close(): void;
    ngOnDestroy(): void;
    static ɵfac: _angular_core.ɵɵFactoryDeclaration<OrbitPopoverComponent, never>;
    static ɵcmp: _angular_core.ɵɵComponentDeclaration<OrbitPopoverComponent, "orbit-popover", ["orbitPopover"], { "content": { "alias": "content"; "required": true; "isSignal": true; }; "position": { "alias": "position"; "required": false; "isSignal": true; }; "closeOnBackdrop": { "alias": "closeOnBackdrop"; "required": false; "isSignal": true; }; "closeOnEscape": { "alias": "closeOnEscape"; "required": false; "isSignal": true; }; }, { "opened": "opened"; "closed": "closed"; }, never, ["*"], true, never>;
}

interface OrbitDialogConfig<T = unknown> {
    data?: T;
    size?: 'sm' | 'md' | 'lg' | 'xl' | 'wide';
    disableClose?: boolean;
    panelClass?: string;
}
declare const ORBIT_DIALOG_DATA: InjectionToken<unknown>;
declare class OrbitDialogService {
    private overlay;
    private openDialogs;
    open<T>(component: ComponentType<T>, config?: OrbitDialogConfig): OrbitDialogRef;
    closeAll(): void;
    private close;
    static ɵfac: _angular_core.ɵɵFactoryDeclaration<OrbitDialogService, never>;
    static ɵprov: _angular_core.ɵɵInjectableDeclaration<OrbitDialogService>;
}
interface OrbitDialogRef {
    close: () => void;
    overlayRef: OverlayRef;
}

export { ORBIT_DIALOG_DATA, OrbitAttachmentDropzoneComponent, OrbitAutocompleteComponent, OrbitBadgeComponent, OrbitButtonComponent, OrbitCheckboxComponent, OrbitDatePickerComponent, OrbitDialogService, OrbitDividerComponent, OrbitFormActionBarComponent, OrbitFormFieldComponent, OrbitFormGridComponent, OrbitFormGridItemDirective, OrbitFormSectionComponent, OrbitIconButtonComponent, OrbitModalBodyComponent, OrbitModalFooterComponent, OrbitModalHeaderComponent, OrbitPillSwitchComponent, OrbitPopoverComponent, OrbitSelectComponent, OrbitSelectableTileComponent, OrbitTextInputComponent, OrbitTimePickerComponent, OrbitTooltipDirective, TooltipComponent };
export type { OrbitAutocompleteOption, OrbitAutocompleteValue, OrbitBadgeTone, OrbitButtonTone, OrbitButtonVariant, OrbitDialogConfig, OrbitDialogRef, OrbitFileDropEvent, OrbitIconButtonTone, OrbitPillSwitchOption, OrbitPillSwitchValue, OrbitSelectOption, OrbitSelectValue, OrbitTextInputType, OrbitTimeValue };
//# sourceMappingURL=galileo-orbit.d.ts.map
