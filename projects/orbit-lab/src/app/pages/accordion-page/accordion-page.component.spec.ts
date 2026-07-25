import { ComponentFixture, TestBed } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';
import { AccordionPageComponent } from './accordion-page.component';

describe('AccordionPageComponent', () => {
  let fixture: ComponentFixture<AccordionPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AccordionPageComponent],
    }).compileComponents();
    fixture = TestBed.createComponent(AccordionPageComponent);
    fixture.detectChanges();
  });

  it('creates', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('closes the previously open panel in the single-open example', () => {
    const headers = fixture.nativeElement.querySelectorAll(
      '[data-example="single"] .orbit-accordion-item__header',
    );
    headers[0].click();
    fixture.detectChanges();
    headers[1].click();
    fixture.detectChanges();
    expect(fixture.componentInstance.singleExpandedFirst).toBe(false);
    expect(fixture.componentInstance.singleExpandedSecond).toBe(true);
  });

  it('keeps every panel open independently in the multi example', () => {
    const headers = fixture.nativeElement.querySelectorAll(
      '[data-example="multi"] .orbit-accordion-item__header',
    );
    headers[0].click();
    fixture.detectChanges();
    headers[1].click();
    fixture.detectChanges();
    expect(fixture.componentInstance.multiExpandedFirst).toBe(true);
    expect(fixture.componentInstance.multiExpandedSecond).toBe(true);
  });

  it('renders a copyable usage snippet', () => {
    const showCode = [
      ...fixture.nativeElement.querySelectorAll('.lab-example__actions button'),
    ].find((button) => button.textContent?.includes('Mostra codice')) as HTMLButtonElement;
    showCode.click();
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('[data-code-block]').textContent).toContain(
      '<orbit-accordion',
    );
  });
});
