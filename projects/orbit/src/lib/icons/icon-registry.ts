export type OrbitIconName = 'close' | 'calendar' | 'chevron-down' | 'check';

export const ORBIT_ICON_PATHS: Record<OrbitIconName, string[]> = {
  close: ['M6 6l12 12', 'M18 6l-12 12'],
  calendar: [
    'M4 5.5A1.5 1.5 0 0 1 5.5 4h13A1.5 1.5 0 0 1 20 5.5v13A1.5 1.5 0 0 1 18.5 20h-13A1.5 1.5 0 0 1 4 18.5v-13Z',
    'M8 3v3',
    'M16 3v3',
    'M4 9.5h16',
  ],
  'chevron-down': ['M6 9l6 6 6-6'],
  check: ['M5 12.5l4.5 4.5L19 7'],
};
