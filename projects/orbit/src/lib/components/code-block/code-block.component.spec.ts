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
    expect(fixture.nativeElement.querySelector('.orbit-code-block__surface').hidden).toBe(true);
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
    expect(fixture.nativeElement.querySelector('.orbit-code-block__surface').hidden).toBe(false);
  });

  it('is always expanded and has no toggle when collapsible is false', () => {
    fixture.componentRef.setInput('collapsible', false);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('[data-toggle-code]')).toBeNull();
    expect(fixture.nativeElement.querySelector('.orbit-code-block__surface').hidden).toBe(false);
  });

  it('can hide its built-in actions when a composite owns them', () => {
    fixture.componentRef.setInput('showActions', false);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.orbit-code-block__actions')).toBeNull();
  });

  it('starts expanded when initiallyCollapsed is false', () => {
    fixture.componentRef.setInput('initiallyCollapsed', false);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.orbit-code-block__surface').hidden).toBe(false);
  });

  it('renders a numbered gutter for every source line', () => {
    fixture.componentRef.setInput('code', 'prima riga\nseconda riga');
    fixture.detectChanges();

    const lines = fixture.nativeElement.querySelectorAll('.orbit-code-block__line');
    const lineNumbers = fixture.nativeElement.querySelectorAll('.orbit-code-block__line-number');
    expect(lines.length).toBe(2);
    expect(lineNumbers[0].textContent.trim()).toBe('1');
    expect(lineNumbers[1].textContent.trim()).toBe('2');
  });

  it('copies the code via OrbitClipboardService when the copy button is clicked', async () => {
    fixture.detectChanges();
    const copyButton = fixture.nativeElement.querySelector('[data-copy-code] button') as HTMLButtonElement;
    expect(copyButton.getAttribute('aria-label')).toBe('Copia codice');
    copyButton.click();
    await fixture.whenStable();
    expect(copyText).toHaveBeenCalledWith('<orbit-button label="Salva" />');
  });

  describe('selection containment', () => {
    let outside: HTMLParagraphElement;

    beforeEach(() => {
      fixture.componentRef.setInput('code', 'prima riga\nseconda riga');
      fixture.detectChanges();
      outside = document.createElement('p');
      outside.textContent = 'testo fuori dal codeblock';
      document.body.appendChild(fixture.nativeElement);
      fixture.nativeElement.after(outside);
    });

    afterEach(() => {
      outside.remove();
      fixture.nativeElement.remove();
    });

    function selectFromPreIntoOutside(): void {
      const pre = fixture.nativeElement.querySelector('[data-code-block]') as HTMLElement;
      const firstLine = pre.querySelector('.orbit-code-block__line-content') as HTMLElement;
      const range = document.createRange();
      range.setStart(firstLine.firstChild as Node, 0);
      range.setEnd(outside.firstChild as Node, outside.textContent!.length);
      const selection = document.getSelection()!;
      selection.removeAllRanges();
      selection.addRange(range);
    }

    it('clamps a selection that started inside the code block but was dragged past it', async () => {
      const pre = fixture.nativeElement.querySelector('[data-code-block]') as HTMLElement;
      const firstLine = pre.querySelector('.orbit-code-block__line-content') as HTMLElement;
      firstLine.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));

      selectFromPreIntoOutside();
      document.dispatchEvent(new Event('selectionchange'));
      await fixture.whenStable();

      const selection = document.getSelection()!;
      expect(selection.toString()).not.toContain('testo fuori dal codeblock');
      expect(pre.contains(selection.getRangeAt(0).endContainer)).toBe(true);
    });

    it('leaves a selection untouched when the drag did not start inside the code block', async () => {
      outside.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));

      selectFromPreIntoOutside();
      document.dispatchEvent(new Event('selectionchange'));
      await fixture.whenStable();

      const selection = document.getSelection()!;
      expect(selection.toString()).toContain('testo fuori dal codeblock');
    });
  });
});
