import {
  afterNextRender,
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  ElementRef,
  inject,
  input,
  linkedSignal,
  signal,
  viewChild,
} from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { OrbitClipboardService } from '../../services/clipboard';
import { OrbitIconButtonComponent } from '../icon-button/icon-button.component';
import { OrbitIconComponent } from '../../icons/icon.component';
import * as Prism from 'prismjs';

let codeBlockSequence = 0;

const TOKEN_CLOSE_RE = /(<\/span>)/g;
const TOKEN_OPEN_RE = /(<span class="token [^"]*">)/g;

function splitHighlightedLines(html: string): string[] {
  const raw = html.split('\n');
  const result: string[] = [];
  const openStack: string[] = [];

  for (const segment of raw) {
    let line = '';
    let cursor = 0;
    const combined = openStack.join('') + segment;

    TOKEN_CLOSE_RE.lastIndex = 0;
    const closeMatches = [...combined.matchAll(TOKEN_CLOSE_RE)];
    TOKEN_OPEN_RE.lastIndex = 0;
    const openMatches = [...combined.matchAll(TOKEN_OPEN_RE)];

    const events: { index: number; type: 'open' | 'close'; text: string }[] = [
      ...closeMatches.map((m) => ({ index: m.index, type: 'close' as const, text: m[0] })),
      ...openMatches.map((m) => ({ index: m.index, type: 'open' as const, text: m[0] })),
    ].sort((a, b) => a.index - b.index || (a.type === 'close' ? -1 : 1));

    let pos = 0;
    for (const ev of events) {
      if (ev.index > pos) {
        line += combined.slice(pos, ev.index);
      }
      if (ev.type === 'open') {
        openStack.push(ev.text);
        line += ev.text;
      } else {
        line += ev.text;
        openStack.pop();
      }
      pos = ev.index + ev.text.length;
    }
    if (pos < combined.length) {
      line += combined.slice(pos);
    }

    for (let i = openStack.length - 1; i >= 0; i--) {
      line += '</span>';
    }

    result.push(line);
  }

  return result;
}

@Component({
  selector: 'orbit-code-block',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [OrbitIconButtonComponent, OrbitIconComponent],
  templateUrl: './code-block.component.html',
  styleUrl: './code-block.component.css',
})
export class OrbitCodeBlockComponent {
  code = input.required<string>();
  language = input('text');
  highlightLines = input<number[]>([]);
  showLanguageLabel = input(true, { transform: booleanAttribute });
  collapsible = input(true, { transform: booleanAttribute });
  initiallyCollapsed = input(true, { transform: booleanAttribute });
  showActions = input(true, { transform: booleanAttribute });

  private readonly clipboard = inject(OrbitClipboardService);
  private readonly document = inject(DOCUMENT);
  private readonly destroyRef = inject(DestroyRef);
  private readonly codeSurface = viewChild<ElementRef<HTMLElement>>('codeSurface');
  private dragStartedInsideSurface = false;

  protected readonly collapsed = linkedSignal(
    () => this.collapsible() && this.initiallyCollapsed(),
  );
  protected readonly copyLabel = signal('Copia');
  protected readonly showCopiedFeedback = signal(false);
  protected readonly panelId = `orbit-code-block-${++codeBlockSequence}`;
  protected readonly lines = computed(() => this.code().split('\n'));
  protected readonly highlightedLines = computed(() => {
    const lang = this.language();
    if (lang === 'text') {
      return null;
    }
    const grammar = Prism.languages[lang];
    if (!grammar) {
      return null;
    }
    const highlighted = Prism.highlight(this.code(), grammar, lang);
    return splitHighlightedLines(highlighted);
  });
  protected readonly hasSyntaxHighlighting = computed(() => this.highlightedLines() !== null);
  protected readonly languageLabel = computed(() => {
    const lang = this.language();
    const langMap: Record<string, string> = {
      ts: 'TypeScript',
      typescript: 'TypeScript',
      js: 'JavaScript',
      javascript: 'JavaScript',
      html: 'HTML',
      css: 'CSS',
      json: 'JSON',
      bash: 'Bash',
      shell: 'Shell',
      sql: 'SQL',
      py: 'Python',
      python: 'Python',
      ng: 'Angular',
      angular: 'Angular',
      text: 'Plain Text',
    };
    return langMap[lang] || lang.toUpperCase();
  });

  constructor() {
    afterNextRender(() => this.setupSelectionContainment());
  }

  toggle(): void {
    this.collapsed.update((collapsed) => !collapsed);
  }

  async copy(): Promise<void> {
    const copied = await this.clipboard.copyText(this.code());
    this.copyLabel.set(copied ? 'Copiato' : 'Copia non riuscita');
    this.showCopiedFeedback.set(copied);
    setTimeout(() => {
      this.copyLabel.set('Copia');
      this.showCopiedFeedback.set(false);
    }, 1500);
  }

  isHighlighted(lineIndex: number): boolean {
    return this.highlightLines().includes(lineIndex + 1);
  }

  private setupSelectionContainment(): void {
    const doc = this.document;

    const onMouseDown = (event: MouseEvent): void => {
      const surface = this.codeSurface()?.nativeElement;
      this.dragStartedInsideSurface =
        !!surface && event.target instanceof Node && surface.contains(event.target);
    };
    const onSelectionChange = (): void => {
      if (this.dragStartedInsideSurface) {
        this.clampSelectionToSurface();
      }
    };
    const onMouseUp = (): void => {
      this.dragStartedInsideSurface = false;
    };

    doc.addEventListener('mousedown', onMouseDown);
    doc.addEventListener('selectionchange', onSelectionChange);
    doc.addEventListener('mouseup', onMouseUp);

    this.destroyRef.onDestroy(() => {
      doc.removeEventListener('mousedown', onMouseDown);
      doc.removeEventListener('selectionchange', onSelectionChange);
      doc.removeEventListener('mouseup', onMouseUp);
    });
  }

  private clampSelectionToSurface(): void {
    const surface = this.codeSurface()?.nativeElement;
    const selection = this.document.getSelection();
    if (!surface || !selection || selection.rangeCount === 0) {
      return;
    }

    const range = selection.getRangeAt(0);
    const startInside = surface.contains(range.startContainer);
    const endInside = surface.contains(range.endContainer);
    if (startInside && endInside) {
      return;
    }

    const bounds = this.document.createRange();
    bounds.selectNodeContents(surface);
    const clamped = range.cloneRange();

    if (!startInside) {
      const precedesSurface =
        (surface.compareDocumentPosition(range.startContainer) &
          Node.DOCUMENT_POSITION_PRECEDING) !==
        0;
      if (precedesSurface) {
        clamped.setStart(bounds.startContainer, bounds.startOffset);
      } else {
        clamped.setStart(bounds.endContainer, bounds.endOffset);
      }
    }
    if (!endInside) {
      const followsSurface =
        (surface.compareDocumentPosition(range.endContainer) & Node.DOCUMENT_POSITION_FOLLOWING) !==
        0;
      if (followsSurface) {
        clamped.setEnd(bounds.endContainer, bounds.endOffset);
      } else {
        clamped.setEnd(bounds.startContainer, bounds.startOffset);
      }
    }

    selection.removeAllRanges();
    selection.addRange(clamped);
  }
}
