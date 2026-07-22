import { describe, expect, it } from 'vitest';
import { CATALOG_ENTRIES } from './catalog';

describe('CATALOG_ENTRIES', () => {
  it('lists every entry in alphabetical label order', () => {
    const labels = CATALOG_ENTRIES.map((entry) => entry.label);
    expect(labels).toEqual([...labels].sort((a, b) => a.localeCompare(b, 'it')));
  });

  it('marks every catalog entry as verified', () => {
    for (const entry of CATALOG_ENTRIES) {
      expect(entry.status).toBe('verified');
    }
  });

  it('leaves no blockedFile/blockedTokens on verified entries', () => {
    for (const entry of CATALOG_ENTRIES.filter((e) => e.status === 'verified')) {
      expect(entry.blockedFile).toBeUndefined();
      expect(entry.blockedTokens).toBeUndefined();
    }
  });
});
