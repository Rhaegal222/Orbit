import { describe, expect, it } from 'vitest';
import { CATALOG_ENTRIES } from './catalog';

const PRIMITIVE_SLUGS_IN_ORDER = [
  'button',
  'badge',
  'form-grid',
  'form-field',
  'form-section',
  'text-input',
  'select',
  'checkbox',
  'pill-switch',
];

describe('CATALOG_ENTRIES', () => {
  it('lists the nine primitive entries in priority order (other entries may be appended by parallel work)', () => {
    const slugs = CATALOG_ENTRIES.map((e) => e.slug);
    const primitiveIndices = PRIMITIVE_SLUGS_IN_ORDER.map((slug) => slugs.indexOf(slug));
    expect(primitiveIndices).not.toContain(-1);
    expect(primitiveIndices).toEqual([...primitiveIndices].sort((a, b) => a - b));
  });

  it('marks the nine primitive entries as verified (token drift resolved by Core)', () => {
    for (const slug of PRIMITIVE_SLUGS_IN_ORDER) {
      expect(CATALOG_ENTRIES.find((e) => e.slug === slug)?.status).toBe('verified');
    }
  });

  it('leaves no blockedFile/blockedTokens on verified entries', () => {
    for (const entry of CATALOG_ENTRIES.filter((e) => e.status === 'verified')) {
      expect(entry.blockedFile).toBeUndefined();
      expect(entry.blockedTokens).toBeUndefined();
    }
  });
});
