import { ComponentFixture, TestBed } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';
import { TabPageComponent } from './tab-page.component';

describe('TabPageComponent', () => {
  let fixture: ComponentFixture<TabPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [TabPageComponent] }).compileComponents();
    fixture = TestBed.createComponent(TabPageComponent);
    fixture.detectChanges();
  });

  it('does not show a blocked banner (token drift resolved by Core)', () => {
    expect(fixture.nativeElement.querySelector('[data-blocked-banner]')).toBeNull();
  });

  it('renders three real orbit-tab elements including one disabled in the base example', () => {
    const firstSection = fixture.nativeElement.querySelector('section');
    const tabs = firstSection.querySelectorAll('orbit-tab');
    expect(tabs.length).toBe(3);
    expect(tabs[2].getAttribute('aria-disabled')).toBe('true');
  });

  it('switches panel content when a tab is clicked', () => {
    expect(fixture.nativeElement.textContent).toContain('Contenuto generale.');

    const docsTab = Array.from(fixture.nativeElement.querySelectorAll('[role="tab"]')).find((el) =>
      (el as HTMLElement).textContent?.includes('Documenti'),
    ) as HTMLElement;
    docsTab.click();
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Elenco documenti.');
    expect(fixture.nativeElement.textContent).not.toContain('Contenuto generale.');
  });

  it('renders the badge on the Documenti tab', () => {
    const docsTab = Array.from(fixture.nativeElement.querySelectorAll('[role="tab"]')).find((el) =>
      (el as HTMLElement).textContent?.includes('Documenti'),
    ) as HTMLElement;
    expect(docsTab.querySelector('orbit-badge')).toBeTruthy();
  });

  it('documents scroll, modal and offcanvas variants', () => {
    const sections = fixture.nativeElement.querySelectorAll('section');
    expect(sections.length).toBe(4);

    expect(sections[1].querySelector('h2')?.textContent).toContain('Overflow');
    expect(sections[1].querySelectorAll('orbit-tab').length).toBe(8);

    expect(sections[2].querySelector('h2')?.textContent).toContain('Picker modale');
    expect(sections[2].querySelector('orbit-tablist')).toBeTruthy();

    expect(sections[3].querySelector('h2')?.textContent).toContain('Picker offcanvas');
    expect(sections[3].querySelector('orbit-tablist')).toBeTruthy();
  });
});
