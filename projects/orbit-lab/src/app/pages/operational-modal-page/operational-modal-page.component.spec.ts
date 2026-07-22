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

  it('renders the catalog portfolio example', () => {
    expect(fixture.nativeElement.querySelector('h1')?.textContent).toContain('Examples');
    expect(fixture.nativeElement.textContent).toContain('Catalogo Prodotti & Listini');
    expect(fixture.nativeElement.textContent).toContain('PRD-8012-X');
  });
});
