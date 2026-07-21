import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OrbitCodeBlockComponent } from './code-block.component';
import { OrbitClipboardService } from '../../services/clipboard';

describe('OrbitCodeBlockComponent', () => {
  let fixture: ComponentFixture<OrbitCodeBlockComponent>;
  let copyText: ReturnType<typeof vi.fn>;

  beforeEach(async () => {
    copyText = vi.fn().mockResolvedValue(true);
    await TestBed.configureTestingModule({
      imports: [OrbitCodeBlockComponent],
      providers: [{ provide: OrbitClipboardService, useValue: { copyText } }],
    }).compileComponents();
    fixture = TestBed.createComponent(OrbitCodeBlockComponent);
    fixture.componentRef.setInput('code', '<orbit-button label="Salva" />');
  });

  it('creates', () => {
    fixture.detectChanges();
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('is collapsed by default when collapsible', () => {
    fixture.detectChanges();
    const pre = fixture.nativeElement.querySelector('[data-code-block]');
    expect(pre.hidden).toBe(true);
    expect(fixture.nativeElement.querySelector('[data-toggle-code]').getAttribute('aria-expanded')).toBe(
      'false',
    );
  });

  it('expands and flips aria-expanded when the toggle is clicked', () => {
    fixture.detectChanges();
    const toggle = fixture.nativeElement.querySelector('[data-toggle-code]');
    toggle.click();
    fixture.detectChanges();
    expect(toggle.getAttribute('aria-expanded')).toBe('true');
    expect(fixture.nativeElement.querySelector('[data-code-block]').hidden).toBe(false);
  });

  it('is always expanded and has no toggle when collapsible is false', () => {
    fixture.componentRef.setInput('collapsible', false);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('[data-toggle-code]')).toBeNull();
    expect(fixture.nativeElement.querySelector('[data-code-block]').hidden).toBe(false);
  });

  it('starts expanded when initiallyCollapsed is false', () => {
    fixture.componentRef.setInput('initiallyCollapsed', false);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('[data-code-block]').hidden).toBe(false);
  });

  it('copies the code via OrbitClipboardService when the copy button is clicked', async () => {
    fixture.detectChanges();
    fixture.nativeElement.querySelector('[data-copy-code]').click();
    await fixture.whenStable();
    expect(copyText).toHaveBeenCalledWith('<orbit-button label="Salva" />');
  });
});
