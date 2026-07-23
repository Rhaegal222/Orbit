import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OrbitIconButtonComponent } from './icon-button.component';

describe('OrbitIconButtonComponent', () => {
  let fixture: ComponentFixture<OrbitIconButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrbitIconButtonComponent],
    }).compileComponents();
    fixture = TestBed.createComponent(OrbitIconButtonComponent);
    fixture.componentRef.setInput('ariaLabel', 'Apri menu');
    fixture.detectChanges();
  });

  it('renders an accessible native button', () => {
    const button = fixture.nativeElement.querySelector('button') as HTMLButtonElement;
    expect(button.type).toBe('button');
    expect(button.getAttribute('aria-label')).toBe('Apri menu');
  });

  it('emits only while enabled', () => {
    let calls = 0;
    fixture.componentInstance.clicked.subscribe(() => calls++);
    fixture.nativeElement.querySelector('button').click();
    fixture.componentRef.setInput('disabled', true);
    fixture.detectChanges();
    fixture.nativeElement.querySelector('button').click();
    expect(calls).toBe(1);
  });

  it('uses the shared decorative icon registry when an icon name is supplied', () => {
    fixture.componentRef.setInput('icon', 'close');
    fixture.detectChanges();

    const icon = fixture.nativeElement.querySelector('orbit-icon svg');
    expect(icon).toBeTruthy();
    expect(icon.getAttribute('aria-hidden')).toBe('true');
  });
});
