import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OperationalModalPageComponent } from './operational-modal-page.component';

describe('OperationalModalPageComponent', () => {
  let fixture: ComponentFixture<OperationalModalPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OperationalModalPageComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(OperationalModalPageComponent);
    fixture.detectChanges();
  });

  it('renders the Examples page with three selectable mock designs', () => {
    const cards = fixture.nativeElement.querySelectorAll(
      '.examples__card',
    ) as NodeListOf<HTMLButtonElement>;

    expect(fixture.nativeElement.querySelector('h1')?.textContent).toContain('Examples');
    expect(cards).toHaveLength(3);
    expect(cards[0].getAttribute('aria-pressed')).toBe('true');
    expect(fixture.nativeElement.textContent).toContain('Crea configurazione');
    expect(fixture.nativeElement.textContent).toContain('Categoria');
  });

  it('shows the selected service-selection mock', () => {
    const cards = fixture.nativeElement.querySelectorAll(
      '.examples__card',
    ) as NodeListOf<HTMLButtonElement>;

    cards[1].click();
    fixture.detectChanges();

    expect(cards[1].getAttribute('aria-pressed')).toBe('true');
    expect(fixture.nativeElement.textContent).toContain('Seleziona il servizio');
    expect(fixture.nativeElement.textContent).toContain('Servizio prioritario');
  });
});
