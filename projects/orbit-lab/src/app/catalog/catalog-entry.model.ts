import type { OrbitIconName } from '@galileo/orbit';

export type CatalogStatus = 'verified' | 'token-blocked' | 'stabilizing';

export interface CatalogEntry {
  slug: string;
  label: string;
  status: CatalogStatus;
  icon: OrbitIconName;
  /** Only set when status is 'token-blocked'. */
  blockedTokens?: string[];
  /** Only set when status is 'token-blocked'. Repo-relative path. */
  blockedFile?: string;
}
