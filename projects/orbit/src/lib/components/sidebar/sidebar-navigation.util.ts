export function formatOrbitSidebarBadge(badge: string | number | undefined): string {
  if (typeof badge !== 'number') return badge ?? '';
  return badge > 99 ? '99+' : String(badge);
}
