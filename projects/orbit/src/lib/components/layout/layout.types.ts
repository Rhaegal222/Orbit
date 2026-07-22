export type OrbitLayoutGap = '2xs' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';

export const ORBIT_LAYOUT_GAPS: Record<OrbitLayoutGap, string> = {
  '2xs': 'var(--orbit-space-2xs)',
  xs: 'var(--orbit-space-xs)',
  sm: 'var(--orbit-space-sm)',
  md: 'var(--orbit-space-md)',
  lg: 'var(--orbit-space-lg)',
  xl: 'var(--orbit-space-xl)',
  '2xl': 'var(--orbit-space-2xl)',
};
