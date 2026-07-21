# Orbit Redesign — component audit

> **Riferimento analizzato:** `Assicurazioni Automezzi - Redesign (standalone).html` (21 luglio 2026)
>
> Il riferimento e' stato usato soltanto per identificare gerarchia, densita' e pattern. I nomi, i dati e i flussi assicurativi non fanno parte di Orbit.

## Metodo e stato iniziale

L'audit confronta ogni pattern visibile nel file sorgente con l'API pubblica e il codice presente in `projects/orbit`. “Equivalente” significa una primitiva generica, accessibile e tematizzabile; non una riproduzione del markup o delle classi Bootstrap del prototipo.

| Pattern nel redesign | Destinazione Orbit | Stato iniziale | Decisione / note |
| --- | --- | --- | --- |
| Tela modale centrata, superficie operativa | `OrbitModalComponent` + dialog CDK | Mancante | Introdurre wrapper compositivo; il servizio esistente resta il punto di apertura. |
| Header compatto: titolo, sottotitolo, chiusura | `OrbitModalHeaderComponent` + `OrbitIconButtonComponent` | Presente ma incompleto | Header esiste; la chiusura deve usare il contratto icona indipendente da Bootstrap. |
| Corpo e footer separati | `OrbitModalBodyComponent`, `OrbitModalFooterComponent` | Presente ma incompleto | Mancava il contenitore modale che ne definisce relazione e ARIA. |
| Layout desktop 7fr / 5fr, una colonna su stretto | `OrbitFormGridComponent` | Presente e equivalente | Conservare come layout compositivo, senza nomi di dominio. |
| Griglia interna a 12 colonne con span | `OrbitFormGridComponent` | Presente ma incompleto | Aggiungere modalita' `columns` e direttiva/attributo di span. |
| Titolo numerato, divider e gerarchia sezione | `OrbitFormSectionComponent`, `OrbitDividerComponent` | Presente ma incompleto | Section e divider esistono; aggiungere indice opzionale e densita'. |
| Campo compatto con label, hint, errore | `OrbitFormFieldComponent` + CVA esistenti | Presente e equivalente | Verificare gli stati nel Lab e mantenere i controlli nativi. |
| Input e select | Input/select Orbit | Presente e equivalente | Le API restano generiche e CVA. |
| Date e time | `OrbitDatePickerComponent`, `OrbitTimePickerComponent` | Presente ma incompleto | CVA e controlli sono disponibili; la migrazione dei popup a CDK Overlay con gestione focus completa resta necessaria. |
| Checkbox e selettore a pillola | `OrbitCheckboxComponent`, `OrbitPillSwitchComponent` | Presente e equivalente | Nessuna semantica applicativa da trasferire. |
| Tile selezionabili con check e stato | `OrbitSelectableTileComponent` | Presente ma incompleto | Aggiungere test e contratto accessibile completo. |
| Badge/stato “sola lettura” | `OrbitBadgeComponent` / attachment item | Presente ma incompleto | Rendere lo status label generico, non legato a documenti. |
| Riga allegato: icona, metadati, stato, azioni | `OrbitAttachmentListItemComponent` | Presente ma incompleto | Gia' generica; esportare e verificare azioni/label. |
| Lista allegati semantica | `OrbitAttachmentListComponent` | Presente ma incompleto | Gia' generica; esportare nel public API. |
| Separatore tratteggiato | `OrbitDividerComponent` | Presente e equivalente | Varianti `solid` e `dashed`. |
| Dropzone sotto la lista | `OrbitAttachmentDropzoneComponent` | Presente ma incompleto | Completare la composizione nel Lab. |
| Footer Annulla / Bozza / Salva e continua | `OrbitFormActionBarComponent` + `OrbitButtonComponent` | Presente e equivalente | Compone i bottoni Orbit, senza CSS duplicato. |
| Gerarchia button: outline, soft, conferma success | `OrbitButtonComponent` | Presente e equivalente | `outline`, `soft`, `solid success`, loading e focus-visible gia' coperti. |
| Icone (close, upload, stato, azioni) | Contratto `icon` string/slot + SVG inline del consumer | Presente ma incompleto | Nessuna dipendenza Bootstrap: il kit non presuppone una icon font. |
| Tooltip/popover/autocomplete | Primitive overlay Orbit | Presente ma incompleto | Verifica CDK/focus nel piano; non sono specifici del redesign. |
| Confirmation dialog | `OrbitConfirmDialogComponent` + `OrbitDialogService` | Mancante | Introdurre composizione generica su dialog CDK. |
| Menu/dropdown | Select nativo / autocomplete | Non da portare nel kit ora | Il prototipo non mostra un menu generico distinto; evitare duplicazione finche' non emerge un caso d'uso. |
| Testi, premi, coperture, polizze, periodicita' e dati di veicolo | Nessuno | Non generico / da non portare | Sono contenuto e terminologia dell'applicazione di riferimento. |
| Font Public Sans hard-coded | Token `--orbit-font-sans` | Non generico / da non portare | La scelta del font e' un override tema, non un asset/valore imposto da Core. |
| Colori e Bootstrap Icons del prototipo | Token semantic + icone consumer | Non generico / da non portare | Trasferire contrasto e gerarchia, non brand, classi o font Bootstrap. |

## Contratto visivo estratto

- Superfici dense e leggibili: controlli di circa 38 px nel tema comfortable e riduzione coerente in compact.
- Griglia compositiva: contenitore principale 7/5, sezioni interne a 12 colonne con fallback a una colonna.
- Sequenza: header → corpo strutturato → footer di azione persistente, senza trasformarla in una pagina business.
- Stato sempre ridondante: testo/ARIA/forma oltre al colore; focus visibile e controlli nativi dove adeguati.
- Personalizzazione tramite token semantic (font, tipo, colori, radius, shadow, densita'), mai valori fissati nei componenti.
