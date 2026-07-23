import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class OrbitClipboardService {
  async copyText(text: string): Promise<boolean> {
    if (typeof navigator === 'undefined' || !navigator.clipboard) {
      return false;
    }
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      return false;
    }
  }
}
