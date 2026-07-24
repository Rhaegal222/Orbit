import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OrbitAccordionItemComponent } from './accordion-item.component';

describe('OrbitAccordionItemComponent', () => {
  let fixture: ComponentFixture<OrbitAccordionItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrbitAccordionItemComponent],
    }).compileComponents();
    fixture = TestBed.createComponent(OrbitAccordionItemComponent);
    fixture.componentRef.setInput('header', 'Sezione 1');
    fixture.detectChanges();
  });

  it('creates', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('renders the header text', () => {
    expect(
      fixture.nativeElement.querySelector('.orbit-accordion-item__header-label').textContent.trim(),
    ).toBe('Sezione 1');
  });

  it('emits expandedChange(true) when the collapsed header is clicked', () => {
    let emitted: boolean | undefined;
    fixture.componentInstance.expandedChange.subscribe((v) => (emitted = v));
    fixture.nativeElement.querySelector('.orbit-accordion-item__header').click();
    expect(emitted).toBe(true);
  });

  it('emits expandedChange(false) when the expanded header is clicked', () => {
    fixture.componentRef.setInput('expanded', true);
    fixture.detectChanges();
    let emitted: boolean | undefined;
    fixture.componentInstance.expandedChange.subscribe((v) => (emitted = v));
    fixture.nativeElement.querySelector('.orbit-accordion-item__header').click();
    expect(emitted).toBe(false);
  });

  it('does not emit expandedChange when disabled', () => {
    fixture.componentRef.setInput('disabled', true);
    fixture.detectChanges();
    let emitted = false;
    fixture.componentInstance.expandedChange.subscribe(() => (emitted = true));
    fixture.nativeElement.querySelector('.orbit-accordion-item__header').click();
    expect(emitted).toBe(false);
  });

  it('sets aria-expanded to match the expanded input', () => {
    fixture.componentRef.setInput('expanded', true);
    fixture.detectChanges();
    const header = fixture.nativeElement.querySelector(
      '.orbit-accordion-item__header',
    ) as HTMLButtonElement;
    expect(header.getAttribute('aria-expanded')).toBe('true');
  });

  it('collapse() emits expandedChange(false) only when currently expanded', () => {
    let calls = 0;
    fixture.componentInstance.expandedChange.subscribe(() => calls++);
    fixture.componentInstance.collapse();
    expect(calls).toBe(0);

    fixture.componentRef.setInput('expanded', true);
    fixture.detectChanges();
    fixture.componentInstance.collapse();
    expect(calls).toBe(1);
  });
});
