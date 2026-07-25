import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OrbitAttachmentListItemComponent } from './attachment-list-item.component';

describe('OrbitAttachmentListItemComponent', () => {
  let fixture: ComponentFixture<OrbitAttachmentListItemComponent>;
  let component: OrbitAttachmentListItemComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrbitAttachmentListItemComponent],
    }).compileComponents();
    fixture = TestBed.createComponent(OrbitAttachmentListItemComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('name', 'elemento.txt');
    fixture.detectChanges();
  });

  it('renders the name and optional metadata', () => {
    fixture.componentRef.setInput('metadata', '24 KB');
    fixture.detectChanges();

    expect(
      fixture.nativeElement.querySelector('.orbit-attachment-list-item__name').textContent.trim(),
    ).toBe('elemento.txt');
    expect(
      fixture.nativeElement
        .querySelector('.orbit-attachment-list-item__metadata')
        .textContent.trim(),
    ).toBe('24 KB');
  });

  it('does not render a status without a label', () => {
    expect(fixture.nativeElement.querySelector('.orbit-attachment-list-item__status')).toBeNull();
  });

  it('marks the host as readonly', () => {
    fixture.componentRef.setInput('status', 'readonly');
    fixture.componentRef.setInput('statusLabel', 'Sola lettura');
    fixture.detectChanges();

    expect(fixture.nativeElement.classList.contains('orbit-attachment-list-item--readonly')).toBe(
      true,
    );
  });

  it('emits the selected action', () => {
    const action = { id: 'remove', label: 'Rimuovi' };
    let emitted: typeof action | undefined;
    component.actionTriggered.subscribe((value) => (emitted = value));
    fixture.componentRef.setInput('actions', [action]);
    fixture.detectChanges();

    fixture.nativeElement.querySelector('button').click();

    expect(emitted).toEqual(action);
  });

  it('does not emit a disabled action', () => {
    const action = { id: 'remove', label: 'Rimuovi', disabled: true };
    let emitted = false;
    component.actionTriggered.subscribe(() => (emitted = true));
    fixture.componentRef.setInput('actions', [action]);
    fixture.detectChanges();

    fixture.nativeElement.querySelector('button').click();

    expect(emitted).toBe(false);
  });
});
