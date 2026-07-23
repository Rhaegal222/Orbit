import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OrbitAttachmentListActionEvent, OrbitAttachmentListComponent } from './attachment-list.component';

describe('OrbitAttachmentListComponent', () => {
  let fixture: ComponentFixture<OrbitAttachmentListComponent>;
  let component: OrbitAttachmentListComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [OrbitAttachmentListComponent] }).compileComponents();
    fixture = TestBed.createComponent(OrbitAttachmentListComponent);
    component = fixture.componentInstance;
  });

  it('renders entries as a semantic list', () => {
    fixture.componentRef.setInput('entries', [{ id: 'one', name: 'elemento.txt', metadata: '24 KB' }]);
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('ul').getAttribute('aria-label')).toBe('Elenco allegati');
    expect(fixture.nativeElement.querySelectorAll('li').length).toBe(1);
  });

  it('shows the optional empty state', () => {
    fixture.componentRef.setInput('emptyLabel', 'Nessun elemento');
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('[role="status"]').textContent.trim()).toBe('Nessun elemento');
  });

  it('forwards actions with their source entry', () => {
    const entry = { id: 'one', name: 'elemento.txt', actions: [{ id: 'remove', label: 'Rimuovi' }] };
    let emitted: OrbitAttachmentListActionEvent | undefined;
    component.actionTriggered.subscribe((value) => (emitted = value));
    fixture.componentRef.setInput('entries', [entry]);
    fixture.detectChanges();

    fixture.nativeElement.querySelector('button').click();

    expect(emitted).toEqual({ entry, action: entry.actions[0] });
  });
});
