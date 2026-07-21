import { InjectionToken, Provider } from '@angular/core';

export interface OrbitI18n {
  locale: string;
  labels: {
    close: string;
    openCalendar: string;
    previousMonth: string;
    nextMonth: string;
    select: string;
    search: string;
    openList: string;
    noResults: string;
    openTimePicker: string;
    hours: string;
    minutes: string;
    timePicker: string;
    nextHour: string;
    previousHour: string;
    nextMinutes: string;
    previousMinutes: string;
    segmentedControl: string;
    uploadLabel: string;
    uploadHint: string;
    loading: string;
    cancel: string;
    confirm: string;
    saveDraft: string;
    saveAndContinue: string;
  };
}

export type OrbitI18nConfig = Partial<Omit<OrbitI18n, 'labels'>> & {
  labels?: Partial<OrbitI18n['labels']>;
};

export const DEFAULT_ORBIT_I18N: OrbitI18n = {
  locale: 'it-IT',
  labels: {
    close: 'Chiudi', openCalendar: 'Apri calendario', previousMonth: 'Mese precedente', nextMonth: 'Mese successivo',
    select: 'Seleziona…', search: 'Cerca…', openList: 'Apri elenco', noResults: 'Nessun risultato',
    openTimePicker: 'Apri selettore orario', hours: 'Ore', minutes: 'Minuti', timePicker: 'Selettore orario', nextHour: 'Ora successiva', previousHour: 'Ora precedente', nextMinutes: 'Minuti successivi', previousMinutes: 'Minuti precedenti', segmentedControl: 'Selettore',
    uploadLabel: 'Trascina i file qui oppure clicca per sfogliare', uploadHint: 'PDF, JPG, PNG · max 10 MB',
    loading: 'Operazione in corso', cancel: 'ANNULLA', confirm: 'Conferma', saveDraft: 'SALVA BOZZA', saveAndContinue: 'SALVA E CONTINUA',
  },
};

export const ORBIT_I18N = new InjectionToken<OrbitI18n>('ORBIT_I18N', {
  providedIn: 'root',
  factory: () => DEFAULT_ORBIT_I18N,
});

/** Provides a locale and/or translated labels for every Orbit component in its injector scope. */
export function provideOrbitI18n(config: OrbitI18nConfig): Provider {
  return {
    provide: ORBIT_I18N,
    useValue: {
      ...DEFAULT_ORBIT_I18N,
      ...config,
      labels: { ...DEFAULT_ORBIT_I18N.labels, ...config.labels },
    } satisfies OrbitI18n,
  };
}
