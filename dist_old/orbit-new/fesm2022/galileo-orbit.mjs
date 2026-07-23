import * as i0 from '@angular/core';
import { input, booleanAttribute, output, ChangeDetectionStrategy, Component, signal, forwardRef, HostBinding, Directive, inject, ViewContainerRef, ElementRef, computed, effect, ViewChild, Renderer2, InjectionToken, Injectable } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { Overlay } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { Subject, take, filter } from 'rxjs';
import { ESCAPE } from '@angular/cdk/keycodes';

class OrbitButtonComponent {
    constructor() {
        this.label = input('', /* @ts-ignore */
        ...(ngDevMode ? [{ debugName: "label" }] : /* istanbul ignore next */ []));
        this.variant = input('solid', /* @ts-ignore */
        ...(ngDevMode ? [{ debugName: "variant" }] : /* istanbul ignore next */ []));
        this.tone = input('primary', /* @ts-ignore */
        ...(ngDevMode ? [{ debugName: "tone" }] : /* istanbul ignore next */ []));
        this.type = input('button', /* @ts-ignore */
        ...(ngDevMode ? [{ debugName: "type" }] : /* istanbul ignore next */ []));
        this.disabled = input(false, { ...(ngDevMode ? { debugName: "disabled" } : /* istanbul ignore next */ {}), transform: booleanAttribute });
        this.loading = input(false, { ...(ngDevMode ? { debugName: "loading" } : /* istanbul ignore next */ {}), transform: booleanAttribute });
        this.iconOnly = input(false, { ...(ngDevMode ? { debugName: "iconOnly" } : /* istanbul ignore next */ {}), transform: booleanAttribute });
        this.icon = input('', /* @ts-ignore */
        ...(ngDevMode ? [{ debugName: "icon" }] : /* istanbul ignore next */ []));
        this.ariaLabel = input('', /* @ts-ignore */
        ...(ngDevMode ? [{ debugName: "ariaLabel" }] : /* istanbul ignore next */ []));
        this.clicked = output();
    }
    onClick() {
        if (!this.disabled() && !this.loading()) {
            this.clicked.emit();
        }
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "22.0.7", ngImport: i0, type: OrbitButtonComponent, deps: [], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "22.0.7", type: OrbitButtonComponent, isStandalone: true, selector: "orbit-button", inputs: { label: { classPropertyName: "label", publicName: "label", isSignal: true, isRequired: false, transformFunction: null }, variant: { classPropertyName: "variant", publicName: "variant", isSignal: true, isRequired: false, transformFunction: null }, tone: { classPropertyName: "tone", publicName: "tone", isSignal: true, isRequired: false, transformFunction: null }, type: { classPropertyName: "type", publicName: "type", isSignal: true, isRequired: false, transformFunction: null }, disabled: { classPropertyName: "disabled", publicName: "disabled", isSignal: true, isRequired: false, transformFunction: null }, loading: { classPropertyName: "loading", publicName: "loading", isSignal: true, isRequired: false, transformFunction: null }, iconOnly: { classPropertyName: "iconOnly", publicName: "iconOnly", isSignal: true, isRequired: false, transformFunction: null }, icon: { classPropertyName: "icon", publicName: "icon", isSignal: true, isRequired: false, transformFunction: null }, ariaLabel: { classPropertyName: "ariaLabel", publicName: "ariaLabel", isSignal: true, isRequired: false, transformFunction: null } }, outputs: { clicked: "clicked" }, host: { properties: { "class.orbit-button-host--icon-only": "iconOnly()" } }, ngImport: i0, template: "<button\n  [type]=\"type()\"\n  [attr.aria-label]=\"ariaLabel() || null\"\n  [disabled]=\"disabled() || loading()\"\n  class=\"orbit-btn\"\n  [class.orbit-btn--solid]=\"variant() === 'solid'\"\n  [class.orbit-btn--soft]=\"variant() === 'soft'\"\n  [class.orbit-btn--outline]=\"variant() === 'outline'\"\n  [class.orbit-btn--flat]=\"variant() === 'flat'\"\n  [class.orbit-btn--primary]=\"tone() === 'primary'\"\n  [class.orbit-btn--success]=\"tone() === 'success'\"\n  [class.orbit-btn--danger]=\"tone() === 'danger'\"\n  [class.orbit-btn--neutral]=\"tone() === 'neutral'\"\n  [class.orbit-btn--icon-only]=\"iconOnly()\"\n  [class.orbit-btn--loading]=\"loading()\"\n  (click)=\"onClick()\"\n>\n  @if (loading()) {\n    <span class=\"orbit-btn__spinner\" aria-hidden=\"true\"></span>\n  }\n  @if (!loading() && icon()) {\n    <span class=\"orbit-btn__icon\" [class]=\"icon()\" aria-hidden=\"true\"></span>\n  }\n  @if (label()) {\n    <span class=\"orbit-btn__label\">{{ label() }}</span>\n  }\n</button>\n", styles: [":host{display:inline-flex}.orbit-btn{display:inline-flex;align-items:center;justify-content:center;gap:.375rem;min-height:var(--orbit-control-height);padding:0 var(--orbit-control-padding-inline);border:1px solid transparent;border-radius:var(--orbit-radius-control);font-family:var(--orbit-font-sans);font-size:var(--orbit-font-size-body);font-weight:var(--orbit-font-weight-emphasis);line-height:1.2;letter-spacing:0;cursor:pointer;transition:background-color .15s ease,border-color .15s ease,color .15s ease,box-shadow .15s ease}.orbit-btn:focus-visible{outline:2px solid var(--orbit-action-primary-bg);outline-offset:2px;box-shadow:var(--orbit-focus-ring)}.orbit-btn:disabled{cursor:not-allowed;opacity:.6;pointer-events:none}.orbit-btn--primary{--btn-bg: var(--orbit-button-primary-bg);--btn-bg-hover: var(--orbit-button-primary-bg-hover);--btn-text: var(--orbit-button-primary-fg);--btn-border: var(--orbit-button-primary-bg);--btn-soft-bg: color-mix(in srgb, var(--orbit-action-primary-bg) 14%, var(--orbit-surface-default));--btn-soft-text: var(--orbit-action-primary-bg-hover);--btn-soft-border: color-mix(in srgb, var(--orbit-action-primary-bg) 28%, var(--orbit-surface-default))}.orbit-btn--success{--btn-bg: var(--orbit-status-success);--btn-bg-hover: color-mix(in srgb, var(--orbit-status-success) 82%, black);--btn-text: var(--orbit-text-inverse);--btn-border: var(--orbit-status-success);--btn-soft-bg: var(--orbit-status-success-subtle);--btn-soft-text: var(--orbit-status-success);--btn-soft-border: color-mix(in srgb, var(--orbit-status-success) 28%, var(--orbit-surface-default))}.orbit-btn--danger{--btn-bg: var(--orbit-status-danger);--btn-bg-hover: color-mix(in srgb, var(--orbit-status-danger) 82%, black);--btn-text: var(--orbit-text-inverse);--btn-border: var(--orbit-status-danger);--btn-soft-bg: var(--orbit-status-danger-subtle);--btn-soft-text: var(--orbit-status-danger);--btn-soft-border: color-mix(in srgb, var(--orbit-status-danger) 28%, var(--orbit-surface-default))}.orbit-btn--neutral{--btn-bg: var(--orbit-text-primary);--btn-bg-hover: color-mix(in srgb, var(--orbit-text-primary) 82%, black);--btn-text: var(--orbit-text-inverse);--btn-border: var(--orbit-text-primary);--btn-soft-bg: var(--orbit-surface-subtle);--btn-soft-text: var(--orbit-text-primary);--btn-soft-border: var(--orbit-border-subtle)}.orbit-btn--solid{background:var(--btn-bg);border-color:var(--btn-border);color:var(--btn-text)}.orbit-btn--solid:hover:not(:disabled){background:var(--btn-bg-hover);border-color:var(--btn-bg-hover)}.orbit-btn--soft{background:var(--btn-soft-bg);border-color:var(--btn-soft-border);color:var(--btn-soft-text)}.orbit-btn--soft:hover:not(:disabled){background:var(--btn-soft-border)}.orbit-btn--outline{background:var(--orbit-surface-default);border-color:var(--btn-soft-border);color:var(--btn-soft-text)}.orbit-btn--outline:hover:not(:disabled){background:var(--btn-soft-bg)}.orbit-btn--flat{background:transparent;border-color:transparent;color:var(--btn-soft-text)}.orbit-btn--flat:hover:not(:disabled){background:var(--btn-soft-bg)}.orbit-btn--icon-only{width:var(--orbit-control-height);padding:0}.orbit-btn--loading{cursor:wait}.orbit-btn__spinner{display:inline-block;width:1em;height:1em;border:2px solid currentColor;border-right-color:transparent;border-radius:50%;animation:orbit-spin .6s linear infinite}.orbit-btn__icon{font-size:.875em;line-height:1}.orbit-btn__label{white-space:nowrap}@keyframes orbit-spin{to{transform:rotate(360deg)}}\n"], changeDetection: i0.ChangeDetectionStrategy.OnPush }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "22.0.7", ngImport: i0, type: OrbitButtonComponent, decorators: [{
            type: Component,
            args: [{ selector: 'orbit-button', changeDetection: ChangeDetectionStrategy.OnPush, host: {
                        '[class.orbit-button-host--icon-only]': 'iconOnly()',
                    }, template: "<button\n  [type]=\"type()\"\n  [attr.aria-label]=\"ariaLabel() || null\"\n  [disabled]=\"disabled() || loading()\"\n  class=\"orbit-btn\"\n  [class.orbit-btn--solid]=\"variant() === 'solid'\"\n  [class.orbit-btn--soft]=\"variant() === 'soft'\"\n  [class.orbit-btn--outline]=\"variant() === 'outline'\"\n  [class.orbit-btn--flat]=\"variant() === 'flat'\"\n  [class.orbit-btn--primary]=\"tone() === 'primary'\"\n  [class.orbit-btn--success]=\"tone() === 'success'\"\n  [class.orbit-btn--danger]=\"tone() === 'danger'\"\n  [class.orbit-btn--neutral]=\"tone() === 'neutral'\"\n  [class.orbit-btn--icon-only]=\"iconOnly()\"\n  [class.orbit-btn--loading]=\"loading()\"\n  (click)=\"onClick()\"\n>\n  @if (loading()) {\n    <span class=\"orbit-btn__spinner\" aria-hidden=\"true\"></span>\n  }\n  @if (!loading() && icon()) {\n    <span class=\"orbit-btn__icon\" [class]=\"icon()\" aria-hidden=\"true\"></span>\n  }\n  @if (label()) {\n    <span class=\"orbit-btn__label\">{{ label() }}</span>\n  }\n</button>\n", styles: [":host{display:inline-flex}.orbit-btn{display:inline-flex;align-items:center;justify-content:center;gap:.375rem;min-height:var(--orbit-control-height);padding:0 var(--orbit-control-padding-inline);border:1px solid transparent;border-radius:var(--orbit-radius-control);font-family:var(--orbit-font-sans);font-size:var(--orbit-font-size-body);font-weight:var(--orbit-font-weight-emphasis);line-height:1.2;letter-spacing:0;cursor:pointer;transition:background-color .15s ease,border-color .15s ease,color .15s ease,box-shadow .15s ease}.orbit-btn:focus-visible{outline:2px solid var(--orbit-action-primary-bg);outline-offset:2px;box-shadow:var(--orbit-focus-ring)}.orbit-btn:disabled{cursor:not-allowed;opacity:.6;pointer-events:none}.orbit-btn--primary{--btn-bg: var(--orbit-button-primary-bg);--btn-bg-hover: var(--orbit-button-primary-bg-hover);--btn-text: var(--orbit-button-primary-fg);--btn-border: var(--orbit-button-primary-bg);--btn-soft-bg: color-mix(in srgb, var(--orbit-action-primary-bg) 14%, var(--orbit-surface-default));--btn-soft-text: var(--orbit-action-primary-bg-hover);--btn-soft-border: color-mix(in srgb, var(--orbit-action-primary-bg) 28%, var(--orbit-surface-default))}.orbit-btn--success{--btn-bg: var(--orbit-status-success);--btn-bg-hover: color-mix(in srgb, var(--orbit-status-success) 82%, black);--btn-text: var(--orbit-text-inverse);--btn-border: var(--orbit-status-success);--btn-soft-bg: var(--orbit-status-success-subtle);--btn-soft-text: var(--orbit-status-success);--btn-soft-border: color-mix(in srgb, var(--orbit-status-success) 28%, var(--orbit-surface-default))}.orbit-btn--danger{--btn-bg: var(--orbit-status-danger);--btn-bg-hover: color-mix(in srgb, var(--orbit-status-danger) 82%, black);--btn-text: var(--orbit-text-inverse);--btn-border: var(--orbit-status-danger);--btn-soft-bg: var(--orbit-status-danger-subtle);--btn-soft-text: var(--orbit-status-danger);--btn-soft-border: color-mix(in srgb, var(--orbit-status-danger) 28%, var(--orbit-surface-default))}.orbit-btn--neutral{--btn-bg: var(--orbit-text-primary);--btn-bg-hover: color-mix(in srgb, var(--orbit-text-primary) 82%, black);--btn-text: var(--orbit-text-inverse);--btn-border: var(--orbit-text-primary);--btn-soft-bg: var(--orbit-surface-subtle);--btn-soft-text: var(--orbit-text-primary);--btn-soft-border: var(--orbit-border-subtle)}.orbit-btn--solid{background:var(--btn-bg);border-color:var(--btn-border);color:var(--btn-text)}.orbit-btn--solid:hover:not(:disabled){background:var(--btn-bg-hover);border-color:var(--btn-bg-hover)}.orbit-btn--soft{background:var(--btn-soft-bg);border-color:var(--btn-soft-border);color:var(--btn-soft-text)}.orbit-btn--soft:hover:not(:disabled){background:var(--btn-soft-border)}.orbit-btn--outline{background:var(--orbit-surface-default);border-color:var(--btn-soft-border);color:var(--btn-soft-text)}.orbit-btn--outline:hover:not(:disabled){background:var(--btn-soft-bg)}.orbit-btn--flat{background:transparent;border-color:transparent;color:var(--btn-soft-text)}.orbit-btn--flat:hover:not(:disabled){background:var(--btn-soft-bg)}.orbit-btn--icon-only{width:var(--orbit-control-height);padding:0}.orbit-btn--loading{cursor:wait}.orbit-btn__spinner{display:inline-block;width:1em;height:1em;border:2px solid currentColor;border-right-color:transparent;border-radius:50%;animation:orbit-spin .6s linear infinite}.orbit-btn__icon{font-size:.875em;line-height:1}.orbit-btn__label{white-space:nowrap}@keyframes orbit-spin{to{transform:rotate(360deg)}}\n"] }]
        }], propDecorators: { label: [{ type: i0.Input, args: [{ isSignal: true, alias: "label", required: false }] }], variant: [{ type: i0.Input, args: [{ isSignal: true, alias: "variant", required: false }] }], tone: [{ type: i0.Input, args: [{ isSignal: true, alias: "tone", required: false }] }], type: [{ type: i0.Input, args: [{ isSignal: true, alias: "type", required: false }] }], disabled: [{ type: i0.Input, args: [{ isSignal: true, alias: "disabled", required: false }] }], loading: [{ type: i0.Input, args: [{ isSignal: true, alias: "loading", required: false }] }], iconOnly: [{ type: i0.Input, args: [{ isSignal: true, alias: "iconOnly", required: false }] }], icon: [{ type: i0.Input, args: [{ isSignal: true, alias: "icon", required: false }] }], ariaLabel: [{ type: i0.Input, args: [{ isSignal: true, alias: "ariaLabel", required: false }] }], clicked: [{ type: i0.Output, args: ["clicked"] }] } });

class OrbitIconButtonComponent {
    constructor() {
        this.icon = input('', /* @ts-ignore */
        ...(ngDevMode ? [{ debugName: "icon" }] : /* istanbul ignore next */ []));
        this.ariaLabel = input.required(/* @ts-ignore */
        ...(ngDevMode ? [{ debugName: "ariaLabel" }] : /* istanbul ignore next */ []));
        this.tone = input('neutral', /* @ts-ignore */
        ...(ngDevMode ? [{ debugName: "tone" }] : /* istanbul ignore next */ []));
        this.type = input('button', /* @ts-ignore */
        ...(ngDevMode ? [{ debugName: "type" }] : /* istanbul ignore next */ []));
        this.disabled = input(false, { ...(ngDevMode ? { debugName: "disabled" } : /* istanbul ignore next */ {}), transform: booleanAttribute });
        this.clicked = output();
    }
    onClick() {
        if (!this.disabled())
            this.clicked.emit();
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "22.0.7", ngImport: i0, type: OrbitIconButtonComponent, deps: [], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "22.0.7", type: OrbitIconButtonComponent, isStandalone: true, selector: "orbit-icon-button", inputs: { icon: { classPropertyName: "icon", publicName: "icon", isSignal: true, isRequired: false, transformFunction: null }, ariaLabel: { classPropertyName: "ariaLabel", publicName: "ariaLabel", isSignal: true, isRequired: true, transformFunction: null }, tone: { classPropertyName: "tone", publicName: "tone", isSignal: true, isRequired: false, transformFunction: null }, type: { classPropertyName: "type", publicName: "type", isSignal: true, isRequired: false, transformFunction: null }, disabled: { classPropertyName: "disabled", publicName: "disabled", isSignal: true, isRequired: false, transformFunction: null } }, outputs: { clicked: "clicked" }, ngImport: i0, template: "<button\n  class=\"orbit-icon-button\"\n  [class.orbit-icon-button--primary]=\"tone() === 'primary'\"\n  [class.orbit-icon-button--danger]=\"tone() === 'danger'\"\n  [type]=\"type()\"\n  [disabled]=\"disabled()\"\n  [attr.aria-label]=\"ariaLabel()\"\n  (click)=\"onClick()\"\n>\n  @if (icon()) {\n    <span [class]=\"icon()\" aria-hidden=\"true\"></span>\n  } @else {\n    <ng-content />\n  }\n</button>\n", styles: [":host{display:inline-flex}.orbit-icon-button{display:grid;place-items:center;width:var(--orbit-control-height);height:var(--orbit-control-height);padding:0;border:1px solid var(--orbit-border-subtle);border-radius:var(--orbit-radius-control);background:var(--orbit-surface-default);color:var(--orbit-text-secondary);cursor:pointer}.orbit-icon-button:hover:not(:disabled){background:var(--orbit-surface-subtle);color:var(--orbit-text-primary)}.orbit-icon-button:focus-visible{outline:2px solid var(--orbit-action-primary-bg);outline-offset:2px;box-shadow:var(--orbit-focus-ring)}.orbit-icon-button--primary{color:var(--orbit-action-primary-bg)}.orbit-icon-button--danger{color:var(--orbit-status-danger)}.orbit-icon-button:disabled{cursor:not-allowed;opacity:.55}\n"], changeDetection: i0.ChangeDetectionStrategy.OnPush }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "22.0.7", ngImport: i0, type: OrbitIconButtonComponent, decorators: [{
            type: Component,
            args: [{ selector: 'orbit-icon-button', changeDetection: ChangeDetectionStrategy.OnPush, template: "<button\n  class=\"orbit-icon-button\"\n  [class.orbit-icon-button--primary]=\"tone() === 'primary'\"\n  [class.orbit-icon-button--danger]=\"tone() === 'danger'\"\n  [type]=\"type()\"\n  [disabled]=\"disabled()\"\n  [attr.aria-label]=\"ariaLabel()\"\n  (click)=\"onClick()\"\n>\n  @if (icon()) {\n    <span [class]=\"icon()\" aria-hidden=\"true\"></span>\n  } @else {\n    <ng-content />\n  }\n</button>\n", styles: [":host{display:inline-flex}.orbit-icon-button{display:grid;place-items:center;width:var(--orbit-control-height);height:var(--orbit-control-height);padding:0;border:1px solid var(--orbit-border-subtle);border-radius:var(--orbit-radius-control);background:var(--orbit-surface-default);color:var(--orbit-text-secondary);cursor:pointer}.orbit-icon-button:hover:not(:disabled){background:var(--orbit-surface-subtle);color:var(--orbit-text-primary)}.orbit-icon-button:focus-visible{outline:2px solid var(--orbit-action-primary-bg);outline-offset:2px;box-shadow:var(--orbit-focus-ring)}.orbit-icon-button--primary{color:var(--orbit-action-primary-bg)}.orbit-icon-button--danger{color:var(--orbit-status-danger)}.orbit-icon-button:disabled{cursor:not-allowed;opacity:.55}\n"] }]
        }], propDecorators: { icon: [{ type: i0.Input, args: [{ isSignal: true, alias: "icon", required: false }] }], ariaLabel: [{ type: i0.Input, args: [{ isSignal: true, alias: "ariaLabel", required: true }] }], tone: [{ type: i0.Input, args: [{ isSignal: true, alias: "tone", required: false }] }], type: [{ type: i0.Input, args: [{ isSignal: true, alias: "type", required: false }] }], disabled: [{ type: i0.Input, args: [{ isSignal: true, alias: "disabled", required: false }] }], clicked: [{ type: i0.Output, args: ["clicked"] }] } });

class OrbitDividerComponent {
    constructor() {
        this.variant = input('solid', /* @ts-ignore */
        ...(ngDevMode ? [{ debugName: "variant" }] : /* istanbul ignore next */ []));
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "22.0.7", ngImport: i0, type: OrbitDividerComponent, deps: [], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.1.0", version: "22.0.7", type: OrbitDividerComponent, isStandalone: true, selector: "orbit-divider", inputs: { variant: { classPropertyName: "variant", publicName: "variant", isSignal: true, isRequired: false, transformFunction: null } }, host: { properties: { "class.orbit-divider--dashed": "variant() === 'dashed'" } }, ngImport: i0, template: '', isInline: true, styles: [":host{display:block;border-top:1px solid var(--orbit-border-subtle)}:host(.orbit-divider--dashed){border-top-style:dashed}\n"], changeDetection: i0.ChangeDetectionStrategy.OnPush }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "22.0.7", ngImport: i0, type: OrbitDividerComponent, decorators: [{
            type: Component,
            args: [{ selector: 'orbit-divider', changeDetection: ChangeDetectionStrategy.OnPush, template: '', host: { '[class.orbit-divider--dashed]': "variant() === 'dashed'" }, styles: [":host{display:block;border-top:1px solid var(--orbit-border-subtle)}:host(.orbit-divider--dashed){border-top-style:dashed}\n"] }]
        }], propDecorators: { variant: [{ type: i0.Input, args: [{ isSignal: true, alias: "variant", required: false }] }] } });

class OrbitSelectableTileComponent {
    constructor() {
        this.label = input.required(/* @ts-ignore */
        ...(ngDevMode ? [{ debugName: "label" }] : /* istanbul ignore next */ []));
        this.description = input('', /* @ts-ignore */
        ...(ngDevMode ? [{ debugName: "description" }] : /* istanbul ignore next */ []));
        this.selected = input(false, { ...(ngDevMode ? { debugName: "selected" } : /* istanbul ignore next */ {}), transform: booleanAttribute });
        this.disabled = input(false, { ...(ngDevMode ? { debugName: "disabled" } : /* istanbul ignore next */ {}), transform: booleanAttribute });
        this.selectedChange = output();
    }
    toggle() {
        if (!this.disabled())
            this.selectedChange.emit(!this.selected());
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "22.0.7", ngImport: i0, type: OrbitSelectableTileComponent, deps: [], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "22.0.7", type: OrbitSelectableTileComponent, isStandalone: true, selector: "orbit-selectable-tile", inputs: { label: { classPropertyName: "label", publicName: "label", isSignal: true, isRequired: true, transformFunction: null }, description: { classPropertyName: "description", publicName: "description", isSignal: true, isRequired: false, transformFunction: null }, selected: { classPropertyName: "selected", publicName: "selected", isSignal: true, isRequired: false, transformFunction: null }, disabled: { classPropertyName: "disabled", publicName: "disabled", isSignal: true, isRequired: false, transformFunction: null } }, outputs: { selectedChange: "selectedChange" }, ngImport: i0, template: "<button\n  type=\"button\"\n  class=\"orbit-selectable-tile\"\n  [class.orbit-selectable-tile--selected]=\"selected()\"\n  [disabled]=\"disabled()\"\n  [attr.aria-pressed]=\"selected()\"\n  (click)=\"toggle()\"\n>\n  <span class=\"orbit-selectable-tile__indicator\" aria-hidden=\"true\">{{\n    selected() ? '\u2713' : ''\n  }}</span>\n  <span\n    ><span class=\"orbit-selectable-tile__label\">{{ label() }}</span>\n    @if (description()) {\n      <span class=\"orbit-selectable-tile__description\">{{ description() }}</span>\n    }\n  </span>\n</button>\n", styles: [":host{display:block}.orbit-selectable-tile{display:flex;align-items:center;gap:var(--orbit-space-3);width:100%;min-height:3.25rem;padding:var(--orbit-space-3);border:1px solid var(--orbit-border-subtle);border-radius:var(--orbit-radius-surface);background:var(--orbit-surface-subtle);color:var(--orbit-text-primary);font:inherit;text-align:left;cursor:pointer}.orbit-selectable-tile:hover:not(:disabled){border-color:var(--orbit-border-strong)}.orbit-selectable-tile--selected{border-color:color-mix(in srgb,var(--orbit-action-primary-bg) 35%,var(--orbit-border-subtle));background:color-mix(in srgb,var(--orbit-action-primary-bg) 12%,var(--orbit-surface-default))}.orbit-selectable-tile:focus-visible{outline:2px solid var(--orbit-action-primary-bg);outline-offset:2px;box-shadow:var(--orbit-focus-ring)}.orbit-selectable-tile:disabled{cursor:not-allowed;opacity:.55}.orbit-selectable-tile__indicator{display:grid;place-items:center;width:1.125rem;height:1.125rem;flex:none;border:1px solid var(--orbit-border-strong);border-radius:50%;color:var(--orbit-text-inverse);font-size:var(--orbit-font-size-xs)}.orbit-selectable-tile--selected .orbit-selectable-tile__indicator{border-color:var(--orbit-action-primary-bg);background:var(--orbit-action-primary-bg)}.orbit-selectable-tile__label,.orbit-selectable-tile__description{display:block}.orbit-selectable-tile__label{font-size:var(--orbit-font-size-body);font-weight:var(--orbit-font-weight-emphasis)}.orbit-selectable-tile__description{margin-top:2px;color:var(--orbit-text-secondary);font-size:var(--orbit-font-size-sm)}\n"], changeDetection: i0.ChangeDetectionStrategy.OnPush }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "22.0.7", ngImport: i0, type: OrbitSelectableTileComponent, decorators: [{
            type: Component,
            args: [{ selector: 'orbit-selectable-tile', changeDetection: ChangeDetectionStrategy.OnPush, template: "<button\n  type=\"button\"\n  class=\"orbit-selectable-tile\"\n  [class.orbit-selectable-tile--selected]=\"selected()\"\n  [disabled]=\"disabled()\"\n  [attr.aria-pressed]=\"selected()\"\n  (click)=\"toggle()\"\n>\n  <span class=\"orbit-selectable-tile__indicator\" aria-hidden=\"true\">{{\n    selected() ? '\u2713' : ''\n  }}</span>\n  <span\n    ><span class=\"orbit-selectable-tile__label\">{{ label() }}</span>\n    @if (description()) {\n      <span class=\"orbit-selectable-tile__description\">{{ description() }}</span>\n    }\n  </span>\n</button>\n", styles: [":host{display:block}.orbit-selectable-tile{display:flex;align-items:center;gap:var(--orbit-space-3);width:100%;min-height:3.25rem;padding:var(--orbit-space-3);border:1px solid var(--orbit-border-subtle);border-radius:var(--orbit-radius-surface);background:var(--orbit-surface-subtle);color:var(--orbit-text-primary);font:inherit;text-align:left;cursor:pointer}.orbit-selectable-tile:hover:not(:disabled){border-color:var(--orbit-border-strong)}.orbit-selectable-tile--selected{border-color:color-mix(in srgb,var(--orbit-action-primary-bg) 35%,var(--orbit-border-subtle));background:color-mix(in srgb,var(--orbit-action-primary-bg) 12%,var(--orbit-surface-default))}.orbit-selectable-tile:focus-visible{outline:2px solid var(--orbit-action-primary-bg);outline-offset:2px;box-shadow:var(--orbit-focus-ring)}.orbit-selectable-tile:disabled{cursor:not-allowed;opacity:.55}.orbit-selectable-tile__indicator{display:grid;place-items:center;width:1.125rem;height:1.125rem;flex:none;border:1px solid var(--orbit-border-strong);border-radius:50%;color:var(--orbit-text-inverse);font-size:var(--orbit-font-size-xs)}.orbit-selectable-tile--selected .orbit-selectable-tile__indicator{border-color:var(--orbit-action-primary-bg);background:var(--orbit-action-primary-bg)}.orbit-selectable-tile__label,.orbit-selectable-tile__description{display:block}.orbit-selectable-tile__label{font-size:var(--orbit-font-size-body);font-weight:var(--orbit-font-weight-emphasis)}.orbit-selectable-tile__description{margin-top:2px;color:var(--orbit-text-secondary);font-size:var(--orbit-font-size-sm)}\n"] }]
        }], propDecorators: { label: [{ type: i0.Input, args: [{ isSignal: true, alias: "label", required: true }] }], description: [{ type: i0.Input, args: [{ isSignal: true, alias: "description", required: false }] }], selected: [{ type: i0.Input, args: [{ isSignal: true, alias: "selected", required: false }] }], disabled: [{ type: i0.Input, args: [{ isSignal: true, alias: "disabled", required: false }] }], selectedChange: [{ type: i0.Output, args: ["selectedChange"] }] } });

class OrbitBadgeComponent {
    constructor() {
        this.tone = input('neutral', /* @ts-ignore */
        ...(ngDevMode ? [{ debugName: "tone" }] : /* istanbul ignore next */ []));
        this.label = input('', /* @ts-ignore */
        ...(ngDevMode ? [{ debugName: "label" }] : /* istanbul ignore next */ []));
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "22.0.7", ngImport: i0, type: OrbitBadgeComponent, deps: [], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.1.0", version: "22.0.7", type: OrbitBadgeComponent, isStandalone: true, selector: "orbit-badge", inputs: { tone: { classPropertyName: "tone", publicName: "tone", isSignal: true, isRequired: false, transformFunction: null }, label: { classPropertyName: "label", publicName: "label", isSignal: true, isRequired: false, transformFunction: null } }, ngImport: i0, template: "<span\n  class=\"orbit-badge\"\n  [class.orbit-badge--primary]=\"tone() === 'primary'\"\n  [class.orbit-badge--success]=\"tone() === 'success'\"\n  [class.orbit-badge--danger]=\"tone() === 'danger'\"\n  [class.orbit-badge--warning]=\"tone() === 'warning'\"\n  [class.orbit-badge--info]=\"tone() === 'info'\"\n  [class.orbit-badge--neutral]=\"tone() === 'neutral'\"\n>\n  {{ label() }}\n  <ng-content />\n</span>\n", styles: [":host{display:inline-flex}.orbit-badge{display:inline-flex;align-items:center;gap:.25rem;height:1.375rem;padding:0 .5rem;border-radius:var(--orbit-radius-full);font-family:var(--orbit-font-sans);font-size:var(--orbit-font-size-xs);font-weight:var(--orbit-font-weight-emphasis);line-height:1;white-space:nowrap}.orbit-badge--primary{background:color-mix(in srgb,var(--orbit-action-primary-bg) 15%,transparent);color:var(--orbit-badge-primary-fg)}.orbit-badge--success{background:var(--orbit-status-success-subtle);color:var(--orbit-badge-success-fg)}.orbit-badge--danger{background:var(--orbit-status-danger-subtle);color:var(--orbit-badge-danger-fg)}.orbit-badge--warning{background:var(--orbit-status-warning-subtle);color:var(--orbit-badge-warning-fg)}.orbit-badge--info{background:var(--orbit-status-info-subtle);color:var(--orbit-badge-info-fg)}.orbit-badge--neutral{background:var(--orbit-surface-subtle);color:var(--orbit-badge-neutral-fg)}\n"], changeDetection: i0.ChangeDetectionStrategy.OnPush }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "22.0.7", ngImport: i0, type: OrbitBadgeComponent, decorators: [{
            type: Component,
            args: [{ selector: 'orbit-badge', changeDetection: ChangeDetectionStrategy.OnPush, template: "<span\n  class=\"orbit-badge\"\n  [class.orbit-badge--primary]=\"tone() === 'primary'\"\n  [class.orbit-badge--success]=\"tone() === 'success'\"\n  [class.orbit-badge--danger]=\"tone() === 'danger'\"\n  [class.orbit-badge--warning]=\"tone() === 'warning'\"\n  [class.orbit-badge--info]=\"tone() === 'info'\"\n  [class.orbit-badge--neutral]=\"tone() === 'neutral'\"\n>\n  {{ label() }}\n  <ng-content />\n</span>\n", styles: [":host{display:inline-flex}.orbit-badge{display:inline-flex;align-items:center;gap:.25rem;height:1.375rem;padding:0 .5rem;border-radius:var(--orbit-radius-full);font-family:var(--orbit-font-sans);font-size:var(--orbit-font-size-xs);font-weight:var(--orbit-font-weight-emphasis);line-height:1;white-space:nowrap}.orbit-badge--primary{background:color-mix(in srgb,var(--orbit-action-primary-bg) 15%,transparent);color:var(--orbit-badge-primary-fg)}.orbit-badge--success{background:var(--orbit-status-success-subtle);color:var(--orbit-badge-success-fg)}.orbit-badge--danger{background:var(--orbit-status-danger-subtle);color:var(--orbit-badge-danger-fg)}.orbit-badge--warning{background:var(--orbit-status-warning-subtle);color:var(--orbit-badge-warning-fg)}.orbit-badge--info{background:var(--orbit-status-info-subtle);color:var(--orbit-badge-info-fg)}.orbit-badge--neutral{background:var(--orbit-surface-subtle);color:var(--orbit-badge-neutral-fg)}\n"] }]
        }], propDecorators: { tone: [{ type: i0.Input, args: [{ isSignal: true, alias: "tone", required: false }] }], label: [{ type: i0.Input, args: [{ isSignal: true, alias: "label", required: false }] }] } });

class OrbitCheckboxComponent {
    constructor() {
        this.label = input('', /* @ts-ignore */
        ...(ngDevMode ? [{ debugName: "label" }] : /* istanbul ignore next */ []));
        this.inputId = input('', /* @ts-ignore */
        ...(ngDevMode ? [{ debugName: "inputId" }] : /* istanbul ignore next */ []));
        this.disabled = input(false, { ...(ngDevMode ? { debugName: "disabled" } : /* istanbul ignore next */ {}), transform: booleanAttribute });
        this.required = input(false, { ...(ngDevMode ? { debugName: "required" } : /* istanbul ignore next */ {}), transform: booleanAttribute });
        this.checked = output();
        this.isChecked = signal(false, /* @ts-ignore */
        ...(ngDevMode ? [{ debugName: "isChecked" }] : /* istanbul ignore next */ []));
        this.isDisabled = signal(false, /* @ts-ignore */
        ...(ngDevMode ? [{ debugName: "isDisabled" }] : /* istanbul ignore next */ []));
        this.onChange = () => undefined;
        this.onTouched = () => undefined;
    }
    writeValue(val) {
        this.isChecked.set(!!val);
    }
    registerOnChange(fn) {
        this.onChange = fn;
    }
    registerOnTouched(fn) {
        this.onTouched = fn;
    }
    setDisabledState(isDisabled) {
        this.isDisabled.set(isDisabled);
    }
    toggle() {
        if (this.isDisabled())
            return;
        const next = !this.isChecked();
        this.isChecked.set(next);
        this.onChange(next);
        this.onTouched();
        this.checked.emit(next);
    }
    onKeydown(event) {
        if (event.key === ' ' || event.key === 'Enter') {
            event.preventDefault();
            this.toggle();
        }
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "22.0.7", ngImport: i0, type: OrbitCheckboxComponent, deps: [], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "22.0.7", type: OrbitCheckboxComponent, isStandalone: true, selector: "orbit-checkbox", inputs: { label: { classPropertyName: "label", publicName: "label", isSignal: true, isRequired: false, transformFunction: null }, inputId: { classPropertyName: "inputId", publicName: "inputId", isSignal: true, isRequired: false, transformFunction: null }, disabled: { classPropertyName: "disabled", publicName: "disabled", isSignal: true, isRequired: false, transformFunction: null }, required: { classPropertyName: "required", publicName: "required", isSignal: true, isRequired: false, transformFunction: null } }, outputs: { checked: "checked" }, providers: [
            {
                provide: NG_VALUE_ACCESSOR,
                useExisting: forwardRef(() => OrbitCheckboxComponent),
                multi: true,
            },
        ], ngImport: i0, template: "<label\n  class=\"orbit-checkbox\"\n  [class.orbit-checkbox--disabled]=\"isDisabled()\"\n  [for]=\"inputId() || null\"\n>\n  <input\n    #checkbox\n    type=\"checkbox\"\n    class=\"orbit-checkbox__input\"\n    [id]=\"inputId() || null\"\n    [checked]=\"isChecked()\"\n    [disabled]=\"isDisabled()\"\n    [required]=\"required()\"\n    (change)=\"toggle()\"\n  />\n  <span class=\"orbit-checkbox__box\" aria-hidden=\"true\">\n    @if (isChecked()) {\n      <svg viewBox=\"0 0 16 16\" fill=\"none\" class=\"orbit-checkbox__check\">\n        <path d=\"M3 8L6.5 11.5L13 4.5\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/>\n      </svg>\n    }\n  </span>\n  @if (label()) {\n    <span class=\"orbit-checkbox__label\">{{ label() }}</span>\n  }\n</label>\n", styles: [":host{display:block}.orbit-checkbox{display:inline-flex;align-items:center;gap:var(--orbit-space-2);cursor:pointer;font-family:var(--orbit-font-sans);font-size:var(--orbit-font-size-body);color:var(--orbit-text-primary);-webkit-user-select:none;user-select:none}.orbit-checkbox--disabled{cursor:not-allowed;opacity:.55;pointer-events:none}.orbit-checkbox__input{position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0}.orbit-checkbox__box{display:grid;place-items:center;width:1.125rem;height:1.125rem;border:1.5px solid var(--orbit-border-subtle);border-radius:var(--orbit-radius-sm);background:var(--orbit-surface-default);flex-shrink:0;transition:background-color .15s ease,border-color .15s ease}.orbit-checkbox__input:checked+.orbit-checkbox__box{background:var(--orbit-action-primary-bg);border-color:var(--orbit-action-primary-bg)}.orbit-checkbox__input:focus-visible+.orbit-checkbox__box{outline:2px solid var(--orbit-action-primary-bg);outline-offset:2px}.orbit-checkbox__check{width:.75rem;height:.75rem;color:var(--orbit-text-inverse)}.orbit-checkbox__label{line-height:1.35}\n"], changeDetection: i0.ChangeDetectionStrategy.OnPush }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "22.0.7", ngImport: i0, type: OrbitCheckboxComponent, decorators: [{
            type: Component,
            args: [{ selector: 'orbit-checkbox', changeDetection: ChangeDetectionStrategy.OnPush, providers: [
                        {
                            provide: NG_VALUE_ACCESSOR,
                            useExisting: forwardRef(() => OrbitCheckboxComponent),
                            multi: true,
                        },
                    ], template: "<label\n  class=\"orbit-checkbox\"\n  [class.orbit-checkbox--disabled]=\"isDisabled()\"\n  [for]=\"inputId() || null\"\n>\n  <input\n    #checkbox\n    type=\"checkbox\"\n    class=\"orbit-checkbox__input\"\n    [id]=\"inputId() || null\"\n    [checked]=\"isChecked()\"\n    [disabled]=\"isDisabled()\"\n    [required]=\"required()\"\n    (change)=\"toggle()\"\n  />\n  <span class=\"orbit-checkbox__box\" aria-hidden=\"true\">\n    @if (isChecked()) {\n      <svg viewBox=\"0 0 16 16\" fill=\"none\" class=\"orbit-checkbox__check\">\n        <path d=\"M3 8L6.5 11.5L13 4.5\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/>\n      </svg>\n    }\n  </span>\n  @if (label()) {\n    <span class=\"orbit-checkbox__label\">{{ label() }}</span>\n  }\n</label>\n", styles: [":host{display:block}.orbit-checkbox{display:inline-flex;align-items:center;gap:var(--orbit-space-2);cursor:pointer;font-family:var(--orbit-font-sans);font-size:var(--orbit-font-size-body);color:var(--orbit-text-primary);-webkit-user-select:none;user-select:none}.orbit-checkbox--disabled{cursor:not-allowed;opacity:.55;pointer-events:none}.orbit-checkbox__input{position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0}.orbit-checkbox__box{display:grid;place-items:center;width:1.125rem;height:1.125rem;border:1.5px solid var(--orbit-border-subtle);border-radius:var(--orbit-radius-sm);background:var(--orbit-surface-default);flex-shrink:0;transition:background-color .15s ease,border-color .15s ease}.orbit-checkbox__input:checked+.orbit-checkbox__box{background:var(--orbit-action-primary-bg);border-color:var(--orbit-action-primary-bg)}.orbit-checkbox__input:focus-visible+.orbit-checkbox__box{outline:2px solid var(--orbit-action-primary-bg);outline-offset:2px}.orbit-checkbox__check{width:.75rem;height:.75rem;color:var(--orbit-text-inverse)}.orbit-checkbox__label{line-height:1.35}\n"] }]
        }], propDecorators: { label: [{ type: i0.Input, args: [{ isSignal: true, alias: "label", required: false }] }], inputId: [{ type: i0.Input, args: [{ isSignal: true, alias: "inputId", required: false }] }], disabled: [{ type: i0.Input, args: [{ isSignal: true, alias: "disabled", required: false }] }], required: [{ type: i0.Input, args: [{ isSignal: true, alias: "required", required: false }] }], checked: [{ type: i0.Output, args: ["checked"] }] } });

class OrbitFormFieldComponent {
    constructor() {
        this.label = input('', /* @ts-ignore */
        ...(ngDevMode ? [{ debugName: "label" }] : /* istanbul ignore next */ []));
        this.inputId = input('', /* @ts-ignore */
        ...(ngDevMode ? [{ debugName: "inputId" }] : /* istanbul ignore next */ []));
        this.hint = input('', /* @ts-ignore */
        ...(ngDevMode ? [{ debugName: "hint" }] : /* istanbul ignore next */ []));
        this.error = input('', /* @ts-ignore */
        ...(ngDevMode ? [{ debugName: "error" }] : /* istanbul ignore next */ []));
        this.required = input(false, { ...(ngDevMode ? { debugName: "required" } : /* istanbul ignore next */ {}), transform: booleanAttribute });
        this.disabled = input(false, { ...(ngDevMode ? { debugName: "disabled" } : /* istanbul ignore next */ {}), transform: booleanAttribute });
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "22.0.7", ngImport: i0, type: OrbitFormFieldComponent, deps: [], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "22.0.7", type: OrbitFormFieldComponent, isStandalone: true, selector: "orbit-form-field", inputs: { label: { classPropertyName: "label", publicName: "label", isSignal: true, isRequired: false, transformFunction: null }, inputId: { classPropertyName: "inputId", publicName: "inputId", isSignal: true, isRequired: false, transformFunction: null }, hint: { classPropertyName: "hint", publicName: "hint", isSignal: true, isRequired: false, transformFunction: null }, error: { classPropertyName: "error", publicName: "error", isSignal: true, isRequired: false, transformFunction: null }, required: { classPropertyName: "required", publicName: "required", isSignal: true, isRequired: false, transformFunction: null }, disabled: { classPropertyName: "disabled", publicName: "disabled", isSignal: true, isRequired: false, transformFunction: null } }, host: { properties: { "class.orbit-form-field--disabled": "disabled()" } }, ngImport: i0, template: "<div class=\"orbit-form-field\">\n  @if (label()) {\n    <label\n      class=\"orbit-form-field__label\"\n      [for]=\"inputId() || null\"\n    >\n      {{ label() }}\n      @if (required()) {\n        <span class=\"orbit-form-field__required\" aria-hidden=\"true\">*</span>\n      }\n    </label>\n  }\n\n  <div class=\"orbit-form-field__control\">\n    <ng-content />\n  </div>\n\n  @if (hint() && !error()) {\n    <p class=\"orbit-form-field__hint\">{{ hint() }}</p>\n  }\n\n  @if (error()) {\n    <p class=\"orbit-form-field__error\" role=\"alert\">{{ error() }}</p>\n  }\n</div>\n", styles: [":host{display:block}.orbit-form-field__label{display:block;margin-bottom:var(--orbit-space-1);color:var(--orbit-text-primary);font-family:var(--orbit-font-sans);font-size:var(--orbit-font-size-sm);font-weight:var(--orbit-font-weight-emphasis);line-height:1.35}.orbit-form-field__required{color:var(--orbit-status-danger);margin-left:.125rem}.orbit-form-field__control{display:block}.orbit-form-field__hint{margin:var(--orbit-space-1) 0 0;color:var(--orbit-text-secondary);font-family:var(--orbit-font-sans);font-size:var(--orbit-font-size-xs);line-height:1.35}.orbit-form-field__error{margin:var(--orbit-space-1) 0 0;color:var(--orbit-status-danger);font-family:var(--orbit-font-sans);font-size:var(--orbit-font-size-xs);line-height:1.35}.orbit-form-field--disabled{opacity:.55;pointer-events:none}\n"], changeDetection: i0.ChangeDetectionStrategy.OnPush }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "22.0.7", ngImport: i0, type: OrbitFormFieldComponent, decorators: [{
            type: Component,
            args: [{ selector: 'orbit-form-field', changeDetection: ChangeDetectionStrategy.OnPush, host: {
                        '[class.orbit-form-field--disabled]': 'disabled()',
                    }, template: "<div class=\"orbit-form-field\">\n  @if (label()) {\n    <label\n      class=\"orbit-form-field__label\"\n      [for]=\"inputId() || null\"\n    >\n      {{ label() }}\n      @if (required()) {\n        <span class=\"orbit-form-field__required\" aria-hidden=\"true\">*</span>\n      }\n    </label>\n  }\n\n  <div class=\"orbit-form-field__control\">\n    <ng-content />\n  </div>\n\n  @if (hint() && !error()) {\n    <p class=\"orbit-form-field__hint\">{{ hint() }}</p>\n  }\n\n  @if (error()) {\n    <p class=\"orbit-form-field__error\" role=\"alert\">{{ error() }}</p>\n  }\n</div>\n", styles: [":host{display:block}.orbit-form-field__label{display:block;margin-bottom:var(--orbit-space-1);color:var(--orbit-text-primary);font-family:var(--orbit-font-sans);font-size:var(--orbit-font-size-sm);font-weight:var(--orbit-font-weight-emphasis);line-height:1.35}.orbit-form-field__required{color:var(--orbit-status-danger);margin-left:.125rem}.orbit-form-field__control{display:block}.orbit-form-field__hint{margin:var(--orbit-space-1) 0 0;color:var(--orbit-text-secondary);font-family:var(--orbit-font-sans);font-size:var(--orbit-font-size-xs);line-height:1.35}.orbit-form-field__error{margin:var(--orbit-space-1) 0 0;color:var(--orbit-status-danger);font-family:var(--orbit-font-sans);font-size:var(--orbit-font-size-xs);line-height:1.35}.orbit-form-field--disabled{opacity:.55;pointer-events:none}\n"] }]
        }], propDecorators: { label: [{ type: i0.Input, args: [{ isSignal: true, alias: "label", required: false }] }], inputId: [{ type: i0.Input, args: [{ isSignal: true, alias: "inputId", required: false }] }], hint: [{ type: i0.Input, args: [{ isSignal: true, alias: "hint", required: false }] }], error: [{ type: i0.Input, args: [{ isSignal: true, alias: "error", required: false }] }], required: [{ type: i0.Input, args: [{ isSignal: true, alias: "required", required: false }] }], disabled: [{ type: i0.Input, args: [{ isSignal: true, alias: "disabled", required: false }] }] } });

class OrbitFormGridComponent {
    constructor() {
        /** Overrides density for this grid without changing the surrounding form. */
        this.density = input('inherit', /* @ts-ignore */
        ...(ngDevMode ? [{ debugName: "density" }] : /* istanbul ignore next */ []));
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "22.0.7", ngImport: i0, type: OrbitFormGridComponent, deps: [], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.1.0", version: "22.0.7", type: OrbitFormGridComponent, isStandalone: true, selector: "orbit-form-grid", inputs: { density: { classPropertyName: "density", publicName: "density", isSignal: true, isRequired: false, transformFunction: null } }, host: { properties: { "class.orbit-form-grid--compact": "density() === 'compact'" } }, ngImport: i0, template: "<ng-content />\n", styles: [":host{display:grid;grid-template-columns:repeat(12,minmax(0,1fr));gap:var(--orbit-space-4);width:100%}:host(.orbit-form-grid--compact){gap:var(--orbit-space-3)}:host ::ng-deep .orbit-form-grid__item{grid-column:span var(--orbit-form-grid-span, 12);min-width:0}:host ::ng-deep [primary],:host ::ng-deep [secondary]{grid-column:span 12;min-width:0}@media(min-width:36rem){:host ::ng-deep .orbit-form-grid__item{grid-column:span var(--orbit-form-grid-span-sm, var(--orbit-form-grid-span, 12))}}@media(min-width:48rem){:host ::ng-deep .orbit-form-grid__item{grid-column:span var(--orbit-form-grid-span-md, var(--orbit-form-grid-span-sm, var(--orbit-form-grid-span, 12)))}}@media(min-width:64rem){:host ::ng-deep [primary]{grid-column:span 7}:host ::ng-deep [secondary]{grid-column:span 5}:host ::ng-deep .orbit-form-grid__item{grid-column:span var(--orbit-form-grid-span-lg, var(--orbit-form-grid-span-md, var(--orbit-form-grid-span-sm, var(--orbit-form-grid-span, 12))))}}@media(min-width:80rem){:host ::ng-deep .orbit-form-grid__item{grid-column:span var(--orbit-form-grid-span-xl, var(--orbit-form-grid-span-lg, var(--orbit-form-grid-span-md, var(--orbit-form-grid-span-sm, var(--orbit-form-grid-span, 12)))))}}\n"], changeDetection: i0.ChangeDetectionStrategy.OnPush }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "22.0.7", ngImport: i0, type: OrbitFormGridComponent, decorators: [{
            type: Component,
            args: [{ selector: 'orbit-form-grid', changeDetection: ChangeDetectionStrategy.OnPush, host: {
                        '[class.orbit-form-grid--compact]': "density() === 'compact'",
                    }, template: "<ng-content />\n", styles: [":host{display:grid;grid-template-columns:repeat(12,minmax(0,1fr));gap:var(--orbit-space-4);width:100%}:host(.orbit-form-grid--compact){gap:var(--orbit-space-3)}:host ::ng-deep .orbit-form-grid__item{grid-column:span var(--orbit-form-grid-span, 12);min-width:0}:host ::ng-deep [primary],:host ::ng-deep [secondary]{grid-column:span 12;min-width:0}@media(min-width:36rem){:host ::ng-deep .orbit-form-grid__item{grid-column:span var(--orbit-form-grid-span-sm, var(--orbit-form-grid-span, 12))}}@media(min-width:48rem){:host ::ng-deep .orbit-form-grid__item{grid-column:span var(--orbit-form-grid-span-md, var(--orbit-form-grid-span-sm, var(--orbit-form-grid-span, 12)))}}@media(min-width:64rem){:host ::ng-deep [primary]{grid-column:span 7}:host ::ng-deep [secondary]{grid-column:span 5}:host ::ng-deep .orbit-form-grid__item{grid-column:span var(--orbit-form-grid-span-lg, var(--orbit-form-grid-span-md, var(--orbit-form-grid-span-sm, var(--orbit-form-grid-span, 12))))}}@media(min-width:80rem){:host ::ng-deep .orbit-form-grid__item{grid-column:span var(--orbit-form-grid-span-xl, var(--orbit-form-grid-span-lg, var(--orbit-form-grid-span-md, var(--orbit-form-grid-span-sm, var(--orbit-form-grid-span, 12)))))}}\n"] }]
        }], propDecorators: { density: [{ type: i0.Input, args: [{ isSignal: true, alias: "density", required: false }] }] } });

function coerceSpan(value, fallback) {
    const parsed = Number(value);
    if (!Number.isFinite(parsed)) {
        return fallback;
    }
    return Math.min(12, Math.max(1, Math.round(parsed)));
}
/** Places an element on the twelve-column Orbit form grid. */
class OrbitFormGridItemDirective {
    constructor() {
        /** Span on narrow screens. Breakpoint spans progressively override it. */
        this.span = input(12, /* @ts-ignore */
        ...(ngDevMode ? [{ debugName: "span" }] : /* istanbul ignore next */ []));
        this.spanSm = input(undefined, /* @ts-ignore */
        ...(ngDevMode ? [{ debugName: "spanSm" }] : /* istanbul ignore next */ []));
        this.spanMd = input(undefined, /* @ts-ignore */
        ...(ngDevMode ? [{ debugName: "spanMd" }] : /* istanbul ignore next */ []));
        this.spanLg = input(undefined, /* @ts-ignore */
        ...(ngDevMode ? [{ debugName: "spanLg" }] : /* istanbul ignore next */ []));
        this.spanXl = input(undefined, /* @ts-ignore */
        ...(ngDevMode ? [{ debugName: "spanXl" }] : /* istanbul ignore next */ []));
        this.itemClass = true;
    }
    get baseSpan() {
        return String(coerceSpan(this.span(), 12));
    }
    get smallSpan() {
        return this.spanSm() === undefined ? null : String(coerceSpan(this.spanSm(), coerceSpan(this.span(), 12)));
    }
    get mediumSpan() {
        return this.spanMd() === undefined ? null : String(coerceSpan(this.spanMd(), coerceSpan(this.span(), 12)));
    }
    get largeSpan() {
        return this.spanLg() === undefined ? null : String(coerceSpan(this.spanLg(), coerceSpan(this.span(), 12)));
    }
    get extraLargeSpan() {
        return this.spanXl() === undefined ? null : String(coerceSpan(this.spanXl(), coerceSpan(this.span(), 12)));
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "22.0.7", ngImport: i0, type: OrbitFormGridItemDirective, deps: [], target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "17.1.0", version: "22.0.7", type: OrbitFormGridItemDirective, isStandalone: true, selector: "[orbitFormGridItem]", inputs: { span: { classPropertyName: "span", publicName: "span", isSignal: true, isRequired: false, transformFunction: null }, spanSm: { classPropertyName: "spanSm", publicName: "spanSm", isSignal: true, isRequired: false, transformFunction: null }, spanMd: { classPropertyName: "spanMd", publicName: "spanMd", isSignal: true, isRequired: false, transformFunction: null }, spanLg: { classPropertyName: "spanLg", publicName: "spanLg", isSignal: true, isRequired: false, transformFunction: null }, spanXl: { classPropertyName: "spanXl", publicName: "spanXl", isSignal: true, isRequired: false, transformFunction: null } }, host: { properties: { "class.orbit-form-grid__item": "this.itemClass", "style.--orbit-form-grid-span": "this.baseSpan", "style.--orbit-form-grid-span-sm": "this.smallSpan", "style.--orbit-form-grid-span-md": "this.mediumSpan", "style.--orbit-form-grid-span-lg": "this.largeSpan", "style.--orbit-form-grid-span-xl": "this.extraLargeSpan" } }, ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "22.0.7", ngImport: i0, type: OrbitFormGridItemDirective, decorators: [{
            type: Directive,
            args: [{
                    selector: '[orbitFormGridItem]',
                    standalone: true,
                }]
        }], propDecorators: { span: [{ type: i0.Input, args: [{ isSignal: true, alias: "span", required: false }] }], spanSm: [{ type: i0.Input, args: [{ isSignal: true, alias: "spanSm", required: false }] }], spanMd: [{ type: i0.Input, args: [{ isSignal: true, alias: "spanMd", required: false }] }], spanLg: [{ type: i0.Input, args: [{ isSignal: true, alias: "spanLg", required: false }] }], spanXl: [{ type: i0.Input, args: [{ isSignal: true, alias: "spanXl", required: false }] }], itemClass: [{
                type: HostBinding,
                args: ['class.orbit-form-grid__item']
            }], baseSpan: [{
                type: HostBinding,
                args: ['style.--orbit-form-grid-span']
            }], smallSpan: [{
                type: HostBinding,
                args: ['style.--orbit-form-grid-span-sm']
            }], mediumSpan: [{
                type: HostBinding,
                args: ['style.--orbit-form-grid-span-md']
            }], largeSpan: [{
                type: HostBinding,
                args: ['style.--orbit-form-grid-span-lg']
            }], extraLargeSpan: [{
                type: HostBinding,
                args: ['style.--orbit-form-grid-span-xl']
            }] } });

let formSectionSequence = 0;
class OrbitFormSectionComponent {
    constructor() {
        this.title = input('', /* @ts-ignore */
        ...(ngDevMode ? [{ debugName: "title" }] : /* istanbul ignore next */ []));
        /** Optional visual workflow index, for example 1 or "01". */
        this.index = input(null, /* @ts-ignore */
        ...(ngDevMode ? [{ debugName: "index" }] : /* istanbul ignore next */ []));
        this.divided = input(false, { ...(ngDevMode ? { debugName: "divided" } : /* istanbul ignore next */ {}), transform: booleanAttribute });
        this.fill = input(false, { ...(ngDevMode ? { debugName: "fill" } : /* istanbul ignore next */ {}), transform: booleanAttribute });
        this.contentSpacing = input(false, { ...(ngDevMode ? { debugName: "contentSpacing" } : /* istanbul ignore next */ {}), transform: booleanAttribute });
        this.collapsible = input(false, { ...(ngDevMode ? { debugName: "collapsible" } : /* istanbul ignore next */ {}), transform: booleanAttribute });
        /** Overrides density for this section without changing its parent form. */
        this.density = input('inherit', /* @ts-ignore */
        ...(ngDevMode ? [{ debugName: "density" }] : /* istanbul ignore next */ []));
        this.collapsed = signal(false, /* @ts-ignore */
        ...(ngDevMode ? [{ debugName: "collapsed" }] : /* istanbul ignore next */ []));
        this.bodyId = `orbit-form-section-body-${++formSectionSequence}`;
    }
    get labelledBy() {
        return this.title() || this.index() !== null ? `${this.bodyId}-title` : null;
    }
    toggle() {
        this.collapsed.update((collapsed) => !collapsed);
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "22.0.7", ngImport: i0, type: OrbitFormSectionComponent, deps: [], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "22.0.7", type: OrbitFormSectionComponent, isStandalone: true, selector: "orbit-form-section", inputs: { title: { classPropertyName: "title", publicName: "title", isSignal: true, isRequired: false, transformFunction: null }, index: { classPropertyName: "index", publicName: "index", isSignal: true, isRequired: false, transformFunction: null }, divided: { classPropertyName: "divided", publicName: "divided", isSignal: true, isRequired: false, transformFunction: null }, fill: { classPropertyName: "fill", publicName: "fill", isSignal: true, isRequired: false, transformFunction: null }, contentSpacing: { classPropertyName: "contentSpacing", publicName: "contentSpacing", isSignal: true, isRequired: false, transformFunction: null }, collapsible: { classPropertyName: "collapsible", publicName: "collapsible", isSignal: true, isRequired: false, transformFunction: null }, density: { classPropertyName: "density", publicName: "density", isSignal: true, isRequired: false, transformFunction: null } }, host: { properties: { "class.orbit-form-section--fill": "fill()" } }, ngImport: i0, template: "<section\n  class=\"orbit-form-section\"\n  [class.orbit-form-section--divided]=\"divided()\"\n  [class.orbit-form-section--content-spaced]=\"contentSpacing()\"\n  [class.orbit-form-section--compact]=\"density() === 'compact'\"\n>\n  @if (title() || index() !== null) {\n    <h2 class=\"orbit-form-section__title\" [attr.id]=\"labelledBy\">\n      @if (collapsible()) {\n        <button\n          type=\"button\"\n          class=\"orbit-form-section__toggle\"\n          [attr.aria-controls]=\"bodyId\"\n          [attr.aria-expanded]=\"!collapsed()\"\n          (click)=\"toggle()\"\n        >\n          @if (index() !== null) {\n            <span class=\"orbit-form-section__index\">{{ index() }}</span>\n          }\n          @if (title()) {\n            <span>{{ title() }}</span>\n          }\n          <span\n            class=\"orbit-form-section__toggle-chevron\"\n            [class.orbit-form-section__toggle-chevron--collapsed]=\"collapsed()\"\n            aria-hidden=\"true\"\n            >\u2304</span\n          >\n        </button>\n      } @else {\n        @if (index() !== null) {\n          <span class=\"orbit-form-section__index\">{{ index() }}</span>\n        }\n        @if (title()) {\n          <span>{{ title() }}</span>\n        }\n      }\n    </h2>\n  }\n  <div\n    class=\"orbit-form-section__body\"\n    [attr.id]=\"collapsible() ? bodyId : null\"\n    [attr.role]=\"collapsible() ? 'region' : null\"\n    [attr.aria-labelledby]=\"collapsible() ? labelledBy : null\"\n    [hidden]=\"collapsible() && collapsed()\"\n  >\n    <ng-content />\n  </div>\n</section>\n", styles: [":host{display:block}.orbit-form-section{display:block}.orbit-form-section--divided{padding-top:var(--orbit-space-3);margin-top:var(--orbit-space-3);border-top:2px solid var(--orbit-border-subtle)}.orbit-form-section--fill{display:flex;flex-direction:column;height:100%;min-height:0}.orbit-form-section__title{display:flex;align-items:center;gap:var(--orbit-space-2);margin:0 0 var(--orbit-space-2);font-size:var(--orbit-font-size-xs);font-weight:var(--orbit-font-weight-emphasis);letter-spacing:.06em;text-transform:uppercase;color:var(--orbit-text-secondary);font-family:var(--orbit-font-sans)}.orbit-form-section__index{color:var(--orbit-text-primary);font-variant-numeric:tabular-nums}.orbit-form-section__toggle{display:flex;align-items:center;gap:var(--orbit-space-2);width:100%;padding:0;border:0;background:transparent;color:inherit;cursor:pointer;font:inherit;text-align:left}.orbit-form-section__toggle:focus-visible{outline:2px solid var(--orbit-action-primary-bg);outline-offset:2px;border-radius:var(--orbit-radius-control)}.orbit-form-section__toggle-chevron{display:inline-flex;width:1rem;height:1rem;flex-shrink:0;transition:transform .15s ease}.orbit-form-section__toggle-chevron--collapsed{transform:rotate(-90deg)}.orbit-form-section__body{display:flex;flex-direction:column;gap:var(--orbit-space-2)}.orbit-form-section--compact .orbit-form-section__title{margin-bottom:var(--orbit-space-1)}.orbit-form-section--compact .orbit-form-section__body{gap:var(--orbit-space-1)}.orbit-form-section--content-spaced .orbit-form-section__body{margin-top:var(--orbit-space-2)}.orbit-form-section--fill .orbit-form-section__body{flex:1 1 auto;min-height:0}\n"], changeDetection: i0.ChangeDetectionStrategy.OnPush }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "22.0.7", ngImport: i0, type: OrbitFormSectionComponent, decorators: [{
            type: Component,
            args: [{ selector: 'orbit-form-section', changeDetection: ChangeDetectionStrategy.OnPush, host: {
                        '[class.orbit-form-section--fill]': 'fill()',
                    }, template: "<section\n  class=\"orbit-form-section\"\n  [class.orbit-form-section--divided]=\"divided()\"\n  [class.orbit-form-section--content-spaced]=\"contentSpacing()\"\n  [class.orbit-form-section--compact]=\"density() === 'compact'\"\n>\n  @if (title() || index() !== null) {\n    <h2 class=\"orbit-form-section__title\" [attr.id]=\"labelledBy\">\n      @if (collapsible()) {\n        <button\n          type=\"button\"\n          class=\"orbit-form-section__toggle\"\n          [attr.aria-controls]=\"bodyId\"\n          [attr.aria-expanded]=\"!collapsed()\"\n          (click)=\"toggle()\"\n        >\n          @if (index() !== null) {\n            <span class=\"orbit-form-section__index\">{{ index() }}</span>\n          }\n          @if (title()) {\n            <span>{{ title() }}</span>\n          }\n          <span\n            class=\"orbit-form-section__toggle-chevron\"\n            [class.orbit-form-section__toggle-chevron--collapsed]=\"collapsed()\"\n            aria-hidden=\"true\"\n            >\u2304</span\n          >\n        </button>\n      } @else {\n        @if (index() !== null) {\n          <span class=\"orbit-form-section__index\">{{ index() }}</span>\n        }\n        @if (title()) {\n          <span>{{ title() }}</span>\n        }\n      }\n    </h2>\n  }\n  <div\n    class=\"orbit-form-section__body\"\n    [attr.id]=\"collapsible() ? bodyId : null\"\n    [attr.role]=\"collapsible() ? 'region' : null\"\n    [attr.aria-labelledby]=\"collapsible() ? labelledBy : null\"\n    [hidden]=\"collapsible() && collapsed()\"\n  >\n    <ng-content />\n  </div>\n</section>\n", styles: [":host{display:block}.orbit-form-section{display:block}.orbit-form-section--divided{padding-top:var(--orbit-space-3);margin-top:var(--orbit-space-3);border-top:2px solid var(--orbit-border-subtle)}.orbit-form-section--fill{display:flex;flex-direction:column;height:100%;min-height:0}.orbit-form-section__title{display:flex;align-items:center;gap:var(--orbit-space-2);margin:0 0 var(--orbit-space-2);font-size:var(--orbit-font-size-xs);font-weight:var(--orbit-font-weight-emphasis);letter-spacing:.06em;text-transform:uppercase;color:var(--orbit-text-secondary);font-family:var(--orbit-font-sans)}.orbit-form-section__index{color:var(--orbit-text-primary);font-variant-numeric:tabular-nums}.orbit-form-section__toggle{display:flex;align-items:center;gap:var(--orbit-space-2);width:100%;padding:0;border:0;background:transparent;color:inherit;cursor:pointer;font:inherit;text-align:left}.orbit-form-section__toggle:focus-visible{outline:2px solid var(--orbit-action-primary-bg);outline-offset:2px;border-radius:var(--orbit-radius-control)}.orbit-form-section__toggle-chevron{display:inline-flex;width:1rem;height:1rem;flex-shrink:0;transition:transform .15s ease}.orbit-form-section__toggle-chevron--collapsed{transform:rotate(-90deg)}.orbit-form-section__body{display:flex;flex-direction:column;gap:var(--orbit-space-2)}.orbit-form-section--compact .orbit-form-section__title{margin-bottom:var(--orbit-space-1)}.orbit-form-section--compact .orbit-form-section__body{gap:var(--orbit-space-1)}.orbit-form-section--content-spaced .orbit-form-section__body{margin-top:var(--orbit-space-2)}.orbit-form-section--fill .orbit-form-section__body{flex:1 1 auto;min-height:0}\n"] }]
        }], propDecorators: { title: [{ type: i0.Input, args: [{ isSignal: true, alias: "title", required: false }] }], index: [{ type: i0.Input, args: [{ isSignal: true, alias: "index", required: false }] }], divided: [{ type: i0.Input, args: [{ isSignal: true, alias: "divided", required: false }] }], fill: [{ type: i0.Input, args: [{ isSignal: true, alias: "fill", required: false }] }], contentSpacing: [{ type: i0.Input, args: [{ isSignal: true, alias: "contentSpacing", required: false }] }], collapsible: [{ type: i0.Input, args: [{ isSignal: true, alias: "collapsible", required: false }] }], density: [{ type: i0.Input, args: [{ isSignal: true, alias: "density", required: false }] }] } });

class OrbitPillSwitchComponent {
    constructor() {
        this.ariaLabel = input('Selettore', /* @ts-ignore */
        ...(ngDevMode ? [{ debugName: "ariaLabel" }] : /* istanbul ignore next */ []));
        this.options = input([], /* @ts-ignore */
        ...(ngDevMode ? [{ debugName: "options" }] : /* istanbul ignore next */ []));
        this.disabled = input(false, { ...(ngDevMode ? { debugName: "disabled" } : /* istanbul ignore next */ {}), transform: booleanAttribute });
        this.valueChange = output();
        this.selectedValue = signal(null, /* @ts-ignore */
        ...(ngDevMode ? [{ debugName: "selectedValue" }] : /* istanbul ignore next */ []));
        this.isDisabled = signal(false, /* @ts-ignore */
        ...(ngDevMode ? [{ debugName: "isDisabled" }] : /* istanbul ignore next */ []));
        this.onChange = () => undefined;
        this.onTouched = () => undefined;
    }
    writeValue(val) {
        this.selectedValue.set(val);
    }
    registerOnChange(fn) {
        this.onChange = fn;
    }
    registerOnTouched(fn) {
        this.onTouched = fn;
    }
    setDisabledState(isDisabled) {
        this.isDisabled.set(isDisabled);
    }
    select(option) {
        if (this.isDisabled() || option.disabled || option.value === this.selectedValue())
            return;
        this.selectedValue.set(option.value);
        this.onChange(option.value);
        this.onTouched();
        this.valueChange.emit(option.value);
    }
    trackByValue(_, option) {
        return option.value;
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "22.0.7", ngImport: i0, type: OrbitPillSwitchComponent, deps: [], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "22.0.7", type: OrbitPillSwitchComponent, isStandalone: true, selector: "orbit-pill-switch", inputs: { ariaLabel: { classPropertyName: "ariaLabel", publicName: "ariaLabel", isSignal: true, isRequired: false, transformFunction: null }, options: { classPropertyName: "options", publicName: "options", isSignal: true, isRequired: false, transformFunction: null }, disabled: { classPropertyName: "disabled", publicName: "disabled", isSignal: true, isRequired: false, transformFunction: null } }, outputs: { valueChange: "valueChange" }, providers: [
            {
                provide: NG_VALUE_ACCESSOR,
                useExisting: forwardRef(() => OrbitPillSwitchComponent),
                multi: true,
            },
        ], ngImport: i0, template: "<div\n  class=\"orbit-pill-switch\"\n  role=\"radiogroup\"\n  [attr.aria-label]=\"ariaLabel()\"\n  [class.orbit-pill-switch--disabled]=\"isDisabled()\"\n>\n  @for (option of options(); track option.value) {\n    <button\n      type=\"button\"\n      class=\"orbit-pill-switch__option\"\n      role=\"radio\"\n      [class.orbit-pill-switch__option--selected]=\"option.value === selectedValue()\"\n      [attr.aria-checked]=\"option.value === selectedValue()\"\n      [disabled]=\"isDisabled() || option.disabled\"\n      (click)=\"select(option)\"\n    >\n      {{ option.label }}\n    </button>\n  }\n</div>\n", styles: [":host{display:block}.orbit-pill-switch{display:inline-flex;height:var(--orbit-control-height);max-width:100%;padding:3px;gap:2px;border:1px solid var(--orbit-border-subtle);border-radius:var(--orbit-radius-control);background:var(--orbit-surface-subtle)}.orbit-pill-switch--disabled{cursor:not-allowed;opacity:.55;pointer-events:none}.orbit-pill-switch__option{display:inline-flex;align-items:center;justify-content:center;height:calc(var(--orbit-control-height) - 8px);min-width:0;border:0;border-radius:var(--orbit-radius-sm);padding:0 .625rem;background:transparent;color:var(--orbit-text-secondary);font-family:var(--orbit-font-sans);font-size:var(--orbit-font-size-xs);font-weight:var(--orbit-font-weight-emphasis);line-height:1.25;white-space:nowrap;cursor:pointer;transition:background-color .15s ease,color .15s ease,box-shadow .15s ease}.orbit-pill-switch__option:hover:not(:disabled){color:var(--orbit-text-primary)}.orbit-pill-switch__option:focus-visible{outline:2px solid var(--orbit-action-primary-bg);outline-offset:1px}.orbit-pill-switch__option--selected{background:var(--orbit-surface-default);color:var(--orbit-action-primary-bg);box-shadow:var(--orbit-shadow-raised)}.orbit-pill-switch__option:disabled{cursor:not-allowed;opacity:.55}\n"], changeDetection: i0.ChangeDetectionStrategy.OnPush }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "22.0.7", ngImport: i0, type: OrbitPillSwitchComponent, decorators: [{
            type: Component,
            args: [{ selector: 'orbit-pill-switch', changeDetection: ChangeDetectionStrategy.OnPush, providers: [
                        {
                            provide: NG_VALUE_ACCESSOR,
                            useExisting: forwardRef(() => OrbitPillSwitchComponent),
                            multi: true,
                        },
                    ], template: "<div\n  class=\"orbit-pill-switch\"\n  role=\"radiogroup\"\n  [attr.aria-label]=\"ariaLabel()\"\n  [class.orbit-pill-switch--disabled]=\"isDisabled()\"\n>\n  @for (option of options(); track option.value) {\n    <button\n      type=\"button\"\n      class=\"orbit-pill-switch__option\"\n      role=\"radio\"\n      [class.orbit-pill-switch__option--selected]=\"option.value === selectedValue()\"\n      [attr.aria-checked]=\"option.value === selectedValue()\"\n      [disabled]=\"isDisabled() || option.disabled\"\n      (click)=\"select(option)\"\n    >\n      {{ option.label }}\n    </button>\n  }\n</div>\n", styles: [":host{display:block}.orbit-pill-switch{display:inline-flex;height:var(--orbit-control-height);max-width:100%;padding:3px;gap:2px;border:1px solid var(--orbit-border-subtle);border-radius:var(--orbit-radius-control);background:var(--orbit-surface-subtle)}.orbit-pill-switch--disabled{cursor:not-allowed;opacity:.55;pointer-events:none}.orbit-pill-switch__option{display:inline-flex;align-items:center;justify-content:center;height:calc(var(--orbit-control-height) - 8px);min-width:0;border:0;border-radius:var(--orbit-radius-sm);padding:0 .625rem;background:transparent;color:var(--orbit-text-secondary);font-family:var(--orbit-font-sans);font-size:var(--orbit-font-size-xs);font-weight:var(--orbit-font-weight-emphasis);line-height:1.25;white-space:nowrap;cursor:pointer;transition:background-color .15s ease,color .15s ease,box-shadow .15s ease}.orbit-pill-switch__option:hover:not(:disabled){color:var(--orbit-text-primary)}.orbit-pill-switch__option:focus-visible{outline:2px solid var(--orbit-action-primary-bg);outline-offset:1px}.orbit-pill-switch__option--selected{background:var(--orbit-surface-default);color:var(--orbit-action-primary-bg);box-shadow:var(--orbit-shadow-raised)}.orbit-pill-switch__option:disabled{cursor:not-allowed;opacity:.55}\n"] }]
        }], propDecorators: { ariaLabel: [{ type: i0.Input, args: [{ isSignal: true, alias: "ariaLabel", required: false }] }], options: [{ type: i0.Input, args: [{ isSignal: true, alias: "options", required: false }] }], disabled: [{ type: i0.Input, args: [{ isSignal: true, alias: "disabled", required: false }] }], valueChange: [{ type: i0.Output, args: ["valueChange"] }] } });

class OrbitSelectComponent {
    constructor() {
        this.options = input([], /* @ts-ignore */
        ...(ngDevMode ? [{ debugName: "options" }] : /* istanbul ignore next */ []));
        this.placeholder = input('Seleziona...', /* @ts-ignore */
        ...(ngDevMode ? [{ debugName: "placeholder" }] : /* istanbul ignore next */ []));
        this.inputId = input('', /* @ts-ignore */
        ...(ngDevMode ? [{ debugName: "inputId" }] : /* istanbul ignore next */ []));
        this.required = input(false, { ...(ngDevMode ? { debugName: "required" } : /* istanbul ignore next */ {}), transform: booleanAttribute });
        this.invalid = input(false, { ...(ngDevMode ? { debugName: "invalid" } : /* istanbul ignore next */ {}), transform: booleanAttribute });
        this.searchable = input(false, { ...(ngDevMode ? { debugName: "searchable" } : /* istanbul ignore next */ {}), transform: booleanAttribute });
        this.valueChange = output();
        this.selectedValue = signal(null, /* @ts-ignore */
        ...(ngDevMode ? [{ debugName: "selectedValue" }] : /* istanbul ignore next */ []));
        this.inputText = signal('', /* @ts-ignore */
        ...(ngDevMode ? [{ debugName: "inputText" }] : /* istanbul ignore next */ []));
        this.isOpen = signal(false, /* @ts-ignore */
        ...(ngDevMode ? [{ debugName: "isOpen" }] : /* istanbul ignore next */ []));
        this.queryText = signal('', /* @ts-ignore */
        ...(ngDevMode ? [{ debugName: "queryText" }] : /* istanbul ignore next */ []));
        this.activeIndex = signal(-1, /* @ts-ignore */
        ...(ngDevMode ? [{ debugName: "activeIndex" }] : /* istanbul ignore next */ []));
        this.isDisabled = signal(false, /* @ts-ignore */
        ...(ngDevMode ? [{ debugName: "isDisabled" }] : /* istanbul ignore next */ []));
        this.onChange = () => undefined;
        this.onTouched = () => undefined;
    }
    writeValue(val) {
        this.selectedValue.set(val);
        this.inputText.set(this.getOptionLabel(val));
        this.queryText.set('');
    }
    registerOnChange(fn) {
        this.onChange = fn;
    }
    registerOnTouched(fn) {
        this.onTouched = fn;
    }
    setDisabledState(isDisabled) {
        this.isDisabled.set(isDisabled);
    }
    get filteredOptions() {
        const q = this.queryText().toLocaleLowerCase('it-IT');
        return this.options().filter((o) => o.label.toLocaleLowerCase('it-IT').includes(q));
    }
    onInputChange(text) {
        if (!this.searchable())
            return;
        this.inputText.set(text);
        this.queryText.set(text);
        this.activeIndex.set(-1);
        const match = this.options().find((o) => !o.disabled &&
            o.label.toLocaleLowerCase('it-IT') === text.toLocaleLowerCase('it-IT'));
        this.setValue(match ? match.value : null);
    }
    onOptionSelect(option) {
        if (option.disabled)
            return;
        this.inputText.set(option.label);
        this.queryText.set('');
        this.setValue(option.value);
        this.isOpen.set(false);
    }
    onFocus() {
        this.openAll();
    }
    onInputClick() {
        if (!this.isOpen())
            this.openAll();
    }
    onToggleClick() {
        this.openAll();
    }
    onBlur() {
        this.onTouched();
        this.isOpen.set(false);
        if (this.selectedValue() == null)
            this.inputText.set('');
    }
    onKeydown(event) {
        if (event.key === 'Escape') {
            this.isOpen.set(false);
            return;
        }
        if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
            event.preventDefault();
            this.isOpen.set(true);
            this.moveActive(event.key === 'ArrowDown' ? 1 : -1);
            return;
        }
        if (event.key === 'Enter' && this.activeIndex() >= 0) {
            event.preventDefault();
            const opts = this.filteredOptions;
            if (opts[this.activeIndex()]) {
                this.onOptionSelect(opts[this.activeIndex()]);
            }
        }
    }
    trackByValue(_, option) {
        return option.value;
    }
    openAll() {
        this.isOpen.set(true);
        this.activeIndex.set(-1);
        this.queryText.set('');
    }
    moveActive(direction) {
        const opts = this.filteredOptions;
        if (!opts.length)
            return;
        let idx = this.activeIndex();
        for (let i = 0; i < opts.length; i++) {
            idx = (idx + direction + opts.length) % opts.length;
            if (!opts[idx].disabled) {
                this.activeIndex.set(idx);
                return;
            }
        }
    }
    setValue(val) {
        if (this.selectedValue() === val)
            return;
        this.selectedValue.set(val);
        this.onChange(val);
        this.valueChange.emit(val);
    }
    getOptionLabel(val) {
        return this.options().find((o) => o.value === val)?.label || '';
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "22.0.7", ngImport: i0, type: OrbitSelectComponent, deps: [], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "22.0.7", type: OrbitSelectComponent, isStandalone: true, selector: "orbit-select", inputs: { options: { classPropertyName: "options", publicName: "options", isSignal: true, isRequired: false, transformFunction: null }, placeholder: { classPropertyName: "placeholder", publicName: "placeholder", isSignal: true, isRequired: false, transformFunction: null }, inputId: { classPropertyName: "inputId", publicName: "inputId", isSignal: true, isRequired: false, transformFunction: null }, required: { classPropertyName: "required", publicName: "required", isSignal: true, isRequired: false, transformFunction: null }, invalid: { classPropertyName: "invalid", publicName: "invalid", isSignal: true, isRequired: false, transformFunction: null }, searchable: { classPropertyName: "searchable", publicName: "searchable", isSignal: true, isRequired: false, transformFunction: null } }, outputs: { valueChange: "valueChange" }, host: { properties: { "class.orbit-select--disabled": "isDisabled()", "class.orbit-select--invalid": "invalid()" } }, providers: [
            {
                provide: NG_VALUE_ACCESSOR,
                useExisting: forwardRef(() => OrbitSelectComponent),
                multi: true,
            },
        ], ngImport: i0, template: "<div class=\"orbit-select__wrapper\">\n  <input\n    type=\"text\"\n    class=\"orbit-select__input\"\n    [class.orbit-select__input--searchable]=\"searchable()\"\n    [id]=\"inputId() || null\"\n    [placeholder]=\"placeholder()\"\n    [value]=\"inputText()\"\n    [readonly]=\"!searchable()\"\n    [disabled]=\"isDisabled()\"\n    [required]=\"required()\"\n    (input)=\"onInputChange($any($event.target).value)\"\n    (focus)=\"onFocus()\"\n    (click)=\"onInputClick()\"\n    (blur)=\"onBlur()\"\n    (keydown)=\"onKeydown($event)\"\n  />\n  <button\n    type=\"button\"\n    class=\"orbit-select__toggle\"\n    [disabled]=\"isDisabled()\"\n    aria-label=\"Apri elenco\"\n    (mousedown)=\"$event.preventDefault()\"\n    (click)=\"onToggleClick()\"\n  >\n    <svg class=\"orbit-select__chevron\" [class.orbit-select__chevron--open]=\"isOpen()\" viewBox=\"0 0 16 16\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">\n      <path d=\"M4 6L8 10L12 6\" stroke=\"currentColor\" stroke-width=\"1.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/>\n    </svg>\n  </button>\n\n  @if (isOpen() && !isDisabled()) {\n    <div class=\"orbit-select__menu\" role=\"listbox\" [attr.aria-labelledby]=\"inputId() || null\">\n      @for (option of filteredOptions; track option.value; let i = $index) {\n        <button\n          type=\"button\"\n          class=\"orbit-select__option\"\n          [class.orbit-select__option--selected]=\"option.value === selectedValue()\"\n          [class.orbit-select__option--active]=\"i === activeIndex()\"\n          [disabled]=\"option.disabled\"\n          (mousedown)=\"$event.preventDefault()\"\n          (click)=\"onOptionSelect(option)\"\n        >\n          {{ option.label }}\n        </button>\n      }\n      @if (filteredOptions.length === 0) {\n        <p class=\"orbit-select__empty\">Nessun risultato</p>\n      }\n    </div>\n  }\n</div>\n", styles: [":host{display:block}.orbit-select__wrapper{position:relative;display:flex;align-items:center}.orbit-select__input{width:100%;height:var(--orbit-control-height);padding:0 2.5rem 0 var(--orbit-control-padding-inline);border:1px solid var(--orbit-border-subtle);border-radius:var(--orbit-radius-control);background:var(--orbit-surface-default);color:var(--orbit-text-primary);font-family:var(--orbit-font-sans);font-size:var(--orbit-font-size-body);line-height:1.25;cursor:pointer;transition:border-color .15s ease,box-shadow .15s ease}.orbit-select__input--searchable{cursor:text}.orbit-select__input::placeholder{color:var(--orbit-text-secondary)}.orbit-select__input:disabled{cursor:not-allowed;background:var(--orbit-surface-subtle);color:var(--orbit-text-secondary)}.orbit-select__input:focus{outline:0;border-color:var(--orbit-action-primary-bg);box-shadow:var(--orbit-focus-ring)}:host(.orbit-select--invalid) .orbit-select__input{border-color:var(--orbit-status-danger)}:host(.orbit-select--invalid) .orbit-select__input:focus{box-shadow:0 0 0 3px color-mix(in srgb,var(--orbit-status-danger) 25%,transparent)}:host(.orbit-select--disabled) .orbit-select__wrapper{opacity:.55;pointer-events:none}.orbit-select__toggle{position:absolute;top:0;right:0;display:grid;place-items:center;width:2.25rem;height:100%;padding:0;border:0;border-left:1px solid var(--orbit-border-subtle);border-radius:0 var(--orbit-radius-control) var(--orbit-radius-control) 0;background:transparent;color:var(--orbit-text-secondary);cursor:pointer;transition:background-color .15s ease,color .15s ease}.orbit-select__toggle:hover:not(:disabled){background:var(--orbit-surface-subtle);color:var(--orbit-action-primary-bg)}.orbit-select__toggle:focus-visible{outline:2px solid var(--orbit-action-primary-bg);outline-offset:-2px}.orbit-select__toggle:disabled{cursor:not-allowed;color:var(--orbit-text-secondary)}.orbit-select__chevron{width:1rem;height:1rem;transition:transform .15s ease}.orbit-select__chevron--open{transform:rotate(180deg)}.orbit-select__menu{position:absolute;z-index:var(--orbit-z-modal, 1050);top:calc(100% + .25rem);left:0;right:0;max-height:13.5rem;padding:.25rem;overflow-y:auto;border:1px solid var(--orbit-border-subtle);border-radius:var(--orbit-radius-control);background:var(--orbit-surface-default);box-shadow:var(--orbit-shadow-overlay)}.orbit-select__option{display:block;width:100%;min-height:2rem;padding:0 var(--orbit-space-2);border:0;border-radius:var(--orbit-radius-sm);background:transparent;color:var(--orbit-text-primary);font-family:var(--orbit-font-sans);font-size:var(--orbit-font-size-body);text-align:left;cursor:pointer;transition:background-color .15s ease,color .15s ease}.orbit-select__option:hover:not(:disabled),.orbit-select__option--active:not(:disabled),.orbit-select__option--selected:not(:disabled){background:color-mix(in srgb,var(--orbit-action-primary-bg) 15%,transparent);color:var(--orbit-action-primary-bg)}.orbit-select__option:disabled{cursor:not-allowed;color:var(--orbit-text-secondary);opacity:.55}.orbit-select__empty{margin:0;padding:var(--orbit-space-1) var(--orbit-space-2);color:var(--orbit-text-secondary);font-size:var(--orbit-font-size-body)}\n"], changeDetection: i0.ChangeDetectionStrategy.OnPush }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "22.0.7", ngImport: i0, type: OrbitSelectComponent, decorators: [{
            type: Component,
            args: [{ selector: 'orbit-select', changeDetection: ChangeDetectionStrategy.OnPush, providers: [
                        {
                            provide: NG_VALUE_ACCESSOR,
                            useExisting: forwardRef(() => OrbitSelectComponent),
                            multi: true,
                        },
                    ], host: {
                        '[class.orbit-select--disabled]': 'isDisabled()',
                        '[class.orbit-select--invalid]': 'invalid()',
                    }, template: "<div class=\"orbit-select__wrapper\">\n  <input\n    type=\"text\"\n    class=\"orbit-select__input\"\n    [class.orbit-select__input--searchable]=\"searchable()\"\n    [id]=\"inputId() || null\"\n    [placeholder]=\"placeholder()\"\n    [value]=\"inputText()\"\n    [readonly]=\"!searchable()\"\n    [disabled]=\"isDisabled()\"\n    [required]=\"required()\"\n    (input)=\"onInputChange($any($event.target).value)\"\n    (focus)=\"onFocus()\"\n    (click)=\"onInputClick()\"\n    (blur)=\"onBlur()\"\n    (keydown)=\"onKeydown($event)\"\n  />\n  <button\n    type=\"button\"\n    class=\"orbit-select__toggle\"\n    [disabled]=\"isDisabled()\"\n    aria-label=\"Apri elenco\"\n    (mousedown)=\"$event.preventDefault()\"\n    (click)=\"onToggleClick()\"\n  >\n    <svg class=\"orbit-select__chevron\" [class.orbit-select__chevron--open]=\"isOpen()\" viewBox=\"0 0 16 16\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">\n      <path d=\"M4 6L8 10L12 6\" stroke=\"currentColor\" stroke-width=\"1.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/>\n    </svg>\n  </button>\n\n  @if (isOpen() && !isDisabled()) {\n    <div class=\"orbit-select__menu\" role=\"listbox\" [attr.aria-labelledby]=\"inputId() || null\">\n      @for (option of filteredOptions; track option.value; let i = $index) {\n        <button\n          type=\"button\"\n          class=\"orbit-select__option\"\n          [class.orbit-select__option--selected]=\"option.value === selectedValue()\"\n          [class.orbit-select__option--active]=\"i === activeIndex()\"\n          [disabled]=\"option.disabled\"\n          (mousedown)=\"$event.preventDefault()\"\n          (click)=\"onOptionSelect(option)\"\n        >\n          {{ option.label }}\n        </button>\n      }\n      @if (filteredOptions.length === 0) {\n        <p class=\"orbit-select__empty\">Nessun risultato</p>\n      }\n    </div>\n  }\n</div>\n", styles: [":host{display:block}.orbit-select__wrapper{position:relative;display:flex;align-items:center}.orbit-select__input{width:100%;height:var(--orbit-control-height);padding:0 2.5rem 0 var(--orbit-control-padding-inline);border:1px solid var(--orbit-border-subtle);border-radius:var(--orbit-radius-control);background:var(--orbit-surface-default);color:var(--orbit-text-primary);font-family:var(--orbit-font-sans);font-size:var(--orbit-font-size-body);line-height:1.25;cursor:pointer;transition:border-color .15s ease,box-shadow .15s ease}.orbit-select__input--searchable{cursor:text}.orbit-select__input::placeholder{color:var(--orbit-text-secondary)}.orbit-select__input:disabled{cursor:not-allowed;background:var(--orbit-surface-subtle);color:var(--orbit-text-secondary)}.orbit-select__input:focus{outline:0;border-color:var(--orbit-action-primary-bg);box-shadow:var(--orbit-focus-ring)}:host(.orbit-select--invalid) .orbit-select__input{border-color:var(--orbit-status-danger)}:host(.orbit-select--invalid) .orbit-select__input:focus{box-shadow:0 0 0 3px color-mix(in srgb,var(--orbit-status-danger) 25%,transparent)}:host(.orbit-select--disabled) .orbit-select__wrapper{opacity:.55;pointer-events:none}.orbit-select__toggle{position:absolute;top:0;right:0;display:grid;place-items:center;width:2.25rem;height:100%;padding:0;border:0;border-left:1px solid var(--orbit-border-subtle);border-radius:0 var(--orbit-radius-control) var(--orbit-radius-control) 0;background:transparent;color:var(--orbit-text-secondary);cursor:pointer;transition:background-color .15s ease,color .15s ease}.orbit-select__toggle:hover:not(:disabled){background:var(--orbit-surface-subtle);color:var(--orbit-action-primary-bg)}.orbit-select__toggle:focus-visible{outline:2px solid var(--orbit-action-primary-bg);outline-offset:-2px}.orbit-select__toggle:disabled{cursor:not-allowed;color:var(--orbit-text-secondary)}.orbit-select__chevron{width:1rem;height:1rem;transition:transform .15s ease}.orbit-select__chevron--open{transform:rotate(180deg)}.orbit-select__menu{position:absolute;z-index:var(--orbit-z-modal, 1050);top:calc(100% + .25rem);left:0;right:0;max-height:13.5rem;padding:.25rem;overflow-y:auto;border:1px solid var(--orbit-border-subtle);border-radius:var(--orbit-radius-control);background:var(--orbit-surface-default);box-shadow:var(--orbit-shadow-overlay)}.orbit-select__option{display:block;width:100%;min-height:2rem;padding:0 var(--orbit-space-2);border:0;border-radius:var(--orbit-radius-sm);background:transparent;color:var(--orbit-text-primary);font-family:var(--orbit-font-sans);font-size:var(--orbit-font-size-body);text-align:left;cursor:pointer;transition:background-color .15s ease,color .15s ease}.orbit-select__option:hover:not(:disabled),.orbit-select__option--active:not(:disabled),.orbit-select__option--selected:not(:disabled){background:color-mix(in srgb,var(--orbit-action-primary-bg) 15%,transparent);color:var(--orbit-action-primary-bg)}.orbit-select__option:disabled{cursor:not-allowed;color:var(--orbit-text-secondary);opacity:.55}.orbit-select__empty{margin:0;padding:var(--orbit-space-1) var(--orbit-space-2);color:var(--orbit-text-secondary);font-size:var(--orbit-font-size-body)}\n"] }]
        }], propDecorators: { options: [{ type: i0.Input, args: [{ isSignal: true, alias: "options", required: false }] }], placeholder: [{ type: i0.Input, args: [{ isSignal: true, alias: "placeholder", required: false }] }], inputId: [{ type: i0.Input, args: [{ isSignal: true, alias: "inputId", required: false }] }], required: [{ type: i0.Input, args: [{ isSignal: true, alias: "required", required: false }] }], invalid: [{ type: i0.Input, args: [{ isSignal: true, alias: "invalid", required: false }] }], searchable: [{ type: i0.Input, args: [{ isSignal: true, alias: "searchable", required: false }] }], valueChange: [{ type: i0.Output, args: ["valueChange"] }] } });

class OrbitTextInputComponent {
    constructor() {
        this.type = input('text', /* @ts-ignore */
        ...(ngDevMode ? [{ debugName: "type" }] : /* istanbul ignore next */ []));
        this.placeholder = input('', /* @ts-ignore */
        ...(ngDevMode ? [{ debugName: "placeholder" }] : /* istanbul ignore next */ []));
        this.inputId = input('', /* @ts-ignore */
        ...(ngDevMode ? [{ debugName: "inputId" }] : /* istanbul ignore next */ []));
        this.autocomplete = input('off', /* @ts-ignore */
        ...(ngDevMode ? [{ debugName: "autocomplete" }] : /* istanbul ignore next */ []));
        this.required = input(false, { ...(ngDevMode ? { debugName: "required" } : /* istanbul ignore next */ {}), transform: booleanAttribute });
        this.invalid = input(false, { ...(ngDevMode ? { debugName: "invalid" } : /* istanbul ignore next */ {}), transform: booleanAttribute });
        this.leadingIcon = input('', /* @ts-ignore */
        ...(ngDevMode ? [{ debugName: "leadingIcon" }] : /* istanbul ignore next */ []));
        this.trailingIcon = input('', /* @ts-ignore */
        ...(ngDevMode ? [{ debugName: "trailingIcon" }] : /* istanbul ignore next */ []));
        this.trailingIconLabel = input('', /* @ts-ignore */
        ...(ngDevMode ? [{ debugName: "trailingIconLabel" }] : /* istanbul ignore next */ []));
        this.currencySymbol = input('€', /* @ts-ignore */
        ...(ngDevMode ? [{ debugName: "currencySymbol" }] : /* istanbul ignore next */ []));
        this.blurred = output();
        this.trailingIconClick = output();
        this.value = signal('', /* @ts-ignore */
        ...(ngDevMode ? [{ debugName: "value" }] : /* istanbul ignore next */ []));
        this.showPassword = signal(false, /* @ts-ignore */
        ...(ngDevMode ? [{ debugName: "showPassword" }] : /* istanbul ignore next */ []));
        this.isDisabled = signal(false, /* @ts-ignore */
        ...(ngDevMode ? [{ debugName: "isDisabled" }] : /* istanbul ignore next */ []));
        this.onChange = () => undefined;
        this.onTouched = () => undefined;
    }
    writeValue(val) {
        if (val == null || val === '') {
            this.value.set('');
            return;
        }
        this.value.set(this.type() === 'currency' ? this.formatCurrency(String(val)) : String(val));
    }
    registerOnChange(fn) {
        this.onChange = fn;
    }
    registerOnTouched(fn) {
        this.onTouched = fn;
    }
    setDisabledState(isDisabled) {
        this.isDisabled.set(isDisabled);
    }
    get nativeType() {
        if (this.type() === 'currency')
            return 'text';
        if (this.type() === 'password')
            return this.showPassword() ? 'text' : 'password';
        return this.type();
    }
    get inputMode() {
        switch (this.type()) {
            case 'currency':
                return 'decimal';
            case 'number':
                return 'numeric';
            case 'email':
                return 'email';
            case 'search':
                return 'search';
            case 'tel':
                return 'tel';
            case 'url':
                return 'url';
            default:
                return 'text';
        }
    }
    onInput(event) {
        const raw = event.target.value;
        const formatted = this.type() === 'currency' ? this.formatCurrency(raw) : raw;
        this.value.set(formatted);
        this.onChange(formatted);
    }
    onBlur() {
        this.onTouched();
        this.blurred.emit();
    }
    togglePasswordVisibility() {
        this.showPassword.update((v) => !v);
    }
    formatCurrency(raw) {
        const cleaned = raw.replace(/[^\d,]/g, '');
        const commaIndex = cleaned.indexOf(',');
        let intPart = commaIndex >= 0 ? cleaned.slice(0, commaIndex) : cleaned;
        let decPart = commaIndex >= 0
            ? cleaned.slice(commaIndex + 1).replace(/,/g, '').slice(0, 2)
            : '';
        intPart = intPart
            .replace(/^0+(?=\d)/, '')
            .replace(/\B(?=(\d{3})+(?!\d))/g, '.');
        if (commaIndex < 0)
            return intPart;
        return `${intPart || '0'},${decPart}`;
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "22.0.7", ngImport: i0, type: OrbitTextInputComponent, deps: [], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "22.0.7", type: OrbitTextInputComponent, isStandalone: true, selector: "orbit-text-input", inputs: { type: { classPropertyName: "type", publicName: "type", isSignal: true, isRequired: false, transformFunction: null }, placeholder: { classPropertyName: "placeholder", publicName: "placeholder", isSignal: true, isRequired: false, transformFunction: null }, inputId: { classPropertyName: "inputId", publicName: "inputId", isSignal: true, isRequired: false, transformFunction: null }, autocomplete: { classPropertyName: "autocomplete", publicName: "autocomplete", isSignal: true, isRequired: false, transformFunction: null }, required: { classPropertyName: "required", publicName: "required", isSignal: true, isRequired: false, transformFunction: null }, invalid: { classPropertyName: "invalid", publicName: "invalid", isSignal: true, isRequired: false, transformFunction: null }, leadingIcon: { classPropertyName: "leadingIcon", publicName: "leadingIcon", isSignal: true, isRequired: false, transformFunction: null }, trailingIcon: { classPropertyName: "trailingIcon", publicName: "trailingIcon", isSignal: true, isRequired: false, transformFunction: null }, trailingIconLabel: { classPropertyName: "trailingIconLabel", publicName: "trailingIconLabel", isSignal: true, isRequired: false, transformFunction: null }, currencySymbol: { classPropertyName: "currencySymbol", publicName: "currencySymbol", isSignal: true, isRequired: false, transformFunction: null } }, outputs: { blurred: "blurred", trailingIconClick: "trailingIconClick" }, host: { properties: { "class.orbit-input--disabled": "isDisabled()", "class.orbit-input--invalid": "invalid()" } }, providers: [
            {
                provide: NG_VALUE_ACCESSOR,
                useExisting: forwardRef(() => OrbitTextInputComponent),
                multi: true,
            },
        ], ngImport: i0, template: "<div\n  class=\"orbit-input\"\n  [class.orbit-input--with-leading]=\"leadingIcon() || type() === 'currency'\"\n  [class.orbit-input--with-trailing]=\"trailingIcon() || type() === 'password'\"\n>\n  @if (leadingIcon() && type() !== 'currency') {\n    <span class=\"orbit-input__icon orbit-input__icon--leading\" [class]=\"leadingIcon()\" aria-hidden=\"true\"></span>\n  }\n  @if (type() === 'currency') {\n    <span class=\"orbit-input__symbol\" aria-hidden=\"true\">{{ currencySymbol() }}</span>\n  }\n\n  <input\n    class=\"orbit-input__control\"\n    [id]=\"inputId() || null\"\n    [type]=\"nativeType\"\n    [attr.inputmode]=\"inputMode\"\n    [value]=\"value()\"\n    [placeholder]=\"placeholder()\"\n    [autocomplete]=\"autocomplete()\"\n    [required]=\"required()\"\n    [disabled]=\"isDisabled()\"\n    (input)=\"onInput($event)\"\n    (blur)=\"onBlur()\"\n  />\n\n  @if (type() === 'password') {\n    <button\n      type=\"button\"\n      class=\"orbit-input__action\"\n      [disabled]=\"isDisabled()\"\n      [attr.aria-label]=\"showPassword() ? 'Nascondi password' : 'Mostra password'\"\n      (click)=\"togglePasswordVisibility()\"\n    >\n      <span [class]=\"showPassword() ? 'bi bi-eye-slash' : 'bi bi-eye'\" aria-hidden=\"true\"></span>\n    </button>\n  } @else if (trailingIcon() && trailingIconLabel()) {\n    <button\n      type=\"button\"\n      class=\"orbit-input__action\"\n      [disabled]=\"isDisabled()\"\n      [attr.aria-label]=\"trailingIconLabel()\"\n      (click)=\"trailingIconClick.emit()\"\n    >\n      <span [class]=\"trailingIcon()\" aria-hidden=\"true\"></span>\n    </button>\n  } @else if (trailingIcon()) {\n    <span class=\"orbit-input__icon orbit-input__icon--trailing\" [class]=\"trailingIcon()\" aria-hidden=\"true\"></span>\n  }\n</div>\n", styles: [":host{display:block}.orbit-input{display:flex;align-items:center;width:100%;height:var(--orbit-control-height);border:1px solid var(--orbit-border-subtle);border-radius:var(--orbit-radius-control);background:var(--orbit-surface-default);font-family:var(--orbit-font-sans);overflow:hidden;transition:border-color .15s ease,box-shadow .15s ease}.orbit-input:focus-within{border-color:var(--orbit-action-primary-bg);box-shadow:var(--orbit-focus-ring)}:host(.orbit-input--invalid) .orbit-input,.orbit-input--invalid{border-color:var(--orbit-status-danger)}:host(.orbit-input--invalid) .orbit-input:focus-within,.orbit-input--invalid:focus-within{box-shadow:0 0 0 3px color-mix(in srgb,var(--orbit-status-danger) 25%,transparent)}:host(.orbit-input--disabled) .orbit-input,.orbit-input--disabled{background:var(--orbit-surface-subtle);pointer-events:none}.orbit-input__control{min-width:0;width:100%;height:100%;padding:0 var(--orbit-control-padding-inline);border:0;outline:0;background:transparent;color:var(--orbit-text-primary);font:inherit;font-size:var(--orbit-font-size-body);line-height:1.25;cursor:text}.orbit-input__control::placeholder{color:var(--orbit-text-secondary)}.orbit-input__control:disabled{cursor:not-allowed;color:var(--orbit-text-secondary)}.orbit-input__icon--leading,.orbit-input__symbol{display:grid;place-items:center;align-self:stretch;flex:0 0 2.125rem;border-right:1px solid var(--orbit-border-subtle);color:var(--orbit-text-secondary);font-size:.875rem}.orbit-input__symbol{font-style:normal;font-weight:var(--orbit-font-weight-emphasis)}.orbit-input__icon--trailing{display:grid;place-items:center;align-self:stretch;flex:0 0 2.125rem;border-left:1px solid var(--orbit-border-subtle);color:var(--orbit-text-secondary);font-size:.875rem}.orbit-input__action{display:grid;place-items:center;flex:0 0 2rem;align-self:stretch;border:0;border-left:1px solid var(--orbit-border-subtle);background:transparent;color:var(--orbit-text-secondary);cursor:pointer;transition:background-color .15s ease,color .15s ease}.orbit-input__action:hover:not(:disabled){background:var(--orbit-surface-subtle);color:var(--orbit-action-primary-bg)}.orbit-input__action:focus-visible{outline:2px solid var(--orbit-action-primary-bg);outline-offset:-2px}.orbit-input__action:disabled{cursor:not-allowed}\n"], changeDetection: i0.ChangeDetectionStrategy.OnPush }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "22.0.7", ngImport: i0, type: OrbitTextInputComponent, decorators: [{
            type: Component,
            args: [{ selector: 'orbit-text-input', changeDetection: ChangeDetectionStrategy.OnPush, providers: [
                        {
                            provide: NG_VALUE_ACCESSOR,
                            useExisting: forwardRef(() => OrbitTextInputComponent),
                            multi: true,
                        },
                    ], host: {
                        '[class.orbit-input--disabled]': 'isDisabled()',
                        '[class.orbit-input--invalid]': 'invalid()',
                    }, template: "<div\n  class=\"orbit-input\"\n  [class.orbit-input--with-leading]=\"leadingIcon() || type() === 'currency'\"\n  [class.orbit-input--with-trailing]=\"trailingIcon() || type() === 'password'\"\n>\n  @if (leadingIcon() && type() !== 'currency') {\n    <span class=\"orbit-input__icon orbit-input__icon--leading\" [class]=\"leadingIcon()\" aria-hidden=\"true\"></span>\n  }\n  @if (type() === 'currency') {\n    <span class=\"orbit-input__symbol\" aria-hidden=\"true\">{{ currencySymbol() }}</span>\n  }\n\n  <input\n    class=\"orbit-input__control\"\n    [id]=\"inputId() || null\"\n    [type]=\"nativeType\"\n    [attr.inputmode]=\"inputMode\"\n    [value]=\"value()\"\n    [placeholder]=\"placeholder()\"\n    [autocomplete]=\"autocomplete()\"\n    [required]=\"required()\"\n    [disabled]=\"isDisabled()\"\n    (input)=\"onInput($event)\"\n    (blur)=\"onBlur()\"\n  />\n\n  @if (type() === 'password') {\n    <button\n      type=\"button\"\n      class=\"orbit-input__action\"\n      [disabled]=\"isDisabled()\"\n      [attr.aria-label]=\"showPassword() ? 'Nascondi password' : 'Mostra password'\"\n      (click)=\"togglePasswordVisibility()\"\n    >\n      <span [class]=\"showPassword() ? 'bi bi-eye-slash' : 'bi bi-eye'\" aria-hidden=\"true\"></span>\n    </button>\n  } @else if (trailingIcon() && trailingIconLabel()) {\n    <button\n      type=\"button\"\n      class=\"orbit-input__action\"\n      [disabled]=\"isDisabled()\"\n      [attr.aria-label]=\"trailingIconLabel()\"\n      (click)=\"trailingIconClick.emit()\"\n    >\n      <span [class]=\"trailingIcon()\" aria-hidden=\"true\"></span>\n    </button>\n  } @else if (trailingIcon()) {\n    <span class=\"orbit-input__icon orbit-input__icon--trailing\" [class]=\"trailingIcon()\" aria-hidden=\"true\"></span>\n  }\n</div>\n", styles: [":host{display:block}.orbit-input{display:flex;align-items:center;width:100%;height:var(--orbit-control-height);border:1px solid var(--orbit-border-subtle);border-radius:var(--orbit-radius-control);background:var(--orbit-surface-default);font-family:var(--orbit-font-sans);overflow:hidden;transition:border-color .15s ease,box-shadow .15s ease}.orbit-input:focus-within{border-color:var(--orbit-action-primary-bg);box-shadow:var(--orbit-focus-ring)}:host(.orbit-input--invalid) .orbit-input,.orbit-input--invalid{border-color:var(--orbit-status-danger)}:host(.orbit-input--invalid) .orbit-input:focus-within,.orbit-input--invalid:focus-within{box-shadow:0 0 0 3px color-mix(in srgb,var(--orbit-status-danger) 25%,transparent)}:host(.orbit-input--disabled) .orbit-input,.orbit-input--disabled{background:var(--orbit-surface-subtle);pointer-events:none}.orbit-input__control{min-width:0;width:100%;height:100%;padding:0 var(--orbit-control-padding-inline);border:0;outline:0;background:transparent;color:var(--orbit-text-primary);font:inherit;font-size:var(--orbit-font-size-body);line-height:1.25;cursor:text}.orbit-input__control::placeholder{color:var(--orbit-text-secondary)}.orbit-input__control:disabled{cursor:not-allowed;color:var(--orbit-text-secondary)}.orbit-input__icon--leading,.orbit-input__symbol{display:grid;place-items:center;align-self:stretch;flex:0 0 2.125rem;border-right:1px solid var(--orbit-border-subtle);color:var(--orbit-text-secondary);font-size:.875rem}.orbit-input__symbol{font-style:normal;font-weight:var(--orbit-font-weight-emphasis)}.orbit-input__icon--trailing{display:grid;place-items:center;align-self:stretch;flex:0 0 2.125rem;border-left:1px solid var(--orbit-border-subtle);color:var(--orbit-text-secondary);font-size:.875rem}.orbit-input__action{display:grid;place-items:center;flex:0 0 2rem;align-self:stretch;border:0;border-left:1px solid var(--orbit-border-subtle);background:transparent;color:var(--orbit-text-secondary);cursor:pointer;transition:background-color .15s ease,color .15s ease}.orbit-input__action:hover:not(:disabled){background:var(--orbit-surface-subtle);color:var(--orbit-action-primary-bg)}.orbit-input__action:focus-visible{outline:2px solid var(--orbit-action-primary-bg);outline-offset:-2px}.orbit-input__action:disabled{cursor:not-allowed}\n"] }]
        }], propDecorators: { type: [{ type: i0.Input, args: [{ isSignal: true, alias: "type", required: false }] }], placeholder: [{ type: i0.Input, args: [{ isSignal: true, alias: "placeholder", required: false }] }], inputId: [{ type: i0.Input, args: [{ isSignal: true, alias: "inputId", required: false }] }], autocomplete: [{ type: i0.Input, args: [{ isSignal: true, alias: "autocomplete", required: false }] }], required: [{ type: i0.Input, args: [{ isSignal: true, alias: "required", required: false }] }], invalid: [{ type: i0.Input, args: [{ isSignal: true, alias: "invalid", required: false }] }], leadingIcon: [{ type: i0.Input, args: [{ isSignal: true, alias: "leadingIcon", required: false }] }], trailingIcon: [{ type: i0.Input, args: [{ isSignal: true, alias: "trailingIcon", required: false }] }], trailingIconLabel: [{ type: i0.Input, args: [{ isSignal: true, alias: "trailingIconLabel", required: false }] }], currencySymbol: [{ type: i0.Input, args: [{ isSignal: true, alias: "currencySymbol", required: false }] }], blurred: [{ type: i0.Output, args: ["blurred"] }], trailingIconClick: [{ type: i0.Output, args: ["trailingIconClick"] }] } });

class OrbitAutocompleteComponent {
    constructor() {
        this.overlay = inject(Overlay);
        this.vcr = inject(ViewContainerRef);
        this.hostRef = inject(ElementRef);
        this.options = input([], /* @ts-ignore */
        ...(ngDevMode ? [{ debugName: "options" }] : /* istanbul ignore next */ []));
        this.placeholder = input('Cerca...', /* @ts-ignore */
        ...(ngDevMode ? [{ debugName: "placeholder" }] : /* istanbul ignore next */ []));
        this.inputId = input('', /* @ts-ignore */
        ...(ngDevMode ? [{ debugName: "inputId" }] : /* istanbul ignore next */ []));
        this.required = input(false, { ...(ngDevMode ? { debugName: "required" } : /* istanbul ignore next */ {}), transform: booleanAttribute });
        this.invalid = input(false, { ...(ngDevMode ? { debugName: "invalid" } : /* istanbul ignore next */ {}), transform: booleanAttribute });
        this.debounceMs = input(200, /* @ts-ignore */
        ...(ngDevMode ? [{ debugName: "debounceMs" }] : /* istanbul ignore next */ []));
        this.optionSelected = output();
        this.searchChange = output();
        this.inputText = signal('', /* @ts-ignore */
        ...(ngDevMode ? [{ debugName: "inputText" }] : /* istanbul ignore next */ []));
        this.activeIndex = signal(-1, /* @ts-ignore */
        ...(ngDevMode ? [{ debugName: "activeIndex" }] : /* istanbul ignore next */ []));
        this.isOpen = signal(false, /* @ts-ignore */
        ...(ngDevMode ? [{ debugName: "isOpen" }] : /* istanbul ignore next */ []));
        this.isDisabled = signal(false, /* @ts-ignore */
        ...(ngDevMode ? [{ debugName: "isDisabled" }] : /* istanbul ignore next */ []));
        this.query = signal('', /* @ts-ignore */
        ...(ngDevMode ? [{ debugName: "query" }] : /* istanbul ignore next */ []));
        this.overlayRef = null;
        this.onChange = () => undefined;
        this.onTouched = () => undefined;
        this.debounceTimer = null;
        this.filteredOptions = computed(() => {
            const q = this.query().toLocaleLowerCase('it-IT');
            if (!q)
                return this.options();
            return this.options().filter((o) => o.label.toLocaleLowerCase('it-IT').includes(q));
        }, /* @ts-ignore */
        ...(ngDevMode ? [{ debugName: "filteredOptions" }] : /* istanbul ignore next */ []));
        this.closeEffect = effect(() => {
            const open = this.isOpen();
            if (!open)
                this.detachOverlay();
        }, /* @ts-ignore */
        ...(ngDevMode ? [{ debugName: "closeEffect" }] : /* istanbul ignore next */ []));
    }
    writeValue(val) {
        const match = this.options().find((o) => o.value === val);
        this.inputText.set(match?.label || '');
    }
    registerOnChange(fn) {
        this.onChange = fn;
    }
    registerOnTouched(fn) {
        this.onTouched = fn;
    }
    setDisabledState(isDisabled) {
        this.isDisabled.set(isDisabled);
    }
    onInput(event) {
        const text = event.target.value;
        this.inputText.set(text);
        this.activeIndex.set(-1);
        this.isOpen.set(true);
        if (this.debounceTimer)
            clearTimeout(this.debounceTimer);
        this.debounceTimer = setTimeout(() => {
            this.query.set(text);
            this.searchChange.emit(text);
        }, this.debounceMs());
    }
    onFocus() {
        this.isOpen.set(true);
    }
    onBlur() {
        this.onTouched();
        setTimeout(() => this.isOpen.set(false), 150);
    }
    onKeydown(event) {
        if (!this.isOpen())
            return;
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
    selectOption(option) {
        if (option.disabled)
            return;
        this.inputText.set(option.label);
        this.query.set(option.label);
        this.isOpen.set(false);
        this.onChange(option.value);
        this.onTouched();
        this.optionSelected.emit(option);
    }
    trackByValue(_, option) {
        return option.value;
    }
    ngOnDestroy() {
        this.detachOverlay();
        if (this.debounceTimer)
            clearTimeout(this.debounceTimer);
    }
    moveActive(direction) {
        const opts = this.filteredOptions();
        if (!opts.length)
            return;
        let idx = this.activeIndex();
        for (let i = 0; i < opts.length; i++) {
            idx = (idx + direction + opts.length) % opts.length;
            if (!opts[idx].disabled) {
                this.activeIndex.set(idx);
                return;
            }
        }
    }
    detachOverlay() {
        if (this.overlayRef) {
            this.overlayRef.detach();
            this.overlayRef.dispose();
            this.overlayRef = null;
        }
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "22.0.7", ngImport: i0, type: OrbitAutocompleteComponent, deps: [], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "22.0.7", type: OrbitAutocompleteComponent, isStandalone: true, selector: "orbit-autocomplete", inputs: { options: { classPropertyName: "options", publicName: "options", isSignal: true, isRequired: false, transformFunction: null }, placeholder: { classPropertyName: "placeholder", publicName: "placeholder", isSignal: true, isRequired: false, transformFunction: null }, inputId: { classPropertyName: "inputId", publicName: "inputId", isSignal: true, isRequired: false, transformFunction: null }, required: { classPropertyName: "required", publicName: "required", isSignal: true, isRequired: false, transformFunction: null }, invalid: { classPropertyName: "invalid", publicName: "invalid", isSignal: true, isRequired: false, transformFunction: null }, debounceMs: { classPropertyName: "debounceMs", publicName: "debounceMs", isSignal: true, isRequired: false, transformFunction: null } }, outputs: { optionSelected: "optionSelected", searchChange: "searchChange" }, host: { properties: { "class.orbit-ac--disabled": "isDisabled()", "class.orbit-ac--invalid": "invalid()" } }, providers: [
            {
                provide: NG_VALUE_ACCESSOR,
                useExisting: forwardRef(() => OrbitAutocompleteComponent),
                multi: true,
            },
        ], ngImport: i0, template: "<div class=\"orbit-ac__wrapper\">\n  <input\n    type=\"text\"\n    class=\"orbit-ac__input\"\n    [id]=\"inputId() || null\"\n    [placeholder]=\"placeholder()\"\n    [value]=\"inputText()\"\n    [disabled]=\"isDisabled()\"\n    [required]=\"required()\"\n    role=\"combobox\"\n    [attr.aria-expanded]=\"isOpen()\"\n    [attr.aria-autocomplete]=\"'list'\"\n    autocomplete=\"off\"\n    (input)=\"onInput($event)\"\n    (focus)=\"onFocus()\"\n    (blur)=\"onBlur()\"\n    (keydown)=\"onKeydown($event)\"\n  />\n\n  @if (isOpen() && !isDisabled() && filteredOptions().length > 0) {\n    <div class=\"orbit-ac__menu\" role=\"listbox\">\n      @for (option of filteredOptions(); track option.value; let i = $index) {\n        <div\n          class=\"orbit-ac__option\"\n          role=\"option\"\n          [class.orbit-ac__option--active]=\"i === activeIndex()\"\n          [class.orbit-ac__option--disabled]=\"option.disabled\"\n          [attr.aria-selected]=\"i === activeIndex()\"\n          (mousedown)=\"$event.preventDefault()\"\n          (click)=\"selectOption(option)\"\n        >\n          {{ option.label }}\n        </div>\n      }\n    </div>\n  }\n\n  @if (isOpen() && !isDisabled() && filteredOptions().length === 0 && query()) {\n    <div class=\"orbit-ac__menu\">\n      <div class=\"orbit-ac__empty\">Nessun risultato</div>\n    </div>\n  }\n</div>\n", styles: [":host{display:block}.orbit-ac__wrapper{position:relative;display:flex}.orbit-ac__input{width:100%;height:var(--orbit-control-height);padding:0 var(--orbit-control-padding-inline);border:1px solid var(--orbit-color-border);border-radius:var(--orbit-radius-control);background:var(--orbit-color-surface);color:var(--orbit-color-text);font-family:var(--orbit-font-sans);font-size:var(--orbit-font-size-body);line-height:1.25;transition:border-color .15s ease,box-shadow .15s ease}.orbit-ac__input::placeholder{color:var(--orbit-color-text-muted)}.orbit-ac__input:focus{outline:0;border-color:var(--orbit-color-border-focus);box-shadow:var(--orbit-focus-ring)}:host(.orbit-ac--disabled) .orbit-ac__input{background:var(--orbit-color-surface-muted);color:var(--orbit-color-text-muted);cursor:not-allowed;pointer-events:none}:host(.orbit-ac--invalid) .orbit-ac__input{border-color:var(--orbit-color-danger)}:host(.orbit-ac--invalid) .orbit-ac__input:focus{box-shadow:0 0 0 3px color-mix(in srgb,var(--orbit-color-danger) 25%,transparent)}.orbit-ac__menu{position:absolute;z-index:var(--orbit-z-modal, 1050);top:calc(100% + .25rem);left:0;right:0;max-height:15rem;padding:.25rem;overflow-y:auto;border:1px solid var(--orbit-color-border);border-radius:var(--orbit-radius-control);background:var(--orbit-color-surface);box-shadow:var(--orbit-shadow-overlay)}.orbit-ac__option{display:flex;align-items:center;min-height:2rem;padding:0 var(--orbit-space-2);border-radius:.25rem;color:var(--orbit-color-text);font-family:var(--orbit-font-sans);font-size:var(--orbit-font-size-body);cursor:pointer;transition:background-color .1s ease}.orbit-ac__option--active{background:var(--orbit-color-primary-subtle);color:var(--orbit-color-primary)}.orbit-ac__option--disabled{opacity:.5;cursor:not-allowed}.orbit-ac__empty{padding:var(--orbit-space-2);color:var(--orbit-color-text-muted);font-size:var(--orbit-font-size-body);text-align:center}\n"], changeDetection: i0.ChangeDetectionStrategy.OnPush }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "22.0.7", ngImport: i0, type: OrbitAutocompleteComponent, decorators: [{
            type: Component,
            args: [{ selector: 'orbit-autocomplete', changeDetection: ChangeDetectionStrategy.OnPush, providers: [
                        {
                            provide: NG_VALUE_ACCESSOR,
                            useExisting: forwardRef(() => OrbitAutocompleteComponent),
                            multi: true,
                        },
                    ], host: {
                        '[class.orbit-ac--disabled]': 'isDisabled()',
                        '[class.orbit-ac--invalid]': 'invalid()',
                    }, template: "<div class=\"orbit-ac__wrapper\">\n  <input\n    type=\"text\"\n    class=\"orbit-ac__input\"\n    [id]=\"inputId() || null\"\n    [placeholder]=\"placeholder()\"\n    [value]=\"inputText()\"\n    [disabled]=\"isDisabled()\"\n    [required]=\"required()\"\n    role=\"combobox\"\n    [attr.aria-expanded]=\"isOpen()\"\n    [attr.aria-autocomplete]=\"'list'\"\n    autocomplete=\"off\"\n    (input)=\"onInput($event)\"\n    (focus)=\"onFocus()\"\n    (blur)=\"onBlur()\"\n    (keydown)=\"onKeydown($event)\"\n  />\n\n  @if (isOpen() && !isDisabled() && filteredOptions().length > 0) {\n    <div class=\"orbit-ac__menu\" role=\"listbox\">\n      @for (option of filteredOptions(); track option.value; let i = $index) {\n        <div\n          class=\"orbit-ac__option\"\n          role=\"option\"\n          [class.orbit-ac__option--active]=\"i === activeIndex()\"\n          [class.orbit-ac__option--disabled]=\"option.disabled\"\n          [attr.aria-selected]=\"i === activeIndex()\"\n          (mousedown)=\"$event.preventDefault()\"\n          (click)=\"selectOption(option)\"\n        >\n          {{ option.label }}\n        </div>\n      }\n    </div>\n  }\n\n  @if (isOpen() && !isDisabled() && filteredOptions().length === 0 && query()) {\n    <div class=\"orbit-ac__menu\">\n      <div class=\"orbit-ac__empty\">Nessun risultato</div>\n    </div>\n  }\n</div>\n", styles: [":host{display:block}.orbit-ac__wrapper{position:relative;display:flex}.orbit-ac__input{width:100%;height:var(--orbit-control-height);padding:0 var(--orbit-control-padding-inline);border:1px solid var(--orbit-color-border);border-radius:var(--orbit-radius-control);background:var(--orbit-color-surface);color:var(--orbit-color-text);font-family:var(--orbit-font-sans);font-size:var(--orbit-font-size-body);line-height:1.25;transition:border-color .15s ease,box-shadow .15s ease}.orbit-ac__input::placeholder{color:var(--orbit-color-text-muted)}.orbit-ac__input:focus{outline:0;border-color:var(--orbit-color-border-focus);box-shadow:var(--orbit-focus-ring)}:host(.orbit-ac--disabled) .orbit-ac__input{background:var(--orbit-color-surface-muted);color:var(--orbit-color-text-muted);cursor:not-allowed;pointer-events:none}:host(.orbit-ac--invalid) .orbit-ac__input{border-color:var(--orbit-color-danger)}:host(.orbit-ac--invalid) .orbit-ac__input:focus{box-shadow:0 0 0 3px color-mix(in srgb,var(--orbit-color-danger) 25%,transparent)}.orbit-ac__menu{position:absolute;z-index:var(--orbit-z-modal, 1050);top:calc(100% + .25rem);left:0;right:0;max-height:15rem;padding:.25rem;overflow-y:auto;border:1px solid var(--orbit-color-border);border-radius:var(--orbit-radius-control);background:var(--orbit-color-surface);box-shadow:var(--orbit-shadow-overlay)}.orbit-ac__option{display:flex;align-items:center;min-height:2rem;padding:0 var(--orbit-space-2);border-radius:.25rem;color:var(--orbit-color-text);font-family:var(--orbit-font-sans);font-size:var(--orbit-font-size-body);cursor:pointer;transition:background-color .1s ease}.orbit-ac__option--active{background:var(--orbit-color-primary-subtle);color:var(--orbit-color-primary)}.orbit-ac__option--disabled{opacity:.5;cursor:not-allowed}.orbit-ac__empty{padding:var(--orbit-space-2);color:var(--orbit-color-text-muted);font-size:var(--orbit-font-size-body);text-align:center}\n"] }]
        }], propDecorators: { options: [{ type: i0.Input, args: [{ isSignal: true, alias: "options", required: false }] }], placeholder: [{ type: i0.Input, args: [{ isSignal: true, alias: "placeholder", required: false }] }], inputId: [{ type: i0.Input, args: [{ isSignal: true, alias: "inputId", required: false }] }], required: [{ type: i0.Input, args: [{ isSignal: true, alias: "required", required: false }] }], invalid: [{ type: i0.Input, args: [{ isSignal: true, alias: "invalid", required: false }] }], debounceMs: [{ type: i0.Input, args: [{ isSignal: true, alias: "debounceMs", required: false }] }], optionSelected: [{ type: i0.Output, args: ["optionSelected"] }], searchChange: [{ type: i0.Output, args: ["searchChange"] }] } });

class OrbitDatePickerComponent {
    constructor() {
        this.placeholder = input('GG/MM/AAAA', /* @ts-ignore */
        ...(ngDevMode ? [{ debugName: "placeholder" }] : /* istanbul ignore next */ []));
        this.required = input(false, { ...(ngDevMode ? { debugName: "required" } : /* istanbul ignore next */ {}), transform: booleanAttribute });
        this.invalid = input(false, { ...(ngDevMode ? { debugName: "invalid" } : /* istanbul ignore next */ {}), transform: booleanAttribute });
        this.minDate = input(null, /* @ts-ignore */
        ...(ngDevMode ? [{ debugName: "minDate" }] : /* istanbul ignore next */ []));
        this.maxDate = input(null, /* @ts-ignore */
        ...(ngDevMode ? [{ debugName: "maxDate" }] : /* istanbul ignore next */ []));
        this.weekStartsOn = input(1, /* @ts-ignore */
        ...(ngDevMode ? [{ debugName: "weekStartsOn" }] : /* istanbul ignore next */ []));
        this.valueChange = output();
        this.isOpen = signal(false, /* @ts-ignore */
        ...(ngDevMode ? [{ debugName: "isOpen" }] : /* istanbul ignore next */ []));
        this.isDisabled = signal(false, /* @ts-ignore */
        ...(ngDevMode ? [{ debugName: "isDisabled" }] : /* istanbul ignore next */ []));
        this.selectedDate = signal(null, /* @ts-ignore */
        ...(ngDevMode ? [{ debugName: "selectedDate" }] : /* istanbul ignore next */ []));
        this.viewMonth = signal(new Date().getMonth(), /* @ts-ignore */
        ...(ngDevMode ? [{ debugName: "viewMonth" }] : /* istanbul ignore next */ []));
        this.viewYear = signal(new Date().getFullYear(), /* @ts-ignore */
        ...(ngDevMode ? [{ debugName: "viewYear" }] : /* istanbul ignore next */ []));
        this.inputText = signal('', /* @ts-ignore */
        ...(ngDevMode ? [{ debugName: "inputText" }] : /* istanbul ignore next */ []));
        this.onChange = () => undefined;
        this.onTouched = () => undefined;
        this.WEEKDAYS_IT = ['Lu', 'Ma', 'Me', 'Gi', 'Ve', 'Sa', 'Do'];
        this.MONTHS_IT = [
            'Gennaio', 'Febbraio', 'Marzo', 'Aprile', 'Maggio', 'Giugno',
            'Luglio', 'Agosto', 'Settembre', 'Ottobre', 'Novembre', 'Dicembre',
        ];
    }
    get calendarDays() {
        const year = this.viewYear();
        const month = this.viewMonth();
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const startOffset = (firstDay.getDay() + 6) % 7;
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const selected = this.selectedDate();
        const min = this.minDate();
        const max = this.maxDate();
        const days = [];
        const prevMonthLast = new Date(year, month, 0).getDate();
        for (let i = startOffset - 1; i >= 0; i--) {
            const d = new Date(year, month - 1, prevMonthLast - i);
            days.push(this.makeDay(d, false, today, selected, min, max));
        }
        for (let d = 1; d <= lastDay.getDate(); d++) {
            const date = new Date(year, month, d);
            days.push(this.makeDay(date, true, today, selected, min, max));
        }
        const remaining = 42 - days.length;
        for (let d = 1; d <= remaining; d++) {
            const date = new Date(year, month + 1, d);
            days.push(this.makeDay(date, false, today, selected, min, max));
        }
        return days;
    }
    writeValue(val) {
        this.selectedDate.set(val);
        this.inputText.set(val ? this.formatDate(val) : '');
        if (val) {
            this.viewMonth.set(val.getMonth());
            this.viewYear.set(val.getFullYear());
        }
    }
    registerOnChange(fn) {
        this.onChange = fn;
    }
    registerOnTouched(fn) {
        this.onTouched = fn;
    }
    setDisabledState(isDisabled) {
        this.isDisabled.set(isDisabled);
    }
    toggle() {
        if (this.isDisabled())
            return;
        this.isOpen.update((v) => !v);
    }
    selectDay(day) {
        if (day.disabled)
            return;
        this.selectedDate.set(day.date);
        this.inputText.set(this.formatDate(day.date));
        this.isOpen.set(false);
        this.onChange(day.date);
        this.onTouched();
        this.valueChange.emit(day.date);
    }
    prevMonth() {
        if (this.viewMonth() === 0) {
            this.viewMonth.set(11);
            this.viewYear.update((y) => y - 1);
        }
        else {
            this.viewMonth.update((m) => m - 1);
        }
    }
    nextMonth() {
        if (this.viewMonth() === 11) {
            this.viewMonth.set(0);
            this.viewYear.update((y) => y + 1);
        }
        else {
            this.viewMonth.update((m) => m + 1);
        }
    }
    onInputChange(text) {
        this.inputText.set(text);
        const parsed = this.parseDate(text);
        if (parsed) {
            this.selectedDate.set(parsed);
            this.viewMonth.set(parsed.getMonth());
            this.viewYear.set(parsed.getFullYear());
            this.onChange(parsed);
            this.valueChange.emit(parsed);
        }
    }
    onInputBlur() {
        this.onTouched();
        this.isOpen.set(false);
    }
    onInputFocus() {
        this.isOpen.set(true);
    }
    formatDate(d) {
        const dd = String(d.getDate()).padStart(2, '0');
        const mm = String(d.getMonth() + 1).padStart(2, '0');
        const yyyy = d.getFullYear();
        return `${dd}/${mm}/${yyyy}`;
    }
    parseDate(text) {
        const match = text.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
        if (!match)
            return null;
        const [, dd, mm, yyyy] = match;
        const date = new Date(+yyyy, +mm - 1, +dd);
        if (date.getDate() !== +dd)
            return null;
        return date;
    }
    makeDay(date, currentMonth, today, selected, min, max) {
        const d = new Date(date);
        d.setHours(0, 0, 0, 0);
        const disabled = (min && d < new Date(min.getFullYear(), min.getMonth(), min.getDate())) ||
            (max && d > new Date(max.getFullYear(), max.getMonth(), max.getDate()));
        return {
            date: d,
            day: d.getDate(),
            currentMonth,
            today: d.getTime() === today.getTime(),
            selected: selected ? d.getTime() === selected.getTime() : false,
            disabled: !!disabled,
        };
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "22.0.7", ngImport: i0, type: OrbitDatePickerComponent, deps: [], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "22.0.7", type: OrbitDatePickerComponent, isStandalone: true, selector: "orbit-date-picker", inputs: { placeholder: { classPropertyName: "placeholder", publicName: "placeholder", isSignal: true, isRequired: false, transformFunction: null }, required: { classPropertyName: "required", publicName: "required", isSignal: true, isRequired: false, transformFunction: null }, invalid: { classPropertyName: "invalid", publicName: "invalid", isSignal: true, isRequired: false, transformFunction: null }, minDate: { classPropertyName: "minDate", publicName: "minDate", isSignal: true, isRequired: false, transformFunction: null }, maxDate: { classPropertyName: "maxDate", publicName: "maxDate", isSignal: true, isRequired: false, transformFunction: null }, weekStartsOn: { classPropertyName: "weekStartsOn", publicName: "weekStartsOn", isSignal: true, isRequired: false, transformFunction: null } }, outputs: { valueChange: "valueChange" }, host: { properties: { "class.orbit-dp--disabled": "isDisabled()", "class.orbit-dp--invalid": "invalid()" } }, providers: [
            {
                provide: NG_VALUE_ACCESSOR,
                useExisting: forwardRef(() => OrbitDatePickerComponent),
                multi: true,
            },
        ], ngImport: i0, template: "<div class=\"orbit-dp\">\n  <input\n    type=\"text\"\n    class=\"orbit-dp__input\"\n    [placeholder]=\"placeholder()\"\n    [value]=\"inputText()\"\n    [disabled]=\"isDisabled()\"\n    [required]=\"required()\"\n    (input)=\"onInputChange($any($event.target).value)\"\n    (focus)=\"onInputFocus()\"\n    (blur)=\"onInputBlur()\"\n  />\n  <button\n    type=\"button\"\n    class=\"orbit-dp__toggle\"\n    [disabled]=\"isDisabled()\"\n    aria-label=\"Apri calendario\"\n    (mousedown)=\"$event.preventDefault()\"\n    (click)=\"toggle()\"\n  >\n    <svg viewBox=\"0 0 16 16\" fill=\"none\" class=\"orbit-dp__icon\">\n      <rect x=\"2\" y=\"3\" width=\"12\" height=\"11\" rx=\"1.5\" stroke=\"currentColor\" stroke-width=\"1.2\"/>\n      <path d=\"M5 1v3M11 1v3M2 7h12\" stroke=\"currentColor\" stroke-width=\"1.2\" stroke-linecap=\"round\"/>\n    </svg>\n  </button>\n\n  @if (isOpen()) {\n    <div class=\"orbit-dp__dropdown\">\n      <div class=\"orbit-dp__nav\">\n        <button type=\"button\" class=\"orbit-dp__nav-btn\" (mousedown)=\"$event.preventDefault()\" (click)=\"prevMonth()\" aria-label=\"Mese precedente\">\n          <svg viewBox=\"0 0 16 16\" fill=\"none\"><path d=\"M10 3L5 8l5 5\" stroke=\"currentColor\" stroke-width=\"1.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/></svg>\n        </button>\n        <span class=\"orbit-dp__nav-title\">{{ MONTHS_IT[viewMonth()] }} {{ viewYear() }}</span>\n        <button type=\"button\" class=\"orbit-dp__nav-btn\" (mousedown)=\"$event.preventDefault()\" (click)=\"nextMonth()\" aria-label=\"Mese successivo\">\n          <svg viewBox=\"0 0 16 16\" fill=\"none\"><path d=\"M6 3l5 5-5 5\" stroke=\"currentColor\" stroke-width=\"1.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/></svg>\n        </button>\n      </div>\n\n      <div class=\"orbit-dp__grid\">\n        @for (wd of WEEKDAYS_IT; track wd) {\n          <div class=\"orbit-dp__weekday\">{{ wd }}</div>\n        }\n        @for (day of calendarDays; track day.date.toISOString()) {\n          <button\n            type=\"button\"\n            class=\"orbit-dp__day\"\n            [class.orbit-dp__day--outside]=\"!day.currentMonth\"\n            [class.orbit-dp__day--today]=\"day.today\"\n            [class.orbit-dp__day--selected]=\"day.selected\"\n            [disabled]=\"day.disabled\"\n            (mousedown)=\"$event.preventDefault()\"\n            (click)=\"selectDay(day)\"\n          >\n            {{ day.day }}\n          </button>\n        }\n      </div>\n    </div>\n  }\n</div>\n", styles: [":host{display:block}.orbit-dp{position:relative;display:flex}.orbit-dp__input{width:100%;height:var(--orbit-control-height);padding:0 2.5rem 0 var(--orbit-control-padding-inline);border:1px solid var(--orbit-color-border);border-radius:var(--orbit-radius-control);background:var(--orbit-color-surface);color:var(--orbit-color-text);font-family:var(--orbit-font-sans);font-size:var(--orbit-font-size-body);line-height:1.25;transition:border-color .15s ease,box-shadow .15s ease}.orbit-dp__input::placeholder{color:var(--orbit-color-text-muted)}.orbit-dp__input:focus{outline:0;border-color:var(--orbit-color-border-focus);box-shadow:var(--orbit-focus-ring)}:host(.orbit-dp--disabled) .orbit-dp__input{background:var(--orbit-color-surface-muted);cursor:not-allowed;pointer-events:none}:host(.orbit-dp--invalid) .orbit-dp__input{border-color:var(--orbit-color-danger)}.orbit-dp__toggle{position:absolute;top:0;right:0;display:grid;place-items:center;width:2.25rem;height:100%;border:0;border-left:1px solid var(--orbit-color-border);border-radius:0 var(--orbit-radius-control) var(--orbit-radius-control) 0;background:transparent;color:var(--orbit-color-text-muted);cursor:pointer;transition:background-color .15s ease,color .15s ease}.orbit-dp__toggle:hover:not(:disabled){background:var(--orbit-color-surface-muted);color:var(--orbit-color-primary)}.orbit-dp__toggle:focus-visible{outline:2px solid var(--orbit-color-border-focus);outline-offset:-2px}.orbit-dp__toggle:disabled{cursor:not-allowed;opacity:.5}.orbit-dp__icon{width:1rem;height:1rem}.orbit-dp__dropdown{position:absolute;z-index:var(--orbit-z-modal, 1050);top:calc(100% + .25rem);left:0;width:18rem;padding:var(--orbit-space-3);border:1px solid var(--orbit-color-border);border-radius:var(--orbit-radius-control);background:var(--orbit-color-surface);box-shadow:var(--orbit-shadow-overlay)}.orbit-dp__nav{display:flex;align-items:center;justify-content:space-between;margin-bottom:var(--orbit-space-2)}.orbit-dp__nav-btn{display:grid;place-items:center;width:1.75rem;height:1.75rem;border:0;border-radius:var(--orbit-radius-control);background:transparent;color:var(--orbit-color-text-muted);cursor:pointer;transition:background-color .1s ease,color .1s ease}.orbit-dp__nav-btn:hover{background:var(--orbit-color-surface-muted);color:var(--orbit-color-primary)}.orbit-dp__nav-btn svg{width:1rem;height:1rem}.orbit-dp__nav-title{font-family:var(--orbit-font-sans);font-size:var(--orbit-font-size-body);font-weight:var(--orbit-font-weight-emphasis);color:var(--orbit-color-text)}.orbit-dp__grid{display:grid;grid-template-columns:repeat(7,1fr);gap:1px}.orbit-dp__weekday{display:flex;align-items:center;justify-content:center;height:1.75rem;color:var(--orbit-color-text-muted);font-family:var(--orbit-font-sans);font-size:var(--orbit-font-size-xs);font-weight:var(--orbit-font-weight-emphasis);text-transform:uppercase}.orbit-dp__day{display:flex;align-items:center;justify-content:center;width:2rem;height:2rem;border:0;border-radius:var(--orbit-radius-control);background:transparent;color:var(--orbit-color-text);font-family:var(--orbit-font-sans);font-size:var(--orbit-font-size-body);cursor:pointer;transition:background-color .1s ease,color .1s ease}.orbit-dp__day:hover:not(:disabled){background:var(--orbit-color-surface-muted)}.orbit-dp__day--outside{color:var(--orbit-color-text-muted);opacity:.4}.orbit-dp__day--today{font-weight:var(--orbit-font-weight-emphasis);color:var(--orbit-color-primary)}.orbit-dp__day--selected{background:var(--orbit-color-primary);color:var(--orbit-color-text-inverse)}.orbit-dp__day--selected:hover:not(:disabled){background:var(--orbit-color-primary-strong)}.orbit-dp__day:disabled{cursor:not-allowed;opacity:.35}.orbit-dp__day:focus-visible{outline:2px solid var(--orbit-color-border-focus);outline-offset:-1px}\n"], changeDetection: i0.ChangeDetectionStrategy.OnPush }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "22.0.7", ngImport: i0, type: OrbitDatePickerComponent, decorators: [{
            type: Component,
            args: [{ selector: 'orbit-date-picker', changeDetection: ChangeDetectionStrategy.OnPush, providers: [
                        {
                            provide: NG_VALUE_ACCESSOR,
                            useExisting: forwardRef(() => OrbitDatePickerComponent),
                            multi: true,
                        },
                    ], host: {
                        '[class.orbit-dp--disabled]': 'isDisabled()',
                        '[class.orbit-dp--invalid]': 'invalid()',
                    }, template: "<div class=\"orbit-dp\">\n  <input\n    type=\"text\"\n    class=\"orbit-dp__input\"\n    [placeholder]=\"placeholder()\"\n    [value]=\"inputText()\"\n    [disabled]=\"isDisabled()\"\n    [required]=\"required()\"\n    (input)=\"onInputChange($any($event.target).value)\"\n    (focus)=\"onInputFocus()\"\n    (blur)=\"onInputBlur()\"\n  />\n  <button\n    type=\"button\"\n    class=\"orbit-dp__toggle\"\n    [disabled]=\"isDisabled()\"\n    aria-label=\"Apri calendario\"\n    (mousedown)=\"$event.preventDefault()\"\n    (click)=\"toggle()\"\n  >\n    <svg viewBox=\"0 0 16 16\" fill=\"none\" class=\"orbit-dp__icon\">\n      <rect x=\"2\" y=\"3\" width=\"12\" height=\"11\" rx=\"1.5\" stroke=\"currentColor\" stroke-width=\"1.2\"/>\n      <path d=\"M5 1v3M11 1v3M2 7h12\" stroke=\"currentColor\" stroke-width=\"1.2\" stroke-linecap=\"round\"/>\n    </svg>\n  </button>\n\n  @if (isOpen()) {\n    <div class=\"orbit-dp__dropdown\">\n      <div class=\"orbit-dp__nav\">\n        <button type=\"button\" class=\"orbit-dp__nav-btn\" (mousedown)=\"$event.preventDefault()\" (click)=\"prevMonth()\" aria-label=\"Mese precedente\">\n          <svg viewBox=\"0 0 16 16\" fill=\"none\"><path d=\"M10 3L5 8l5 5\" stroke=\"currentColor\" stroke-width=\"1.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/></svg>\n        </button>\n        <span class=\"orbit-dp__nav-title\">{{ MONTHS_IT[viewMonth()] }} {{ viewYear() }}</span>\n        <button type=\"button\" class=\"orbit-dp__nav-btn\" (mousedown)=\"$event.preventDefault()\" (click)=\"nextMonth()\" aria-label=\"Mese successivo\">\n          <svg viewBox=\"0 0 16 16\" fill=\"none\"><path d=\"M6 3l5 5-5 5\" stroke=\"currentColor\" stroke-width=\"1.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/></svg>\n        </button>\n      </div>\n\n      <div class=\"orbit-dp__grid\">\n        @for (wd of WEEKDAYS_IT; track wd) {\n          <div class=\"orbit-dp__weekday\">{{ wd }}</div>\n        }\n        @for (day of calendarDays; track day.date.toISOString()) {\n          <button\n            type=\"button\"\n            class=\"orbit-dp__day\"\n            [class.orbit-dp__day--outside]=\"!day.currentMonth\"\n            [class.orbit-dp__day--today]=\"day.today\"\n            [class.orbit-dp__day--selected]=\"day.selected\"\n            [disabled]=\"day.disabled\"\n            (mousedown)=\"$event.preventDefault()\"\n            (click)=\"selectDay(day)\"\n          >\n            {{ day.day }}\n          </button>\n        }\n      </div>\n    </div>\n  }\n</div>\n", styles: [":host{display:block}.orbit-dp{position:relative;display:flex}.orbit-dp__input{width:100%;height:var(--orbit-control-height);padding:0 2.5rem 0 var(--orbit-control-padding-inline);border:1px solid var(--orbit-color-border);border-radius:var(--orbit-radius-control);background:var(--orbit-color-surface);color:var(--orbit-color-text);font-family:var(--orbit-font-sans);font-size:var(--orbit-font-size-body);line-height:1.25;transition:border-color .15s ease,box-shadow .15s ease}.orbit-dp__input::placeholder{color:var(--orbit-color-text-muted)}.orbit-dp__input:focus{outline:0;border-color:var(--orbit-color-border-focus);box-shadow:var(--orbit-focus-ring)}:host(.orbit-dp--disabled) .orbit-dp__input{background:var(--orbit-color-surface-muted);cursor:not-allowed;pointer-events:none}:host(.orbit-dp--invalid) .orbit-dp__input{border-color:var(--orbit-color-danger)}.orbit-dp__toggle{position:absolute;top:0;right:0;display:grid;place-items:center;width:2.25rem;height:100%;border:0;border-left:1px solid var(--orbit-color-border);border-radius:0 var(--orbit-radius-control) var(--orbit-radius-control) 0;background:transparent;color:var(--orbit-color-text-muted);cursor:pointer;transition:background-color .15s ease,color .15s ease}.orbit-dp__toggle:hover:not(:disabled){background:var(--orbit-color-surface-muted);color:var(--orbit-color-primary)}.orbit-dp__toggle:focus-visible{outline:2px solid var(--orbit-color-border-focus);outline-offset:-2px}.orbit-dp__toggle:disabled{cursor:not-allowed;opacity:.5}.orbit-dp__icon{width:1rem;height:1rem}.orbit-dp__dropdown{position:absolute;z-index:var(--orbit-z-modal, 1050);top:calc(100% + .25rem);left:0;width:18rem;padding:var(--orbit-space-3);border:1px solid var(--orbit-color-border);border-radius:var(--orbit-radius-control);background:var(--orbit-color-surface);box-shadow:var(--orbit-shadow-overlay)}.orbit-dp__nav{display:flex;align-items:center;justify-content:space-between;margin-bottom:var(--orbit-space-2)}.orbit-dp__nav-btn{display:grid;place-items:center;width:1.75rem;height:1.75rem;border:0;border-radius:var(--orbit-radius-control);background:transparent;color:var(--orbit-color-text-muted);cursor:pointer;transition:background-color .1s ease,color .1s ease}.orbit-dp__nav-btn:hover{background:var(--orbit-color-surface-muted);color:var(--orbit-color-primary)}.orbit-dp__nav-btn svg{width:1rem;height:1rem}.orbit-dp__nav-title{font-family:var(--orbit-font-sans);font-size:var(--orbit-font-size-body);font-weight:var(--orbit-font-weight-emphasis);color:var(--orbit-color-text)}.orbit-dp__grid{display:grid;grid-template-columns:repeat(7,1fr);gap:1px}.orbit-dp__weekday{display:flex;align-items:center;justify-content:center;height:1.75rem;color:var(--orbit-color-text-muted);font-family:var(--orbit-font-sans);font-size:var(--orbit-font-size-xs);font-weight:var(--orbit-font-weight-emphasis);text-transform:uppercase}.orbit-dp__day{display:flex;align-items:center;justify-content:center;width:2rem;height:2rem;border:0;border-radius:var(--orbit-radius-control);background:transparent;color:var(--orbit-color-text);font-family:var(--orbit-font-sans);font-size:var(--orbit-font-size-body);cursor:pointer;transition:background-color .1s ease,color .1s ease}.orbit-dp__day:hover:not(:disabled){background:var(--orbit-color-surface-muted)}.orbit-dp__day--outside{color:var(--orbit-color-text-muted);opacity:.4}.orbit-dp__day--today{font-weight:var(--orbit-font-weight-emphasis);color:var(--orbit-color-primary)}.orbit-dp__day--selected{background:var(--orbit-color-primary);color:var(--orbit-color-text-inverse)}.orbit-dp__day--selected:hover:not(:disabled){background:var(--orbit-color-primary-strong)}.orbit-dp__day:disabled{cursor:not-allowed;opacity:.35}.orbit-dp__day:focus-visible{outline:2px solid var(--orbit-color-border-focus);outline-offset:-1px}\n"] }]
        }], propDecorators: { placeholder: [{ type: i0.Input, args: [{ isSignal: true, alias: "placeholder", required: false }] }], required: [{ type: i0.Input, args: [{ isSignal: true, alias: "required", required: false }] }], invalid: [{ type: i0.Input, args: [{ isSignal: true, alias: "invalid", required: false }] }], minDate: [{ type: i0.Input, args: [{ isSignal: true, alias: "minDate", required: false }] }], maxDate: [{ type: i0.Input, args: [{ isSignal: true, alias: "maxDate", required: false }] }], weekStartsOn: [{ type: i0.Input, args: [{ isSignal: true, alias: "weekStartsOn", required: false }] }], valueChange: [{ type: i0.Output, args: ["valueChange"] }] } });

class OrbitTimePickerComponent {
    constructor() {
        this.required = input(false, { ...(ngDevMode ? { debugName: "required" } : /* istanbul ignore next */ {}), transform: booleanAttribute });
        this.invalid = input(false, { ...(ngDevMode ? { debugName: "invalid" } : /* istanbul ignore next */ {}), transform: booleanAttribute });
        this.stepMinutes = input(15, /* @ts-ignore */
        ...(ngDevMode ? [{ debugName: "stepMinutes" }] : /* istanbul ignore next */ []));
        this.valueChange = output();
        this.isOpen = signal(false, /* @ts-ignore */
        ...(ngDevMode ? [{ debugName: "isOpen" }] : /* istanbul ignore next */ []));
        this.isDisabled = signal(false, /* @ts-ignore */
        ...(ngDevMode ? [{ debugName: "isDisabled" }] : /* istanbul ignore next */ []));
        this.selectedHours = signal(null, /* @ts-ignore */
        ...(ngDevMode ? [{ debugName: "selectedHours" }] : /* istanbul ignore next */ []));
        this.selectedMinutes = signal(null, /* @ts-ignore */
        ...(ngDevMode ? [{ debugName: "selectedMinutes" }] : /* istanbul ignore next */ []));
        this.activeTab = signal('hours', /* @ts-ignore */
        ...(ngDevMode ? [{ debugName: "activeTab" }] : /* istanbul ignore next */ []));
        this.onChange = () => undefined;
        this.onTouched = () => undefined;
        this.hours = Array.from({ length: 24 }, (_, i) => i);
        this.minutes = computed(() => {
            const step = this.stepMinutes();
            const result = [];
            for (let m = 0; m < 60; m += step)
                result.push(m);
            return result;
        }, /* @ts-ignore */
        ...(ngDevMode ? [{ debugName: "minutes" }] : /* istanbul ignore next */ []));
        this.displayText = computed(() => {
            const h = this.selectedHours();
            const m = this.selectedMinutes();
            if (h === null || m === null)
                return '';
            return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
        }, /* @ts-ignore */
        ...(ngDevMode ? [{ debugName: "displayText" }] : /* istanbul ignore next */ []));
    }
    writeValue(val) {
        if (val) {
            this.selectedHours.set(val.hours);
            this.selectedMinutes.set(val.minutes);
        }
        else {
            this.selectedHours.set(null);
            this.selectedMinutes.set(null);
        }
    }
    registerOnChange(fn) {
        this.onChange = fn;
    }
    registerOnTouched(fn) {
        this.onTouched = fn;
    }
    setDisabledState(isDisabled) {
        this.isDisabled.set(isDisabled);
    }
    toggle() {
        if (this.isDisabled())
            return;
        this.isOpen.update((v) => !v);
    }
    selectHour(hour) {
        this.selectedHours.set(hour);
        this.activeTab.set('minutes');
    }
    selectMinute(minute) {
        this.selectedMinutes.set(minute);
        const value = {
            hours: this.selectedHours(),
            minutes: minute,
        };
        this.isOpen.set(false);
        this.onChange(value);
        this.onTouched();
        this.valueChange.emit(value);
    }
    onInputBlur() {
        this.onTouched();
        this.isOpen.set(false);
    }
    formatHour(h) {
        return String(h).padStart(2, '0');
    }
    formatMinute(m) {
        return String(m).padStart(2, '0');
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "22.0.7", ngImport: i0, type: OrbitTimePickerComponent, deps: [], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "22.0.7", type: OrbitTimePickerComponent, isStandalone: true, selector: "orbit-time-picker", inputs: { required: { classPropertyName: "required", publicName: "required", isSignal: true, isRequired: false, transformFunction: null }, invalid: { classPropertyName: "invalid", publicName: "invalid", isSignal: true, isRequired: false, transformFunction: null }, stepMinutes: { classPropertyName: "stepMinutes", publicName: "stepMinutes", isSignal: true, isRequired: false, transformFunction: null } }, outputs: { valueChange: "valueChange" }, host: { properties: { "class.orbit-tp--disabled": "isDisabled()", "class.orbit-tp--invalid": "invalid()" } }, providers: [
            {
                provide: NG_VALUE_ACCESSOR,
                useExisting: forwardRef(() => OrbitTimePickerComponent),
                multi: true,
            },
        ], ngImport: i0, template: "<div class=\"orbit-tp\">\n  <button\n    type=\"button\"\n    class=\"orbit-tp__trigger\"\n    [disabled]=\"isDisabled()\"\n    [class.orbit-tp__trigger--open]=\"isOpen()\"\n    (mousedown)=\"$event.preventDefault()\"\n    (click)=\"toggle()\"\n    (blur)=\"onInputBlur()\"\n  >\n    <svg viewBox=\"0 0 16 16\" fill=\"none\" class=\"orbit-tp__icon\">\n      <circle cx=\"8\" cy=\"8\" r=\"6.5\" stroke=\"currentColor\" stroke-width=\"1.2\"/>\n      <path d=\"M8 4.5V8l2.5 2\" stroke=\"currentColor\" stroke-width=\"1.2\" stroke-linecap=\"round\"/>\n    </svg>\n    <span class=\"orbit-tp__text\">{{ displayText() || 'Seleziona orario' }}</span>\n  </button>\n\n  @if (isOpen()) {\n    <div class=\"orbit-tp__dropdown\">\n      <div class=\"orbit-tp__tabs\">\n        <button\n          type=\"button\"\n          class=\"orbit-tp__tab\"\n          [class.orbit-tp__tab--active]=\"activeTab() === 'hours'\"\n          (mousedown)=\"$event.preventDefault()\"\n          (click)=\"activeTab.set('hours')\"\n        >\n          Ore\n        </button>\n        <button\n          type=\"button\"\n          class=\"orbit-tp__tab\"\n          [class.orbit-tp__tab--active]=\"activeTab() === 'minutes'\"\n          (mousedown)=\"$event.preventDefault()\"\n          (click)=\"activeTab.set('minutes')\"\n        >\n          Minuti\n        </button>\n      </div>\n\n      <div class=\"orbit-tp__scroll\">\n        @if (activeTab() === 'hours') {\n          <div class=\"orbit-tp__grid\">\n            @for (h of hours; track h) {\n              <button\n                type=\"button\"\n                class=\"orbit-tp__cell\"\n                [class.orbit-tp__cell--selected]=\"h === selectedHours()\"\n                (mousedown)=\"$event.preventDefault()\"\n                (click)=\"selectHour(h)\"\n              >\n                {{ formatHour(h) }}\n              </button>\n            }\n          </div>\n        } @else {\n          <div class=\"orbit-tp__grid\">\n            @for (m of minutes(); track m) {\n              <button\n                type=\"button\"\n                class=\"orbit-tp__cell\"\n                [class.orbit-tp__cell--selected]=\"m === selectedMinutes()\"\n                (mousedown)=\"$event.preventDefault()\"\n                (click)=\"selectMinute(m)\"\n              >\n                {{ formatMinute(m) }}\n              </button>\n            }\n          </div>\n        }\n      </div>\n    </div>\n  }\n</div>\n", styles: [":host{display:block}.orbit-tp{position:relative;display:flex}.orbit-tp__trigger{display:flex;align-items:center;gap:var(--orbit-space-2);width:100%;height:var(--orbit-control-height);padding:0 var(--orbit-control-padding-inline);border:1px solid var(--orbit-color-border);border-radius:var(--orbit-radius-control);background:var(--orbit-color-surface);color:var(--orbit-color-text);font-family:var(--orbit-font-sans);font-size:var(--orbit-font-size-body);text-align:left;cursor:pointer;transition:border-color .15s ease,box-shadow .15s ease}.orbit-tp__trigger:hover:not(:disabled){border-color:var(--orbit-color-border-strong)}.orbit-tp__trigger--open{border-color:var(--orbit-color-border-focus);box-shadow:var(--orbit-focus-ring)}.orbit-tp__trigger:disabled{background:var(--orbit-color-surface-muted);color:var(--orbit-color-text-muted);cursor:not-allowed;pointer-events:none}.orbit-tp__icon{width:1rem;height:1rem;flex-shrink:0;color:var(--orbit-color-text-muted)}.orbit-tp__text{color:var(--orbit-color-text)}.orbit-tp__trigger:hover .orbit-tp__text,.orbit-tp__trigger--open .orbit-tp__text{color:var(--orbit-color-primary)}:host(.orbit-tp--disabled) .orbit-tp__trigger{pointer-events:none;opacity:.5}:host(.orbit-tp--invalid) .orbit-tp__trigger{border-color:var(--orbit-color-danger)}.orbit-tp__dropdown{position:absolute;z-index:var(--orbit-z-modal, 1050);top:calc(100% + .25rem);left:0;width:14rem;border:1px solid var(--orbit-color-border);border-radius:var(--orbit-radius-control);background:var(--orbit-color-surface);box-shadow:var(--orbit-shadow-overlay);overflow:hidden}.orbit-tp__tabs{display:flex;border-bottom:1px solid var(--orbit-color-border-subtle)}.orbit-tp__tab{flex:1;padding:var(--orbit-space-2);border:0;background:transparent;color:var(--orbit-color-text-muted);font-family:var(--orbit-font-sans);font-size:var(--orbit-font-size-body);font-weight:var(--orbit-font-weight-emphasis);cursor:pointer;transition:color .15s ease;border-bottom:2px solid transparent}.orbit-tp__tab:hover{color:var(--orbit-color-text)}.orbit-tp__tab--active{color:var(--orbit-color-primary);border-bottom-color:var(--orbit-color-primary)}.orbit-tp__scroll{max-height:14rem;overflow-y:auto;padding:var(--orbit-space-2)}.orbit-tp__grid{display:grid;grid-template-columns:repeat(4,1fr);gap:2px}.orbit-tp__cell{display:flex;align-items:center;justify-content:center;height:2rem;border:0;border-radius:var(--orbit-radius-control);background:transparent;color:var(--orbit-color-text);font-family:var(--orbit-font-sans);font-size:var(--orbit-font-size-body);cursor:pointer;transition:background-color .1s ease,color .1s ease}.orbit-tp__cell:hover:not(.orbit-tp__cell--selected){background:var(--orbit-color-surface-muted)}.orbit-tp__cell--selected{background:var(--orbit-color-primary);color:var(--orbit-color-text-inverse)}.orbit-tp__cell--selected:hover{background:var(--orbit-color-primary-strong)}.orbit-tp__cell:focus-visible{outline:2px solid var(--orbit-color-border-focus);outline-offset:-1px}\n"], changeDetection: i0.ChangeDetectionStrategy.OnPush }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "22.0.7", ngImport: i0, type: OrbitTimePickerComponent, decorators: [{
            type: Component,
            args: [{ selector: 'orbit-time-picker', changeDetection: ChangeDetectionStrategy.OnPush, providers: [
                        {
                            provide: NG_VALUE_ACCESSOR,
                            useExisting: forwardRef(() => OrbitTimePickerComponent),
                            multi: true,
                        },
                    ], host: {
                        '[class.orbit-tp--disabled]': 'isDisabled()',
                        '[class.orbit-tp--invalid]': 'invalid()',
                    }, template: "<div class=\"orbit-tp\">\n  <button\n    type=\"button\"\n    class=\"orbit-tp__trigger\"\n    [disabled]=\"isDisabled()\"\n    [class.orbit-tp__trigger--open]=\"isOpen()\"\n    (mousedown)=\"$event.preventDefault()\"\n    (click)=\"toggle()\"\n    (blur)=\"onInputBlur()\"\n  >\n    <svg viewBox=\"0 0 16 16\" fill=\"none\" class=\"orbit-tp__icon\">\n      <circle cx=\"8\" cy=\"8\" r=\"6.5\" stroke=\"currentColor\" stroke-width=\"1.2\"/>\n      <path d=\"M8 4.5V8l2.5 2\" stroke=\"currentColor\" stroke-width=\"1.2\" stroke-linecap=\"round\"/>\n    </svg>\n    <span class=\"orbit-tp__text\">{{ displayText() || 'Seleziona orario' }}</span>\n  </button>\n\n  @if (isOpen()) {\n    <div class=\"orbit-tp__dropdown\">\n      <div class=\"orbit-tp__tabs\">\n        <button\n          type=\"button\"\n          class=\"orbit-tp__tab\"\n          [class.orbit-tp__tab--active]=\"activeTab() === 'hours'\"\n          (mousedown)=\"$event.preventDefault()\"\n          (click)=\"activeTab.set('hours')\"\n        >\n          Ore\n        </button>\n        <button\n          type=\"button\"\n          class=\"orbit-tp__tab\"\n          [class.orbit-tp__tab--active]=\"activeTab() === 'minutes'\"\n          (mousedown)=\"$event.preventDefault()\"\n          (click)=\"activeTab.set('minutes')\"\n        >\n          Minuti\n        </button>\n      </div>\n\n      <div class=\"orbit-tp__scroll\">\n        @if (activeTab() === 'hours') {\n          <div class=\"orbit-tp__grid\">\n            @for (h of hours; track h) {\n              <button\n                type=\"button\"\n                class=\"orbit-tp__cell\"\n                [class.orbit-tp__cell--selected]=\"h === selectedHours()\"\n                (mousedown)=\"$event.preventDefault()\"\n                (click)=\"selectHour(h)\"\n              >\n                {{ formatHour(h) }}\n              </button>\n            }\n          </div>\n        } @else {\n          <div class=\"orbit-tp__grid\">\n            @for (m of minutes(); track m) {\n              <button\n                type=\"button\"\n                class=\"orbit-tp__cell\"\n                [class.orbit-tp__cell--selected]=\"m === selectedMinutes()\"\n                (mousedown)=\"$event.preventDefault()\"\n                (click)=\"selectMinute(m)\"\n              >\n                {{ formatMinute(m) }}\n              </button>\n            }\n          </div>\n        }\n      </div>\n    </div>\n  }\n</div>\n", styles: [":host{display:block}.orbit-tp{position:relative;display:flex}.orbit-tp__trigger{display:flex;align-items:center;gap:var(--orbit-space-2);width:100%;height:var(--orbit-control-height);padding:0 var(--orbit-control-padding-inline);border:1px solid var(--orbit-color-border);border-radius:var(--orbit-radius-control);background:var(--orbit-color-surface);color:var(--orbit-color-text);font-family:var(--orbit-font-sans);font-size:var(--orbit-font-size-body);text-align:left;cursor:pointer;transition:border-color .15s ease,box-shadow .15s ease}.orbit-tp__trigger:hover:not(:disabled){border-color:var(--orbit-color-border-strong)}.orbit-tp__trigger--open{border-color:var(--orbit-color-border-focus);box-shadow:var(--orbit-focus-ring)}.orbit-tp__trigger:disabled{background:var(--orbit-color-surface-muted);color:var(--orbit-color-text-muted);cursor:not-allowed;pointer-events:none}.orbit-tp__icon{width:1rem;height:1rem;flex-shrink:0;color:var(--orbit-color-text-muted)}.orbit-tp__text{color:var(--orbit-color-text)}.orbit-tp__trigger:hover .orbit-tp__text,.orbit-tp__trigger--open .orbit-tp__text{color:var(--orbit-color-primary)}:host(.orbit-tp--disabled) .orbit-tp__trigger{pointer-events:none;opacity:.5}:host(.orbit-tp--invalid) .orbit-tp__trigger{border-color:var(--orbit-color-danger)}.orbit-tp__dropdown{position:absolute;z-index:var(--orbit-z-modal, 1050);top:calc(100% + .25rem);left:0;width:14rem;border:1px solid var(--orbit-color-border);border-radius:var(--orbit-radius-control);background:var(--orbit-color-surface);box-shadow:var(--orbit-shadow-overlay);overflow:hidden}.orbit-tp__tabs{display:flex;border-bottom:1px solid var(--orbit-color-border-subtle)}.orbit-tp__tab{flex:1;padding:var(--orbit-space-2);border:0;background:transparent;color:var(--orbit-color-text-muted);font-family:var(--orbit-font-sans);font-size:var(--orbit-font-size-body);font-weight:var(--orbit-font-weight-emphasis);cursor:pointer;transition:color .15s ease;border-bottom:2px solid transparent}.orbit-tp__tab:hover{color:var(--orbit-color-text)}.orbit-tp__tab--active{color:var(--orbit-color-primary);border-bottom-color:var(--orbit-color-primary)}.orbit-tp__scroll{max-height:14rem;overflow-y:auto;padding:var(--orbit-space-2)}.orbit-tp__grid{display:grid;grid-template-columns:repeat(4,1fr);gap:2px}.orbit-tp__cell{display:flex;align-items:center;justify-content:center;height:2rem;border:0;border-radius:var(--orbit-radius-control);background:transparent;color:var(--orbit-color-text);font-family:var(--orbit-font-sans);font-size:var(--orbit-font-size-body);cursor:pointer;transition:background-color .1s ease,color .1s ease}.orbit-tp__cell:hover:not(.orbit-tp__cell--selected){background:var(--orbit-color-surface-muted)}.orbit-tp__cell--selected{background:var(--orbit-color-primary);color:var(--orbit-color-text-inverse)}.orbit-tp__cell--selected:hover{background:var(--orbit-color-primary-strong)}.orbit-tp__cell:focus-visible{outline:2px solid var(--orbit-color-border-focus);outline-offset:-1px}\n"] }]
        }], propDecorators: { required: [{ type: i0.Input, args: [{ isSignal: true, alias: "required", required: false }] }], invalid: [{ type: i0.Input, args: [{ isSignal: true, alias: "invalid", required: false }] }], stepMinutes: [{ type: i0.Input, args: [{ isSignal: true, alias: "stepMinutes", required: false }] }], valueChange: [{ type: i0.Output, args: ["valueChange"] }] } });

class OrbitAttachmentDropzoneComponent {
    constructor() {
        this.accept = input('', /* @ts-ignore */
        ...(ngDevMode ? [{ debugName: "accept" }] : /* istanbul ignore next */ []));
        this.multiple = input(true, { ...(ngDevMode ? { debugName: "multiple" } : /* istanbul ignore next */ {}), transform: booleanAttribute });
        this.maxSizeBytes = input(10 * 1024 * 1024, /* @ts-ignore */
        ...(ngDevMode ? [{ debugName: "maxSizeBytes" }] : /* istanbul ignore next */ []));
        this.disabled = input(false, { ...(ngDevMode ? { debugName: "disabled" } : /* istanbul ignore next */ {}), transform: booleanAttribute });
        this.hint = input('Trascina i file qui oppure clicca per sfogliare', /* @ts-ignore */
        ...(ngDevMode ? [{ debugName: "hint" }] : /* istanbul ignore next */ []));
        this.filesDropped = output();
        this.fileError = output();
        this.isDragOver = signal(false, /* @ts-ignore */
        ...(ngDevMode ? [{ debugName: "isDragOver" }] : /* istanbul ignore next */ []));
        this.isDisabled = signal(false, /* @ts-ignore */
        ...(ngDevMode ? [{ debugName: "isDisabled" }] : /* istanbul ignore next */ []));
        this.dragCounter = 0;
    }
    onDragEnter(event) {
        event.preventDefault();
        this.dragCounter++;
        if (!this.disabled())
            this.isDragOver.set(true);
    }
    onDragOver(event) {
        event.preventDefault();
    }
    onDragLeave(event) {
        event.preventDefault();
        this.dragCounter--;
        if (this.dragCounter === 0)
            this.isDragOver.set(false);
    }
    onDrop(event) {
        event.preventDefault();
        this.dragCounter = 0;
        this.isDragOver.set(false);
        if (this.disabled())
            return;
        const files = Array.from(event.dataTransfer?.files ?? []);
        this.processFiles(files, 'drop');
    }
    onZoneClick() {
        if (this.disabled())
            return;
        this.fileInput.nativeElement.click();
    }
    onInputChange(event) {
        const input = event.target;
        const files = Array.from(input.files ?? []);
        this.processFiles(files, 'click');
        input.value = '';
    }
    processFiles(files, source) {
        const maxSize = this.maxSizeBytes();
        const oversized = files.find((f) => f.size > maxSize);
        if (oversized) {
            this.fileError.emit(`Il file "${oversized.name}" supera la dimensione massima di ${this.formatSize(maxSize)}`);
            return;
        }
        this.filesDropped.emit({ files, source });
    }
    formatSize(bytes) {
        if (bytes < 1024)
            return `${bytes} B`;
        if (bytes < 1024 * 1024)
            return `${(bytes / 1024).toFixed(1)} KB`;
        return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "22.0.7", ngImport: i0, type: OrbitAttachmentDropzoneComponent, deps: [], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.1.0", version: "22.0.7", type: OrbitAttachmentDropzoneComponent, isStandalone: true, selector: "orbit-attachment-dropzone", inputs: { accept: { classPropertyName: "accept", publicName: "accept", isSignal: true, isRequired: false, transformFunction: null }, multiple: { classPropertyName: "multiple", publicName: "multiple", isSignal: true, isRequired: false, transformFunction: null }, maxSizeBytes: { classPropertyName: "maxSizeBytes", publicName: "maxSizeBytes", isSignal: true, isRequired: false, transformFunction: null }, disabled: { classPropertyName: "disabled", publicName: "disabled", isSignal: true, isRequired: false, transformFunction: null }, hint: { classPropertyName: "hint", publicName: "hint", isSignal: true, isRequired: false, transformFunction: null } }, outputs: { filesDropped: "filesDropped", fileError: "fileError" }, host: { properties: { "class.orbit-drop--disabled": "isDisabled()" } }, viewQueries: [{ propertyName: "fileInput", first: true, predicate: ["fileInput"], descendants: true }], ngImport: i0, template: "<div\n  class=\"orbit-drop__zone\"\n  [class.orbit-drop__zone--drag]=\"isDragOver()\"\n  [class.orbit-drop__zone--disabled]=\"disabled()\"\n  (dragenter)=\"onDragEnter($event)\"\n  (dragover)=\"onDragOver($event)\"\n  (dragleave)=\"onDragLeave($event)\"\n  (drop)=\"onDrop($event)\"\n  (click)=\"onZoneClick()\"\n  role=\"button\"\n  tabindex=\"0\"\n  [attr.aria-disabled]=\"disabled()\"\n>\n  <svg viewBox=\"0 0 48 48\" fill=\"none\" class=\"orbit-drop__icon\">\n    <rect x=\"4\" y=\"8\" width=\"40\" height=\"32\" rx=\"4\" stroke=\"currentColor\" stroke-width=\"1.5\" stroke-dasharray=\"4 2\"/>\n    <path d=\"M24 18v12M18 24h12\" stroke=\"currentColor\" stroke-width=\"1.5\" stroke-linecap=\"round\"/>\n  </svg>\n  <span class=\"orbit-drop__label\">Trascina i file qui oppure clicca per sfogliare</span>\n  <span class=\"orbit-drop__hint\">{{ hint() }}</span>\n</div>\n\n<input\n  #fileInput\n  type=\"file\"\n  class=\"orbit-drop__input\"\n  [accept]=\"accept()\"\n  [multiple]=\"multiple()\"\n  (change)=\"onInputChange($event)\"\n/>\n", styles: [":host{display:block}.orbit-drop__zone{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:var(--orbit-space-2);padding:var(--orbit-space-6);border:2px dashed var(--orbit-color-border);border-radius:var(--orbit-radius-control);background:var(--orbit-color-surface-muted);cursor:pointer;transition:border-color .15s ease,background-color .15s ease}.orbit-drop__zone:hover:not(.orbit-drop__zone--disabled){border-color:var(--orbit-color-primary);background:var(--orbit-color-primary-subtle)}.orbit-drop__zone--drag:not(.orbit-drop__zone--disabled){border-color:var(--orbit-color-primary);background:var(--orbit-color-primary-subtle);border-style:solid}.orbit-drop__zone--disabled{opacity:.5;cursor:not-allowed;pointer-events:none}.orbit-drop__icon{width:3rem;height:3rem;color:var(--orbit-color-text-muted)}.orbit-drop__zone:hover:not(.orbit-drop__zone--disabled) .orbit-drop__icon,.orbit-drop__zone--drag:not(.orbit-drop__zone--disabled) .orbit-drop__icon{color:var(--orbit-color-primary)}.orbit-drop__label{color:var(--orbit-color-text);font-family:var(--orbit-font-sans);font-size:var(--orbit-font-size-body);font-weight:var(--orbit-font-weight-emphasis);text-align:center}.orbit-drop__hint{color:var(--orbit-color-text-muted);font-family:var(--orbit-font-sans);font-size:var(--orbit-font-size-xs);text-align:center}.orbit-drop__input{position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0}\n"], changeDetection: i0.ChangeDetectionStrategy.OnPush }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "22.0.7", ngImport: i0, type: OrbitAttachmentDropzoneComponent, decorators: [{
            type: Component,
            args: [{ selector: 'orbit-attachment-dropzone', changeDetection: ChangeDetectionStrategy.OnPush, host: {
                        '[class.orbit-drop--disabled]': 'isDisabled()',
                    }, template: "<div\n  class=\"orbit-drop__zone\"\n  [class.orbit-drop__zone--drag]=\"isDragOver()\"\n  [class.orbit-drop__zone--disabled]=\"disabled()\"\n  (dragenter)=\"onDragEnter($event)\"\n  (dragover)=\"onDragOver($event)\"\n  (dragleave)=\"onDragLeave($event)\"\n  (drop)=\"onDrop($event)\"\n  (click)=\"onZoneClick()\"\n  role=\"button\"\n  tabindex=\"0\"\n  [attr.aria-disabled]=\"disabled()\"\n>\n  <svg viewBox=\"0 0 48 48\" fill=\"none\" class=\"orbit-drop__icon\">\n    <rect x=\"4\" y=\"8\" width=\"40\" height=\"32\" rx=\"4\" stroke=\"currentColor\" stroke-width=\"1.5\" stroke-dasharray=\"4 2\"/>\n    <path d=\"M24 18v12M18 24h12\" stroke=\"currentColor\" stroke-width=\"1.5\" stroke-linecap=\"round\"/>\n  </svg>\n  <span class=\"orbit-drop__label\">Trascina i file qui oppure clicca per sfogliare</span>\n  <span class=\"orbit-drop__hint\">{{ hint() }}</span>\n</div>\n\n<input\n  #fileInput\n  type=\"file\"\n  class=\"orbit-drop__input\"\n  [accept]=\"accept()\"\n  [multiple]=\"multiple()\"\n  (change)=\"onInputChange($event)\"\n/>\n", styles: [":host{display:block}.orbit-drop__zone{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:var(--orbit-space-2);padding:var(--orbit-space-6);border:2px dashed var(--orbit-color-border);border-radius:var(--orbit-radius-control);background:var(--orbit-color-surface-muted);cursor:pointer;transition:border-color .15s ease,background-color .15s ease}.orbit-drop__zone:hover:not(.orbit-drop__zone--disabled){border-color:var(--orbit-color-primary);background:var(--orbit-color-primary-subtle)}.orbit-drop__zone--drag:not(.orbit-drop__zone--disabled){border-color:var(--orbit-color-primary);background:var(--orbit-color-primary-subtle);border-style:solid}.orbit-drop__zone--disabled{opacity:.5;cursor:not-allowed;pointer-events:none}.orbit-drop__icon{width:3rem;height:3rem;color:var(--orbit-color-text-muted)}.orbit-drop__zone:hover:not(.orbit-drop__zone--disabled) .orbit-drop__icon,.orbit-drop__zone--drag:not(.orbit-drop__zone--disabled) .orbit-drop__icon{color:var(--orbit-color-primary)}.orbit-drop__label{color:var(--orbit-color-text);font-family:var(--orbit-font-sans);font-size:var(--orbit-font-size-body);font-weight:var(--orbit-font-weight-emphasis);text-align:center}.orbit-drop__hint{color:var(--orbit-color-text-muted);font-family:var(--orbit-font-sans);font-size:var(--orbit-font-size-xs);text-align:center}.orbit-drop__input{position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0}\n"] }]
        }], propDecorators: { fileInput: [{
                type: ViewChild,
                args: ['fileInput']
            }], accept: [{ type: i0.Input, args: [{ isSignal: true, alias: "accept", required: false }] }], multiple: [{ type: i0.Input, args: [{ isSignal: true, alias: "multiple", required: false }] }], maxSizeBytes: [{ type: i0.Input, args: [{ isSignal: true, alias: "maxSizeBytes", required: false }] }], disabled: [{ type: i0.Input, args: [{ isSignal: true, alias: "disabled", required: false }] }], hint: [{ type: i0.Input, args: [{ isSignal: true, alias: "hint", required: false }] }], filesDropped: [{ type: i0.Output, args: ["filesDropped"] }], fileError: [{ type: i0.Output, args: ["fileError"] }] } });

class OrbitModalHeaderComponent {
    constructor() {
        this.title = input('', /* @ts-ignore */
        ...(ngDevMode ? [{ debugName: "title" }] : /* istanbul ignore next */ []));
        this.titleId = input('', /* @ts-ignore */
        ...(ngDevMode ? [{ debugName: "titleId" }] : /* istanbul ignore next */ []));
        this.subtitle = input('', /* @ts-ignore */
        ...(ngDevMode ? [{ debugName: "subtitle" }] : /* istanbul ignore next */ []));
        this.variant = input('default', /* @ts-ignore */
        ...(ngDevMode ? [{ debugName: "variant" }] : /* istanbul ignore next */ []));
        this.closable = input(true, { ...(ngDevMode ? { debugName: "closable" } : /* istanbul ignore next */ {}), transform: booleanAttribute });
        this.loading = input(false, { ...(ngDevMode ? { debugName: "loading" } : /* istanbul ignore next */ {}), transform: booleanAttribute });
        this.closeClicked = output();
    }
    onClose() {
        this.closeClicked.emit();
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "22.0.7", ngImport: i0, type: OrbitModalHeaderComponent, deps: [], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "22.0.7", type: OrbitModalHeaderComponent, isStandalone: true, selector: "orbit-modal-header", inputs: { title: { classPropertyName: "title", publicName: "title", isSignal: true, isRequired: false, transformFunction: null }, titleId: { classPropertyName: "titleId", publicName: "titleId", isSignal: true, isRequired: false, transformFunction: null }, subtitle: { classPropertyName: "subtitle", publicName: "subtitle", isSignal: true, isRequired: false, transformFunction: null }, variant: { classPropertyName: "variant", publicName: "variant", isSignal: true, isRequired: false, transformFunction: null }, closable: { classPropertyName: "closable", publicName: "closable", isSignal: true, isRequired: false, transformFunction: null }, loading: { classPropertyName: "loading", publicName: "loading", isSignal: true, isRequired: false, transformFunction: null } }, outputs: { closeClicked: "closeClicked" }, host: { properties: { "class.orbit-modal-header--form": "variant() === \"form\"" } }, ngImport: i0, template: "<div class=\"orbit-modal-header__content\">\n  @if (loading()) {\n    <span class=\"orbit-modal-header__spinner\"></span>\n  }\n  <div class=\"orbit-modal-header__text\">\n    <h2 class=\"orbit-modal-header__title\" [id]=\"titleId() || null\">{{ title() }}</h2>\n    @if (subtitle()) {\n      <p class=\"orbit-modal-header__subtitle\">{{ subtitle() }}</p>\n    }\n  </div>\n</div>\n\n@if (closable()) {\n  <orbit-icon-button\n    class=\"orbit-modal-header__close\"\n    ariaLabel=\"Chiudi\"\n    (clicked)=\"onClose()\"\n  >\n    <svg viewBox=\"0 0 16 16\" fill=\"none\" class=\"orbit-modal-header__close-icon\">\n      <path d=\"M4 4l8 8M12 4l-8 8\" stroke=\"currentColor\" stroke-width=\"1.5\" stroke-linecap=\"round\"/>\n    </svg>\n  </orbit-icon-button>\n}\n", styles: [":host{display:flex;align-items:flex-start;justify-content:space-between;gap:var(--orbit-space-3);padding:var(--orbit-space-4) var(--orbit-space-5);border-bottom:1px solid var(--orbit-border-subtle);background:var(--orbit-surface-default)}:host(.orbit-modal-header--form){background:var(--orbit-surface-subtle)}.orbit-modal-header__content{display:flex;align-items:center;gap:var(--orbit-space-2);min-width:0;flex:1}.orbit-modal-header__spinner{width:var(--orbit-font-size-lg);height:var(--orbit-font-size-lg);border:2px solid var(--orbit-border-subtle);border-top-color:var(--orbit-action-primary-bg);border-radius:var(--orbit-radius-sm);animation:orbit-modal-header-spin .6s linear infinite;flex-shrink:0}.orbit-modal-header__text{min-width:0}.orbit-modal-header__title{margin:0;font-family:var(--orbit-font-sans);font-size:var(--orbit-font-size-lg);font-weight:var(--orbit-font-weight-emphasis);line-height:var(--orbit-line-height-body);color:var(--orbit-text-primary)}.orbit-modal-header__subtitle{margin:var(--orbit-space-1) 0 0;font-family:var(--orbit-font-sans);font-size:var(--orbit-font-size-sm);line-height:var(--orbit-line-height-body);color:var(--orbit-text-secondary)}.orbit-modal-header__close{flex-shrink:0}.orbit-modal-header__close-icon{width:var(--orbit-font-size-lg);height:var(--orbit-font-size-lg)}@keyframes orbit-modal-header-spin{to{transform:rotate(360deg)}}\n"], dependencies: [{ kind: "component", type: OrbitIconButtonComponent, selector: "orbit-icon-button", inputs: ["icon", "ariaLabel", "tone", "type", "disabled"], outputs: ["clicked"] }], changeDetection: i0.ChangeDetectionStrategy.OnPush }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "22.0.7", ngImport: i0, type: OrbitModalHeaderComponent, decorators: [{
            type: Component,
            args: [{ selector: 'orbit-modal-header', changeDetection: ChangeDetectionStrategy.OnPush, imports: [OrbitIconButtonComponent], host: {
                        '[class.orbit-modal-header--form]': 'variant() === "form"',
                    }, template: "<div class=\"orbit-modal-header__content\">\n  @if (loading()) {\n    <span class=\"orbit-modal-header__spinner\"></span>\n  }\n  <div class=\"orbit-modal-header__text\">\n    <h2 class=\"orbit-modal-header__title\" [id]=\"titleId() || null\">{{ title() }}</h2>\n    @if (subtitle()) {\n      <p class=\"orbit-modal-header__subtitle\">{{ subtitle() }}</p>\n    }\n  </div>\n</div>\n\n@if (closable()) {\n  <orbit-icon-button\n    class=\"orbit-modal-header__close\"\n    ariaLabel=\"Chiudi\"\n    (clicked)=\"onClose()\"\n  >\n    <svg viewBox=\"0 0 16 16\" fill=\"none\" class=\"orbit-modal-header__close-icon\">\n      <path d=\"M4 4l8 8M12 4l-8 8\" stroke=\"currentColor\" stroke-width=\"1.5\" stroke-linecap=\"round\"/>\n    </svg>\n  </orbit-icon-button>\n}\n", styles: [":host{display:flex;align-items:flex-start;justify-content:space-between;gap:var(--orbit-space-3);padding:var(--orbit-space-4) var(--orbit-space-5);border-bottom:1px solid var(--orbit-border-subtle);background:var(--orbit-surface-default)}:host(.orbit-modal-header--form){background:var(--orbit-surface-subtle)}.orbit-modal-header__content{display:flex;align-items:center;gap:var(--orbit-space-2);min-width:0;flex:1}.orbit-modal-header__spinner{width:var(--orbit-font-size-lg);height:var(--orbit-font-size-lg);border:2px solid var(--orbit-border-subtle);border-top-color:var(--orbit-action-primary-bg);border-radius:var(--orbit-radius-sm);animation:orbit-modal-header-spin .6s linear infinite;flex-shrink:0}.orbit-modal-header__text{min-width:0}.orbit-modal-header__title{margin:0;font-family:var(--orbit-font-sans);font-size:var(--orbit-font-size-lg);font-weight:var(--orbit-font-weight-emphasis);line-height:var(--orbit-line-height-body);color:var(--orbit-text-primary)}.orbit-modal-header__subtitle{margin:var(--orbit-space-1) 0 0;font-family:var(--orbit-font-sans);font-size:var(--orbit-font-size-sm);line-height:var(--orbit-line-height-body);color:var(--orbit-text-secondary)}.orbit-modal-header__close{flex-shrink:0}.orbit-modal-header__close-icon{width:var(--orbit-font-size-lg);height:var(--orbit-font-size-lg)}@keyframes orbit-modal-header-spin{to{transform:rotate(360deg)}}\n"] }]
        }], propDecorators: { title: [{ type: i0.Input, args: [{ isSignal: true, alias: "title", required: false }] }], titleId: [{ type: i0.Input, args: [{ isSignal: true, alias: "titleId", required: false }] }], subtitle: [{ type: i0.Input, args: [{ isSignal: true, alias: "subtitle", required: false }] }], variant: [{ type: i0.Input, args: [{ isSignal: true, alias: "variant", required: false }] }], closable: [{ type: i0.Input, args: [{ isSignal: true, alias: "closable", required: false }] }], loading: [{ type: i0.Input, args: [{ isSignal: true, alias: "loading", required: false }] }], closeClicked: [{ type: i0.Output, args: ["closeClicked"] }] } });

class OrbitModalBodyComponent {
    constructor() {
        this.loading = input(false, { ...(ngDevMode ? { debugName: "loading" } : /* istanbul ignore next */ {}), transform: booleanAttribute });
        this.loadingLabel = input('Operazione in corso', /* @ts-ignore */
        ...(ngDevMode ? [{ debugName: "loadingLabel" }] : /* istanbul ignore next */ []));
        this.loaderSmall = input(false, { ...(ngDevMode ? { debugName: "loaderSmall" } : /* istanbul ignore next */ {}), transform: booleanAttribute });
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "22.0.7", ngImport: i0, type: OrbitModalBodyComponent, deps: [], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "22.0.7", type: OrbitModalBodyComponent, isStandalone: true, selector: "orbit-modal-body", inputs: { loading: { classPropertyName: "loading", publicName: "loading", isSignal: true, isRequired: false, transformFunction: null }, loadingLabel: { classPropertyName: "loadingLabel", publicName: "loadingLabel", isSignal: true, isRequired: false, transformFunction: null }, loaderSmall: { classPropertyName: "loaderSmall", publicName: "loaderSmall", isSignal: true, isRequired: false, transformFunction: null } }, ngImport: i0, template: "<div class=\"orbit-modal-body__scroll\">\n  <ng-content></ng-content>\n\n  @if (loading()) {\n    <div class=\"orbit-modal-body__loader\" [class.orbit-modal-body__loader--small]=\"loaderSmall()\">\n      <span class=\"orbit-modal-body__spinner\"></span>\n      <span class=\"orbit-modal-body__loader-text\">{{ loadingLabel() }}</span>\n    </div>\n  }\n</div>\n", styles: [":host{display:block;flex:1;min-height:0;background:var(--orbit-surface-default)}.orbit-modal-body__scroll{position:relative;overflow-y:auto;padding:var(--orbit-space-4) var(--orbit-space-5);min-height:4rem}.orbit-modal-body__loader{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:var(--orbit-space-2);background:var(--orbit-surface-default);opacity:.95;z-index:1}.orbit-modal-body__loader--small{background:transparent;opacity:1}.orbit-modal-body__spinner{width:var(--orbit-space-5);height:var(--orbit-space-5);border:2px solid var(--orbit-border-subtle);border-top-color:var(--orbit-action-primary-bg);border-radius:var(--orbit-radius-sm);animation:orbit-modal-body-spin .6s linear infinite}.orbit-modal-body__loader--small .orbit-modal-body__spinner{width:var(--orbit-font-size-lg);height:var(--orbit-font-size-lg)}.orbit-modal-body__loader-text{font-family:var(--orbit-font-sans);font-size:var(--orbit-font-size-sm);color:var(--orbit-text-secondary)}@keyframes orbit-modal-body-spin{to{transform:rotate(360deg)}}\n"], changeDetection: i0.ChangeDetectionStrategy.OnPush }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "22.0.7", ngImport: i0, type: OrbitModalBodyComponent, decorators: [{
            type: Component,
            args: [{ selector: 'orbit-modal-body', changeDetection: ChangeDetectionStrategy.OnPush, template: "<div class=\"orbit-modal-body__scroll\">\n  <ng-content></ng-content>\n\n  @if (loading()) {\n    <div class=\"orbit-modal-body__loader\" [class.orbit-modal-body__loader--small]=\"loaderSmall()\">\n      <span class=\"orbit-modal-body__spinner\"></span>\n      <span class=\"orbit-modal-body__loader-text\">{{ loadingLabel() }}</span>\n    </div>\n  }\n</div>\n", styles: [":host{display:block;flex:1;min-height:0;background:var(--orbit-surface-default)}.orbit-modal-body__scroll{position:relative;overflow-y:auto;padding:var(--orbit-space-4) var(--orbit-space-5);min-height:4rem}.orbit-modal-body__loader{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:var(--orbit-space-2);background:var(--orbit-surface-default);opacity:.95;z-index:1}.orbit-modal-body__loader--small{background:transparent;opacity:1}.orbit-modal-body__spinner{width:var(--orbit-space-5);height:var(--orbit-space-5);border:2px solid var(--orbit-border-subtle);border-top-color:var(--orbit-action-primary-bg);border-radius:var(--orbit-radius-sm);animation:orbit-modal-body-spin .6s linear infinite}.orbit-modal-body__loader--small .orbit-modal-body__spinner{width:var(--orbit-font-size-lg);height:var(--orbit-font-size-lg)}.orbit-modal-body__loader-text{font-family:var(--orbit-font-sans);font-size:var(--orbit-font-size-sm);color:var(--orbit-text-secondary)}@keyframes orbit-modal-body-spin{to{transform:rotate(360deg)}}\n"] }]
        }], propDecorators: { loading: [{ type: i0.Input, args: [{ isSignal: true, alias: "loading", required: false }] }], loadingLabel: [{ type: i0.Input, args: [{ isSignal: true, alias: "loadingLabel", required: false }] }], loaderSmall: [{ type: i0.Input, args: [{ isSignal: true, alias: "loaderSmall", required: false }] }] } });

class OrbitModalFooterComponent {
    constructor() {
        this.variant = input('default', /* @ts-ignore */
        ...(ngDevMode ? [{ debugName: "variant" }] : /* istanbul ignore next */ []));
        this.loading = input(false, { ...(ngDevMode ? { debugName: "loading" } : /* istanbul ignore next */ {}), transform: booleanAttribute });
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "22.0.7", ngImport: i0, type: OrbitModalFooterComponent, deps: [], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.1.0", version: "22.0.7", type: OrbitModalFooterComponent, isStandalone: true, selector: "orbit-modal-footer", inputs: { variant: { classPropertyName: "variant", publicName: "variant", isSignal: true, isRequired: false, transformFunction: null }, loading: { classPropertyName: "loading", publicName: "loading", isSignal: true, isRequired: false, transformFunction: null } }, host: { properties: { "class.orbit-modal-footer--form": "variant() === \"form\"" } }, ngImport: i0, template: "<div class=\"orbit-modal-footer__actions\">\n  <ng-content></ng-content>\n</div>\n", styles: [":host{display:block;background:var(--orbit-surface-default)}.orbit-modal-footer__actions{display:flex;align-items:center;justify-content:flex-end;gap:var(--orbit-space-2);padding:var(--orbit-space-3) var(--orbit-space-5);border-top:1px solid var(--orbit-border-subtle)}:host(.orbit-modal-footer--form){background:var(--orbit-surface-subtle)}\n"], changeDetection: i0.ChangeDetectionStrategy.OnPush }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "22.0.7", ngImport: i0, type: OrbitModalFooterComponent, decorators: [{
            type: Component,
            args: [{ selector: 'orbit-modal-footer', changeDetection: ChangeDetectionStrategy.OnPush, host: {
                        '[class.orbit-modal-footer--form]': 'variant() === "form"',
                    }, template: "<div class=\"orbit-modal-footer__actions\">\n  <ng-content></ng-content>\n</div>\n", styles: [":host{display:block;background:var(--orbit-surface-default)}.orbit-modal-footer__actions{display:flex;align-items:center;justify-content:flex-end;gap:var(--orbit-space-2);padding:var(--orbit-space-3) var(--orbit-space-5);border-top:1px solid var(--orbit-border-subtle)}:host(.orbit-modal-footer--form){background:var(--orbit-surface-subtle)}\n"] }]
        }], propDecorators: { variant: [{ type: i0.Input, args: [{ isSignal: true, alias: "variant", required: false }] }], loading: [{ type: i0.Input, args: [{ isSignal: true, alias: "loading", required: false }] }] } });

class OrbitFormActionBarComponent {
    constructor() {
        this.confirmLabel = input('SALVA E CONTINUA', /* @ts-ignore */
        ...(ngDevMode ? [{ debugName: "confirmLabel" }] : /* istanbul ignore next */ []));
        this.draftLabel = input('SALVA BOZZA', /* @ts-ignore */
        ...(ngDevMode ? [{ debugName: "draftLabel" }] : /* istanbul ignore next */ []));
        this.cancelLabel = input('ANNULLA', /* @ts-ignore */
        ...(ngDevMode ? [{ debugName: "cancelLabel" }] : /* istanbul ignore next */ []));
        this.showCancel = input(true, { ...(ngDevMode ? { debugName: "showCancel" } : /* istanbul ignore next */ {}), transform: booleanAttribute });
        this.showDraft = input(true, { ...(ngDevMode ? { debugName: "showDraft" } : /* istanbul ignore next */ {}), transform: booleanAttribute });
        this.loading = input(false, { ...(ngDevMode ? { debugName: "loading" } : /* istanbul ignore next */ {}), transform: booleanAttribute });
        this.confirmDisabled = input(false, { ...(ngDevMode ? { debugName: "confirmDisabled" } : /* istanbul ignore next */ {}), transform: booleanAttribute });
        this.confirmTone = input('primary', /* @ts-ignore */
        ...(ngDevMode ? [{ debugName: "confirmTone" }] : /* istanbul ignore next */ []));
        this.cancel = output();
        this.saveDraft = output();
        this.confirm = output();
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "22.0.7", ngImport: i0, type: OrbitFormActionBarComponent, deps: [], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "22.0.7", type: OrbitFormActionBarComponent, isStandalone: true, selector: "orbit-form-action-bar", inputs: { confirmLabel: { classPropertyName: "confirmLabel", publicName: "confirmLabel", isSignal: true, isRequired: false, transformFunction: null }, draftLabel: { classPropertyName: "draftLabel", publicName: "draftLabel", isSignal: true, isRequired: false, transformFunction: null }, cancelLabel: { classPropertyName: "cancelLabel", publicName: "cancelLabel", isSignal: true, isRequired: false, transformFunction: null }, showCancel: { classPropertyName: "showCancel", publicName: "showCancel", isSignal: true, isRequired: false, transformFunction: null }, showDraft: { classPropertyName: "showDraft", publicName: "showDraft", isSignal: true, isRequired: false, transformFunction: null }, loading: { classPropertyName: "loading", publicName: "loading", isSignal: true, isRequired: false, transformFunction: null }, confirmDisabled: { classPropertyName: "confirmDisabled", publicName: "confirmDisabled", isSignal: true, isRequired: false, transformFunction: null }, confirmTone: { classPropertyName: "confirmTone", publicName: "confirmTone", isSignal: true, isRequired: false, transformFunction: null } }, outputs: { cancel: "cancel", saveDraft: "saveDraft", confirm: "confirm" }, host: { properties: { "class.orbit-form-action-bar--loading": "loading()" } }, ngImport: i0, template: "<div class=\"orbit-form-action-bar\">\n  @if (showCancel()) {\n    <orbit-button\n      class=\"orbit-form-action-bar__btn orbit-form-action-bar__btn--cancel\"\n      [label]=\"cancelLabel()\"\n      variant=\"outline\"\n      tone=\"neutral\"\n      [disabled]=\"loading()\"\n      (clicked)=\"cancel.emit()\"\n    />\n  }\n\n  @if (showDraft()) {\n    <orbit-button\n      class=\"orbit-form-action-bar__btn orbit-form-action-bar__btn--draft\"\n      [label]=\"draftLabel()\"\n      variant=\"soft\"\n      tone=\"neutral\"\n      [disabled]=\"loading()\"\n      (clicked)=\"saveDraft.emit()\"\n    />\n  }\n\n  <orbit-button\n    class=\"orbit-form-action-bar__btn orbit-form-action-bar__btn--confirm\"\n    [label]=\"confirmLabel()\"\n    variant=\"solid\"\n    [tone]=\"confirmTone()\"\n    [loading]=\"loading()\"\n    [disabled]=\"loading() || confirmDisabled()\"\n    (clicked)=\"confirm.emit()\"\n  />\n</div>\n", styles: [":host{display:block}.orbit-form-action-bar{display:flex;flex-wrap:wrap;align-items:center;justify-content:flex-end;gap:var(--orbit-space-2)}@media(max-width:32rem){.orbit-form-action-bar{align-items:stretch}.orbit-form-action-bar__btn--confirm{flex-basis:100%}}\n"], dependencies: [{ kind: "component", type: OrbitButtonComponent, selector: "orbit-button", inputs: ["label", "variant", "tone", "type", "disabled", "loading", "iconOnly", "icon", "ariaLabel"], outputs: ["clicked"] }], changeDetection: i0.ChangeDetectionStrategy.OnPush }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "22.0.7", ngImport: i0, type: OrbitFormActionBarComponent, decorators: [{
            type: Component,
            args: [{ selector: 'orbit-form-action-bar', changeDetection: ChangeDetectionStrategy.OnPush, imports: [OrbitButtonComponent], host: {
                        '[class.orbit-form-action-bar--loading]': 'loading()',
                    }, template: "<div class=\"orbit-form-action-bar\">\n  @if (showCancel()) {\n    <orbit-button\n      class=\"orbit-form-action-bar__btn orbit-form-action-bar__btn--cancel\"\n      [label]=\"cancelLabel()\"\n      variant=\"outline\"\n      tone=\"neutral\"\n      [disabled]=\"loading()\"\n      (clicked)=\"cancel.emit()\"\n    />\n  }\n\n  @if (showDraft()) {\n    <orbit-button\n      class=\"orbit-form-action-bar__btn orbit-form-action-bar__btn--draft\"\n      [label]=\"draftLabel()\"\n      variant=\"soft\"\n      tone=\"neutral\"\n      [disabled]=\"loading()\"\n      (clicked)=\"saveDraft.emit()\"\n    />\n  }\n\n  <orbit-button\n    class=\"orbit-form-action-bar__btn orbit-form-action-bar__btn--confirm\"\n    [label]=\"confirmLabel()\"\n    variant=\"solid\"\n    [tone]=\"confirmTone()\"\n    [loading]=\"loading()\"\n    [disabled]=\"loading() || confirmDisabled()\"\n    (clicked)=\"confirm.emit()\"\n  />\n</div>\n", styles: [":host{display:block}.orbit-form-action-bar{display:flex;flex-wrap:wrap;align-items:center;justify-content:flex-end;gap:var(--orbit-space-2)}@media(max-width:32rem){.orbit-form-action-bar{align-items:stretch}.orbit-form-action-bar__btn--confirm{flex-basis:100%}}\n"] }]
        }], propDecorators: { confirmLabel: [{ type: i0.Input, args: [{ isSignal: true, alias: "confirmLabel", required: false }] }], draftLabel: [{ type: i0.Input, args: [{ isSignal: true, alias: "draftLabel", required: false }] }], cancelLabel: [{ type: i0.Input, args: [{ isSignal: true, alias: "cancelLabel", required: false }] }], showCancel: [{ type: i0.Input, args: [{ isSignal: true, alias: "showCancel", required: false }] }], showDraft: [{ type: i0.Input, args: [{ isSignal: true, alias: "showDraft", required: false }] }], loading: [{ type: i0.Input, args: [{ isSignal: true, alias: "loading", required: false }] }], confirmDisabled: [{ type: i0.Input, args: [{ isSignal: true, alias: "confirmDisabled", required: false }] }], confirmTone: [{ type: i0.Input, args: [{ isSignal: true, alias: "confirmTone", required: false }] }], cancel: [{ type: i0.Output, args: ["cancel"] }], saveDraft: [{ type: i0.Output, args: ["saveDraft"] }], confirm: [{ type: i0.Output, args: ["confirm"] }] } });

class TooltipComponent {
    constructor() {
        this.text = '';
        this.id = '';
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "22.0.7", ngImport: i0, type: TooltipComponent, deps: [], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "22.0.7", type: TooltipComponent, isStandalone: true, selector: "orbit-tooltip", host: { properties: { "class.orbit-tooltip-panel": "true" } }, ngImport: i0, template: `<span [attr.id]="id" class="orbit-tooltip">{{ text }}</span>`, isInline: true, styles: [":host{display:block}.orbit-tooltip{display:block;padding:var(--orbit-space-2) var(--orbit-space-3);border-radius:var(--orbit-radius-control);background:var(--orbit-color-surface-inverse);color:var(--orbit-color-text-inverse);font-family:var(--orbit-font-sans);font-size:var(--orbit-font-size-xs);line-height:1.4;white-space:nowrap;box-shadow:var(--orbit-shadow-overlay);pointer-events:none}\n"], changeDetection: i0.ChangeDetectionStrategy.OnPush }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "22.0.7", ngImport: i0, type: TooltipComponent, decorators: [{
            type: Component,
            args: [{ selector: 'orbit-tooltip', changeDetection: ChangeDetectionStrategy.OnPush, template: `<span [attr.id]="id" class="orbit-tooltip">{{ text }}</span>`, host: {
                        '[class.orbit-tooltip-panel]': 'true',
                    }, styles: [":host{display:block}.orbit-tooltip{display:block;padding:var(--orbit-space-2) var(--orbit-space-3);border-radius:var(--orbit-radius-control);background:var(--orbit-color-surface-inverse);color:var(--orbit-color-text-inverse);font-family:var(--orbit-font-sans);font-size:var(--orbit-font-size-xs);line-height:1.4;white-space:nowrap;box-shadow:var(--orbit-shadow-overlay);pointer-events:none}\n"] }]
        }] });

class OrbitTooltipDirective {
    constructor() {
        this.orbitTooltip = input.required({ ...(ngDevMode ? { debugName: "orbitTooltip" } : /* istanbul ignore next */ {}), alias: 'orbitTooltip' });
        this.orbitTooltipPosition = input('top', /* @ts-ignore */
        ...(ngDevMode ? [{ debugName: "orbitTooltipPosition" }] : /* istanbul ignore next */ []));
        this.orbitTooltipDelay = input(0, /* @ts-ignore */
        ...(ngDevMode ? [{ debugName: "orbitTooltipDelay" }] : /* istanbul ignore next */ []));
        this.overlay = inject(Overlay);
        this.el = inject(ElementRef);
        this.renderer = inject(Renderer2);
        this.destroy$ = new Subject();
        this.overlayRef = null;
        this.showTimeout = null;
        this.hideTimeout = null;
        this.tooltipId = `orbit-tooltip-${Math.random().toString(36).slice(2, 8)}`;
        this.renderer.listen(this.el.nativeElement, 'mouseenter', () => this.show());
        this.renderer.listen(this.el.nativeElement, 'mouseleave', () => this.scheduleHide());
        this.renderer.listen(this.el.nativeElement, 'focus', () => this.show());
        this.renderer.listen(this.el.nativeElement, 'blur', () => this.scheduleHide());
    }
    show() {
        if (this.hideTimeout) {
            clearTimeout(this.hideTimeout);
            this.hideTimeout = null;
        }
        if (this.overlayRef)
            return;
        const delay = this.orbitTooltipDelay();
        this.showTimeout = setTimeout(() => this.attach(), delay);
    }
    hide() {
        if (this.showTimeout) {
            clearTimeout(this.showTimeout);
            this.showTimeout = null;
        }
        this.detach();
    }
    scheduleHide() {
        this.hideTimeout = setTimeout(() => this.hide(), 100);
    }
    ngOnDestroy() {
        this.hide();
        this.destroy$.next();
        this.destroy$.complete();
    }
    attach() {
        if (this.overlayRef)
            return;
        const positionStrategy = this.overlay
            .position()
            .flexibleConnectedTo(this.el)
            .withPositions([
            {
                originX: 'center',
                originY: this.orbitTooltipPosition() === 'bottom' ? 'bottom' : 'top',
                overlayX: 'center',
                overlayY: this.orbitTooltipPosition() === 'bottom' ? 'top' : 'bottom',
                offsetY: this.orbitTooltipPosition() === 'bottom' ? 8 : -8,
            },
        ]);
        this.overlayRef = this.overlay.create({
            positionStrategy,
            panelClass: 'orbit-tooltip-panel',
            scrollStrategy: this.overlay.scrollStrategies.reposition(),
        });
        const portal = new ComponentPortal(TooltipComponent);
        const ref = this.overlayRef.attach(portal);
        ref.instance.text = this.orbitTooltip();
        ref.instance.id = this.tooltipId;
        ref.changeDetectorRef.detectChanges();
    }
    detach() {
        if (this.overlayRef) {
            this.overlayRef.detach();
            this.overlayRef.dispose();
            this.overlayRef = null;
        }
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "22.0.7", ngImport: i0, type: OrbitTooltipDirective, deps: [], target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "17.1.0", version: "22.0.7", type: OrbitTooltipDirective, isStandalone: true, selector: "[orbitTooltip]", inputs: { orbitTooltip: { classPropertyName: "orbitTooltip", publicName: "orbitTooltip", isSignal: true, isRequired: true, transformFunction: null }, orbitTooltipPosition: { classPropertyName: "orbitTooltipPosition", publicName: "orbitTooltipPosition", isSignal: true, isRequired: false, transformFunction: null }, orbitTooltipDelay: { classPropertyName: "orbitTooltipDelay", publicName: "orbitTooltipDelay", isSignal: true, isRequired: false, transformFunction: null } }, host: { properties: { "attr.aria-describedby": "tooltipId" } }, exportAs: ["orbitTooltip"], ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "22.0.7", ngImport: i0, type: OrbitTooltipDirective, decorators: [{
            type: Directive,
            args: [{
                    selector: '[orbitTooltip]',
                    exportAs: 'orbitTooltip',
                    host: {
                        '[attr.aria-describedby]': 'tooltipId',
                    },
                }]
        }], ctorParameters: () => [], propDecorators: { orbitTooltip: [{ type: i0.Input, args: [{ isSignal: true, alias: "orbitTooltip", required: true }] }], orbitTooltipPosition: [{ type: i0.Input, args: [{ isSignal: true, alias: "orbitTooltipPosition", required: false }] }], orbitTooltipDelay: [{ type: i0.Input, args: [{ isSignal: true, alias: "orbitTooltipDelay", required: false }] }] } });

class OrbitPopoverComponent {
    constructor() {
        this.content = input.required(/* @ts-ignore */
        ...(ngDevMode ? [{ debugName: "content" }] : /* istanbul ignore next */ []));
        this.position = input('bottom', /* @ts-ignore */
        ...(ngDevMode ? [{ debugName: "position" }] : /* istanbul ignore next */ []));
        this.closeOnBackdrop = input(true, { ...(ngDevMode ? { debugName: "closeOnBackdrop" } : /* istanbul ignore next */ {}), transform: booleanAttribute });
        this.closeOnEscape = input(true, { ...(ngDevMode ? { debugName: "closeOnEscape" } : /* istanbul ignore next */ {}), transform: booleanAttribute });
        this.opened = output();
        this.closed = output();
        this.isOpen = signal(false, /* @ts-ignore */
        ...(ngDevMode ? [{ debugName: "isOpen" }] : /* istanbul ignore next */ []));
        this.overlay = inject(Overlay);
        this.el = inject(ElementRef);
        this.renderer = inject(Renderer2);
        this.vcr = inject(ViewContainerRef);
        this.overlayRef = null;
        this.listeners = [];
        this.listeners.push(this.renderer.listen(this.el.nativeElement, 'keydown', (e) => {
            if (e.key === 'Escape' && this.closeOnEscape())
                this.close();
        }));
    }
    toggle() {
        this.isOpen() ? this.close() : this.open();
    }
    open() {
        if (this.isOpen())
            return;
        const positionStrategy = this.overlay
            .position()
            .flexibleConnectedTo(this.el)
            .withPositions([
            {
                originX: 'center',
                originY: this.position() === 'top' ? 'top' : 'bottom',
                overlayX: 'center',
                overlayY: this.position() === 'top' ? 'bottom' : 'top',
                offsetY: this.position() === 'top' ? -8 : 8,
            },
        ]);
        this.overlayRef = this.overlay.create({
            positionStrategy,
            panelClass: 'orbit-popover-panel',
            hasBackdrop: this.closeOnBackdrop(),
            backdropClass: 'orbit-popover-backdrop',
            scrollStrategy: this.overlay.scrollStrategies.reposition(),
        });
        const portal = new ComponentPortal(PopoverContentComponent, this.vcr);
        const ref = this.overlayRef.attach(portal);
        ref.instance.text = this.content();
        ref.changeDetectorRef.detectChanges();
        if (this.closeOnBackdrop()) {
            this.overlayRef.backdropClick().subscribe(() => this.close());
        }
        this.isOpen.set(true);
        this.opened.emit();
    }
    close() {
        if (!this.isOpen())
            return;
        if (this.overlayRef) {
            this.overlayRef.detach();
            this.overlayRef.dispose();
            this.overlayRef = null;
        }
        this.isOpen.set(false);
        this.closed.emit();
    }
    ngOnDestroy() {
        this.close();
        this.listeners.forEach((fn) => fn());
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "22.0.7", ngImport: i0, type: OrbitPopoverComponent, deps: [], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.1.0", version: "22.0.7", type: OrbitPopoverComponent, isStandalone: true, selector: "orbit-popover", inputs: { content: { classPropertyName: "content", publicName: "content", isSignal: true, isRequired: true, transformFunction: null }, position: { classPropertyName: "position", publicName: "position", isSignal: true, isRequired: false, transformFunction: null }, closeOnBackdrop: { classPropertyName: "closeOnBackdrop", publicName: "closeOnBackdrop", isSignal: true, isRequired: false, transformFunction: null }, closeOnEscape: { classPropertyName: "closeOnEscape", publicName: "closeOnEscape", isSignal: true, isRequired: false, transformFunction: null } }, outputs: { opened: "opened", closed: "closed" }, exportAs: ["orbitPopover"], ngImport: i0, template: `
    <span class="orbit-popover__trigger" (click)="toggle()">
      <ng-content></ng-content>
    </span>
  `, isInline: true, styles: [":host{display:inline-block;position:relative}.orbit-popover__trigger{display:inline-flex;cursor:pointer}.orbit-popover-panel{max-width:20rem;padding:var(--orbit-space-3);border:1px solid var(--orbit-color-border);border-radius:var(--orbit-radius-surface);background:var(--orbit-color-surface);box-shadow:var(--orbit-shadow-overlay)}.orbit-popover-backdrop{background:transparent}\n"], changeDetection: i0.ChangeDetectionStrategy.OnPush }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "22.0.7", ngImport: i0, type: OrbitPopoverComponent, decorators: [{
            type: Component,
            args: [{ selector: 'orbit-popover', changeDetection: ChangeDetectionStrategy.OnPush, template: `
    <span class="orbit-popover__trigger" (click)="toggle()">
      <ng-content></ng-content>
    </span>
  `, exportAs: 'orbitPopover', styles: [":host{display:inline-block;position:relative}.orbit-popover__trigger{display:inline-flex;cursor:pointer}.orbit-popover-panel{max-width:20rem;padding:var(--orbit-space-3);border:1px solid var(--orbit-color-border);border-radius:var(--orbit-radius-surface);background:var(--orbit-color-surface);box-shadow:var(--orbit-shadow-overlay)}.orbit-popover-backdrop{background:transparent}\n"] }]
        }], ctorParameters: () => [], propDecorators: { content: [{ type: i0.Input, args: [{ isSignal: true, alias: "content", required: true }] }], position: [{ type: i0.Input, args: [{ isSignal: true, alias: "position", required: false }] }], closeOnBackdrop: [{ type: i0.Input, args: [{ isSignal: true, alias: "closeOnBackdrop", required: false }] }], closeOnEscape: [{ type: i0.Input, args: [{ isSignal: true, alias: "closeOnEscape", required: false }] }], opened: [{ type: i0.Output, args: ["opened"] }], closed: [{ type: i0.Output, args: ["closed"] }] } });
class PopoverContentComponent {
    constructor() {
        this.text = '';
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "22.0.7", ngImport: i0, type: PopoverContentComponent, deps: [], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "22.0.7", type: PopoverContentComponent, isStandalone: true, selector: "orbit-popover-content", ngImport: i0, template: `<div class="orbit-popover__content">{{ text }}</div>`, isInline: true, styles: [".orbit-popover__content{padding:var(--orbit-space-3);max-width:20rem;font-family:var(--orbit-font-sans);font-size:var(--orbit-font-size-sm);color:var(--orbit-color-text);line-height:1.5}\n"], changeDetection: i0.ChangeDetectionStrategy.OnPush }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "22.0.7", ngImport: i0, type: PopoverContentComponent, decorators: [{
            type: Component,
            args: [{ selector: 'orbit-popover-content', changeDetection: ChangeDetectionStrategy.OnPush, template: `<div class="orbit-popover__content">{{ text }}</div>`, styles: [".orbit-popover__content{padding:var(--orbit-space-3);max-width:20rem;font-family:var(--orbit-font-sans);font-size:var(--orbit-font-size-sm);color:var(--orbit-color-text);line-height:1.5}\n"] }]
        }] });

const ORBIT_DIALOG_DATA = new InjectionToken('ORBIT_DIALOG_DATA');
const SIZE_MAP = {
    sm: '400px',
    md: '560px',
    lg: '720px',
    xl: '900px',
    wide: '1100px',
};
class OrbitDialogService {
    constructor() {
        this.overlay = inject(Overlay);
        this.openDialogs = [];
    }
    open(component, config = {}) {
        const size = config.size ?? 'md';
        const panelClasses = ['orbit-dialog-panel', `orbit-dialog--${size}`];
        if (config.panelClass)
            panelClasses.push(config.panelClass);
        const overlayConfig = {
            hasBackdrop: true,
            backdropClass: 'orbit-dialog-backdrop',
            panelClass: panelClasses,
            width: SIZE_MAP[size],
            maxHeight: '90vh',
            positionStrategy: this.overlay.position().global().centerHorizontally().centerVertically(),
            scrollStrategy: this.overlay.scrollStrategies.block(),
        };
        const overlayRef = this.overlay.create(overlayConfig);
        const portal = new ComponentPortal(component);
        const componentRef = overlayRef.attach(portal);
        if (config.data) {
            componentRef.instance.data = config.data;
        }
        this.openDialogs.push(overlayRef);
        if (!config.disableClose) {
            overlayRef.backdropClick().pipe(take(1)).subscribe(() => this.close(overlayRef));
            overlayRef.keydownEvents()
                .pipe(filter((e) => e.keyCode === ESCAPE), take(1))
                .subscribe(() => this.close(overlayRef));
        }
        return {
            close: () => this.close(overlayRef),
            overlayRef,
        };
    }
    closeAll() {
        [...this.openDialogs].forEach((ref) => this.close(ref));
    }
    close(ref) {
        const idx = this.openDialogs.indexOf(ref);
        if (idx > -1)
            this.openDialogs.splice(idx, 1);
        ref.detach();
        ref.dispose();
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "22.0.7", ngImport: i0, type: OrbitDialogService, deps: [], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "22.0.7", ngImport: i0, type: OrbitDialogService, providedIn: 'root' }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "22.0.7", ngImport: i0, type: OrbitDialogService, decorators: [{
            type: Injectable,
            args: [{ providedIn: 'root' }]
        }] });

/**
 * Generated bundle index. Do not edit.
 */

export { ORBIT_DIALOG_DATA, OrbitAttachmentDropzoneComponent, OrbitAutocompleteComponent, OrbitBadgeComponent, OrbitButtonComponent, OrbitCheckboxComponent, OrbitDatePickerComponent, OrbitDialogService, OrbitDividerComponent, OrbitFormActionBarComponent, OrbitFormFieldComponent, OrbitFormGridComponent, OrbitFormGridItemDirective, OrbitFormSectionComponent, OrbitIconButtonComponent, OrbitModalBodyComponent, OrbitModalFooterComponent, OrbitModalHeaderComponent, OrbitPillSwitchComponent, OrbitPopoverComponent, OrbitSelectComponent, OrbitSelectableTileComponent, OrbitTextInputComponent, OrbitTimePickerComponent, OrbitTooltipDirective, TooltipComponent };
//# sourceMappingURL=galileo-orbit.mjs.map
