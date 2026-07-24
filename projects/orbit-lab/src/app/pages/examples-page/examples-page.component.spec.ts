import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ExamplesPageComponent } from './examples-page.component';

describe('ExamplesPageComponent', () => {
  let fixture: ComponentFixture<ExamplesPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExamplesPageComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ExamplesPageComponent);
    fixture.detectChanges();
  });

  it('renders the catalog portfolio example', () => {
    expect(fixture.nativeElement.querySelector('h1')?.textContent).toContain('Examples');
    expect(fixture.nativeElement.textContent).toContain('Catalogo Prodotti & Listini');
    expect(fixture.nativeElement.textContent).toContain('PRD-8012-X');
  });

  it('renders the complete landing-page mock when selected', () => {
    const landingTab = fixture.nativeElement.querySelector('#orbit-tab-landing') as HTMLElement;
    landingTab.click();
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('.examples__landing orbit-navbar')).toBeTruthy();
    expect(fixture.nativeElement.textContent).toContain(
      'Luce affidabile per ogni spazio che conta.',
    );
    expect(
      fixture.nativeElement.querySelectorAll('.examples__landing-features orbit-panel').length,
    ).toBe(3);
  });

  it('switches the example through the mobile switcher, keeping it in sync with the tablist', () => {
    const switcherHost = fixture.nativeElement.querySelector('lab-example-switcher');
    expect(switcherHost.textContent).toContain('Portafoglio catalogo');

    fixture.componentInstance.selectExample('quick-action');
    fixture.detectChanges();

    expect(
      fixture.nativeElement.querySelector('#orbit-tab-quick-action')?.getAttribute('aria-selected'),
    ).toBe('true');
    expect(switcherHost.textContent).toContain('Azione rapida');
  });
});
