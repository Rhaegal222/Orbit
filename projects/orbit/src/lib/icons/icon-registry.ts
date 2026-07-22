export type OrbitIconName = 'close' | 'calendar' | 'chevron-down' | 'check' | 'copy' | 'mail' | 'lock';

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
  copy: [
    'M9 8.5A1.5 1.5 0 0 1 10.5 7h8A1.5 1.5 0 0 1 20 8.5v9a1.5 1.5 0 0 1-1.5 1.5h-8A1.5 1.5 0 0 1 9 17.5v-9Z',
    'M16 7V5.5A1.5 1.5 0 0 0 14.5 4h-8A1.5 1.5 0 0 0 5 5.5v9A1.5 1.5 0 0 0 6.5 16H9',
  ],
  mail: [
    'M4 6.5A1.5 1.5 0 0 1 5.5 5h13A1.5 1.5 0 0 1 20 6.5v11a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 4 17.5v-11Z',
    'm5 7 7 5 7-5',
  ],
  lock: [
    'M6 10h12v10H6V10Z',
    'M8.5 10V7.5a3.5 3.5 0 0 1 7 0V10',
  ],
};
