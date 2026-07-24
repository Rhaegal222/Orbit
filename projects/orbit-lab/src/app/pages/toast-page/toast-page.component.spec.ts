import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OverlayContainer } from '@angular/cdk/overlay';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { ToastPageComponent } from './toast-page.component';

describe('ToastPageComponent', () => {
  let fixture: ComponentFixture<ToastPageComponent>;
  let overlayContainer: OverlayContainer;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ToastPageComponent],
    }).compileComponents();
    fixture = TestBed.createComponent(ToastPageComponent);
    fixture.detectChanges();
    overlayContainer = TestBed.inject(OverlayContainer);
  });

  afterEach(() => {
    overlayContainer.ngOnDestroy();
  });

  it('creates', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('shows a success toast when the success example button is clicked', () => {
    (
      fixture.nativeElement.querySelector('[data-example="success"] button') as HTMLButtonElement
    ).click();

    expect(overlayContainer.getContainerElement().textContent).toContain(
      'Modifiche salvate con successo',
    );
  });

  it('shows a danger toast when the danger example button is clicked', () => {
    (
      fixture.nativeElement.querySelector('[data-example="danger"] button') as HTMLButtonElement
    ).click();

    expect(overlayContainer.getContainerElement().textContent).toContain(
      "Impossibile completare l'operazione",
    );
  });

  it('renders a copyable usage snippet', () => {
    const showCode = [
      ...fixture.nativeElement.querySelectorAll('.lab-example__actions button'),
    ].find((button) => button.textContent?.includes('Mostra codice')) as HTMLButtonElement;
    showCode.click();
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('[data-code-block]').textContent).toContain(
      'OrbitToastService',
    );
  });
});
