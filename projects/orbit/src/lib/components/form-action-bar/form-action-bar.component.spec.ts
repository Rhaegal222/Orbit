import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OrbitFormActionBarComponent } from './form-action-bar.component';

describe('OrbitFormActionBarComponent', () => {
  let fixture: ComponentFixture<OrbitFormActionBarComponent>;
  let component: OrbitFormActionBarComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrbitFormActionBarComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(OrbitFormActionBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('creates', () => {
    expect(component).toBeTruthy();
  });

  it('renders default labels', () => {
    const el = fixture.nativeElement;
    expect(el.textContent).toContain('SALVA E CONTINUA');
    expect(el.textContent).toContain('SALVA BOZZA');
    expect(el.textContent).toContain('ANNULLA');
  });

  it('emits cancel', () => {
    let emitted = false;
    component.cancel.subscribe(() => (emitted = true));
    fixture.nativeElement.querySelector('.orbit-form-action-bar__btn--cancel button').click();
    expect(emitted).toBe(true);
  });

  it('emits saveDraft', () => {
    let emitted = false;
    component.saveDraft.subscribe(() => (emitted = true));
    fixture.nativeElement.querySelector('.orbit-form-action-bar__btn--draft button').click();
    expect(emitted).toBe(true);
  });

  it('emits confirm', () => {
    let emitted = false;
    component.confirm.subscribe(() => (emitted = true));
    fixture.nativeElement.querySelector('.orbit-form-action-bar__btn--confirm button').click();
    expect(emitted).toBe(true);
  });

  it('hides cancel when showCancel is false', () => {
    fixture.componentRef.setInput('showCancel', false);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.orbit-form-action-bar__btn--cancel')).toBeNull();
  });

  it('hides draft when showDraft is false', () => {
    fixture.componentRef.setInput('showDraft', false);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.orbit-form-action-bar__btn--draft')).toBeNull();
  });

  it('disables confirm when confirmDisabled', () => {
    fixture.componentRef.setInput('confirmDisabled', true);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.orbit-form-action-bar__btn--confirm button').disabled).toBe(true);
  });

  it('disables all buttons when loading', () => {
    fixture.componentRef.setInput('loading', true);
    fixture.detectChanges();
    const buttons = fixture.nativeElement.querySelectorAll('button');
    buttons.forEach((btn: HTMLButtonElement) => expect(btn.disabled).toBe(true));
  });

  it('uses the shared button hierarchy', () => {
    const buttons = fixture.nativeElement.querySelectorAll('orbit-button');
    expect(buttons.length).toBe(3);
    expect(buttons[0].querySelector('button').classList.contains('orbit-btn--outline')).toBe(true);
    expect(buttons[1].querySelector('button').classList.contains('orbit-btn--soft')).toBe(true);
    expect(buttons[2].querySelector('button').classList.contains('orbit-btn--solid')).toBe(true);
  });

  it('supports a success confirm action', () => {
    fixture.componentRef.setInput('confirmTone', 'success');
    fixture.detectChanges();
    expect(
      fixture.nativeElement
        .querySelector('.orbit-form-action-bar__btn--confirm button')
        .classList.contains('orbit-btn--success'),
    ).toBe(true);
  });
});
