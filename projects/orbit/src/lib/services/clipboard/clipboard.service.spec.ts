import { TestBed } from '@angular/core/testing';
import { OrbitClipboardService } from './clipboard.service';

describe('OrbitClipboardService', () => {
  let service: OrbitClipboardService;
  let writeText: ReturnType<typeof vi.fn>;
  let originalClipboard: unknown;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OrbitClipboardService);
    originalClipboard = (navigator as unknown as Record<string, unknown>)['clipboard'];
    writeText = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, 'clipboard', {
      value: { writeText },
      configurable: true,
    });
  });

  afterEach(() => {
    Object.defineProperty(navigator, 'clipboard', {
      value: originalClipboard,
      configurable: true,
    });
  });

  it('writes the given text to the clipboard and resolves true', async () => {
    const result = await service.copyText('<orbit-button label="Salva" />');
    expect(writeText).toHaveBeenCalledWith('<orbit-button label="Salva" />');
    expect(result).toBe(true);
  });

  it('resolves false without throwing when the clipboard write rejects', async () => {
    writeText.mockRejectedValueOnce(new Error('denied'));
    const result = await service.copyText('x');
    expect(result).toBe(false);
  });

  it('resolves false without throwing when clipboard is unavailable', async () => {
    Object.defineProperty(navigator, 'clipboard', { value: undefined, configurable: true });
    const result = await service.copyText('x');
    expect(result).toBe(false);
  });
});
