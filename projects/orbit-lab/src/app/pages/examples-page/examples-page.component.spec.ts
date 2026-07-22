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
    const landingTab = Array.from(fixture.nativeElement.querySelectorAll('orbit-tab button')).find(
      (button) => button.textContent?.includes('Landing partner'),
    ) as HTMLButtonElement;
    landingTab.click();
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('.examples__landing orbit-navbar')).toBeTruthy();
    expect(fixture.nativeElement.textContent).toContain('Luce affidabile per ogni spazio che conta.');
    expect(fixture.nativeElement.querySelectorAll('.examples__landing-features orbit-panel').length).toBe(3);
  });
});
