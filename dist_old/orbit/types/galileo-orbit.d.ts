import * as _angular_core from '@angular/core';

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

export { OrbitButtonComponent };
export type { OrbitButtonTone, OrbitButtonVariant };
//# sourceMappingURL=galileo-orbit.d.ts.map
