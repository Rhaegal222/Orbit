# Architettura Galileo Orbit

Orbit non è una sola applicazione. È una triade di strumenti con una responsabilità precisa: il pacchetto distribuisce il sistema, Lab ne verifica i componenti e Studio crea temi per le applicazioni che lo adottano.

```text
                    ┌─────────────────────┐
                    │     Orbit Core      │
                    │  @galileo/orbit     │
                    │ componenti + token  │
                    └─────────┬───────────┘
                              │
             ┌────────────────┼────────────────┐
             │                │                │
             ▼                ▼                ▼
    ┌────────────────┐ ┌────────────────┐ ┌─────────────────────┐
    │   Orbit Lab    │ │  Orbit Studio  │ │ App consumer        │
    │ catalogo/test  │ │ tema + preview │ │ importa Core + tema │
    └────────────────┘ └───────┬────────┘ └──────────┬──────────┘
                                │                     │
                                ▼                     │
                         orbit-theme.css ──────────────┘
```

## 1. Orbit Core

`@galileo/orbit` è il prodotto distribuito tramite il GitLab Package Registry.

Contiene:

- componenti Angular riusabili;
- token CSS e tema di default;
- comportamento accessibile, form control, overlay e primitive condivise;
- API pubbliche semplici: `@galileo/orbit` e `@galileo/orbit/styles`.

Non contiene pagine applicative, configurazioni di brand, route, dati, permessi o persistenza. Core deve restare neutrale: legge token CSS e non conosce la piattaforma che lo utilizza.

## 2. Orbit Lab

Orbit Lab è il catalogo tecnico interno della libreria. Mostra i componenti reali in tutte le loro varianti e stati: loading, disabled, invalid, tastiera, responsive, densità e temi di test.

Il suo compito è rispondere a: _il componente funziona, è accessibile e rimane coerente in ogni stato?_

Lab dipende da Core, ma non viene pubblicato nel pacchetto npm e non deve diventare un editor di temi. È l’ambiente di sviluppo, verifica e documentazione dei componenti.

## 3. Orbit Studio

Orbit Studio è il configuratore visuale interno. Permette a un team di modificare palette, tipografia, raggi, ombre e densità, vedere un’anteprima con componenti Orbit reali e generare il tema risultante.

Il suo compito è rispondere a: _come può questa piattaforma avere una propria identità senza duplicare o forkare Orbit?_

Studio dipende da Core per la preview, ma non viene aggiunto automaticamente ai progetti consumer. L’output è un file CSS versionabile, per esempio `orbit-theme.css`:

```css
@import '@galileo/orbit/styles';
@import './orbit-theme.css';
```

Un consumer può scegliere di incorporare Studio solo esplicitamente, per esempio in un’area amministrativa o di staging. Orbit non crea né registra route come `/galileo-orbit-config` in automatico.

## Il contratto che collega la triade

Il collegamento tra Core, Lab, Studio e le applicazioni consumer è il contratto dei token CSS.

```text
Reference token  →  Semantic token  →  Component token
valore grezzo       intento visivo      applicazione nel controllo
```

Esempio:

```text
--orbit-ref-brand-500
        ↓
--orbit-action-primary-bg
        ↓
--orbit-button-primary-bg
```

- **Core** definisce il tema default e fa sì che i componenti usino token semantic o component, mai un valore di brand hard-coded.
- **Lab** usa il contratto per provare ogni componente con il tema default e con temi di regressione.
- **Studio** modifica soprattutto i token semantic e genera il CSS di override.
- **L’app consumer** importa Core e il proprio tema; non conosce né Lab né Studio a runtime.

La guida operativa per creare un tema è in [THEMING.md](THEMING.md).

## Confini intenzionali

| Elemento | Pubblicato npm | Usato dal consumer runtime | Salva dati | Aggiunge route |
| --- | --- | --- | --- | --- |
| Orbit Core | Sì | Sì | No | No |
| Orbit Lab | No | No | No | No |
| Orbit Studio | No | No, salvo integrazione esplicita | No, esporta CSS | No, salvo scelta esplicita |

Questi confini permettono di evolvere documentazione e configuratore senza rendere più pesante o invasiva la libreria installata.
