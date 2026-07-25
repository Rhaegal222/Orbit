import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OrbitAccordionComponent } from './accordion.component';
import { OrbitAccordionItemComponent } from './accordion-item.component';

@Component({
  selector: 'orbit-accordion-test-host',
  standalone: true,
  imports: [OrbitAccordionComponent, OrbitAccordionItemComponent],
  template: `
    <orbit-accordion [multi]="multi">
      <orbit-accordion-item
        header="Uno"
        [expanded]="expandedA"
        (expandedChange)="expandedA = $event"
      >
        Contenuto uno
      </orbit-accordion-item>
      <orbit-accordion-item
        header="Due"
        [expanded]="expandedB"
        (expandedChange)="expandedB = $event"
      >
        Contenuto due
      </orbit-accordion-item>
      <orbit-accordion-item
        header="Tre"
        disabled
        [expanded]="expandedC"
        (expandedChange)="expandedC = $event"
      >
        Contenuto tre
      </orbit-accordion-item>
    </orbit-accordion>
  `,
})
class AccordionTestHostComponent {
  multi = false;
  expandedA = false;
  expandedB = false;
  expandedC = false;
}

describe('OrbitAccordionComponent', () => {
  let fixture: ComponentFixture<AccordionTestHostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AccordionTestHostComponent],
    }).compileComponents();
    fixture = TestBed.createComponent(AccordionTestHostComponent);
    fixture.detectChanges();
  });

  function headers(): HTMLButtonElement[] {
    return Array.from(fixture.nativeElement.querySelectorAll('.orbit-accordion-item__header'));
  }

  it('creates', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('closes the previously open item when multi is false and another item opens', () => {
    headers()[0].click();
    fixture.detectChanges();
    expect(fixture.componentInstance.expandedA).toBe(true);
    expect(fixture.componentInstance.expandedB).toBe(false);

    headers()[1].click();
    fixture.detectChanges();
    expect(fixture.componentInstance.expandedA).toBe(false);
    expect(fixture.componentInstance.expandedB).toBe(true);
  });

  it('allows every item to stay open independently when multi is true', () => {
    fixture.componentInstance.multi = true;
    fixture.detectChanges();

    headers()[0].click();
    fixture.detectChanges();
    headers()[1].click();
    fixture.detectChanges();

    expect(fixture.componentInstance.expandedA).toBe(true);
    expect(fixture.componentInstance.expandedB).toBe(true);
  });

  it('does not open a disabled item', () => {
    headers()[2].click();
    fixture.detectChanges();
    expect(fixture.componentInstance.expandedC).toBe(false);
  });
});
