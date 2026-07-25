import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OrbitChipComponent } from './chip.component';

describe('OrbitChipComponent', () => {
  let fixture: ComponentFixture<OrbitChipComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrbitChipComponent],
    }).compileComponents();
    fixture = TestBed.createComponent(OrbitChipComponent);
    fixture.detectChanges();
  });

  it('creates', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('emits selectedChange(true) when clicked while unselected', () => {
    let emitted: boolean | undefined;
    fixture.componentInstance.selectedChange.subscribe((v) => (emitted = v));
    fixture.nativeElement.querySelector('.orbit-chip__body').click();
    expect(emitted).toBe(true);
  });

  it('emits selectedChange(false) when clicked while selected', () => {
    fixture.componentRef.setInput('selected', true);
    fixture.detectChanges();
    let emitted: boolean | undefined;
    fixture.componentInstance.selectedChange.subscribe((v) => (emitted = v));
    fixture.nativeElement.querySelector('.orbit-chip__body').click();
    expect(emitted).toBe(false);
  });

  it('does not render a remove button when removable is false', () => {
    expect(fixture.nativeElement.querySelector('.orbit-chip__remove')).toBeNull();
  });

  it('emits removed without toggling selected when the remove button is clicked', () => {
    fixture.componentRef.setInput('removable', true);
    fixture.detectChanges();
    let removedCalled = false;
    let selectedChangeCalled = false;
    fixture.componentInstance.removed.subscribe(() => (removedCalled = true));
    fixture.componentInstance.selectedChange.subscribe(() => (selectedChangeCalled = true));
    fixture.nativeElement.querySelector('.orbit-chip__remove').click();
    expect(removedCalled).toBe(true);
    expect(selectedChangeCalled).toBe(false);
  });

  it('does not emit selectedChange or removed when disabled', () => {
    fixture.componentRef.setInput('disabled', true);
    fixture.componentRef.setInput('removable', true);
    fixture.detectChanges();
    let anyEmitted = false;
    fixture.componentInstance.selectedChange.subscribe(() => (anyEmitted = true));
    fixture.componentInstance.removed.subscribe(() => (anyEmitted = true));
    fixture.nativeElement.querySelector('.orbit-chip__body').click();
    fixture.nativeElement.querySelector('.orbit-chip__remove').click();
    expect(anyEmitted).toBe(false);
  });

  it('disables both internal buttons when disabled', () => {
    fixture.componentRef.setInput('disabled', true);
    fixture.componentRef.setInput('removable', true);
    fixture.detectChanges();
    const body = fixture.nativeElement.querySelector('.orbit-chip__body') as HTMLButtonElement;
    const remove = fixture.nativeElement.querySelector('.orbit-chip__remove') as HTMLButtonElement;
    expect(body.disabled).toBe(true);
    expect(remove.disabled).toBe(true);
  });

  it('reflects selected as aria-pressed on the body button', () => {
    fixture.componentRef.setInput('selected', true);
    fixture.detectChanges();
    const body = fixture.nativeElement.querySelector('.orbit-chip__body') as HTMLButtonElement;
    expect(body.getAttribute('aria-pressed')).toBe('true');
  });
});
