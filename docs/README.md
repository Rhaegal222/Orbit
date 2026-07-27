# Orbit — Documentazione

## Architettura e consumo corrente

| Documento | Contesto | Contenuto |
|-----------|----------|-----------|
| [DEPLOYMENT.md](DEPLOYMENT.md) | Wyrmrest | Tripla distribuzione, deploy website, stack runtime |
| [PUBLISHING.md](PUBLISHING.md) | Tutti | Flusso di pubblicazione npm (GitHub Actions, GitLab CI, Forgejo) |
| [UPDATE-GUIDELINES.md](UPDATE-GUIDELINES.md) | Tutti | Aggiornamento Galileo → Forgejo → GitHub → npm |
| [THEMING.md](THEMING.md) | Consumatori | Sistema di token, density, shape, text-scale |
| [ARCHITECTURE.md](ARCHITECTURE.md) | Sviluppatori | Architettura interna della libreria |

## Operazioni e release

| Documento | Contesto | Contenuto |
|-----------|----------|-----------|
| [ORBIT-ALIGNMENT-PLAN.md](ORBIT-ALIGNMENT-PLAN.md) | Team | Piano di allineamento post-pubblicazione |
| [TROUBLESHOOTING.md](TROUBLESHOOTING.md) | Sviluppatori | Problemi noti e soluzioni |
| [HOW-UPDATE-ORBIT.md](HOW-UPDATE-ORBIT.md) | Sviluppatori | Procedura aggiornamento da Galileo |

## Storico e specifiche

| Documento | Stato | Contenuto |
|-----------|-------|-----------|
| [ORBIT-PUBLIC-SPLIT-STATUS.md](ORBIT-PUBLIC-SPLIT-STATUS.md) | Storico | Stato dello split pubblico/privato |
| [IMPLEMENTATION-PLAN.md](IMPLEMENTATION-PLAN.md) | Storico | Piano di implementazione iniziale |
| [VISUAL-SYSTEM-REFRESH.md](VISUAL-SYSTEM-REFRESH.md) | Storico | Refresh del sistema visivo |
| [PATTERNS-AND-GOVERNANCE.md](PATTERNS-AND-GOVERNANCE.md) | Storico | Pattern e governance |
| [superpowers/](superpowers/) | Storico | Specifiche e piani della libreria estratta |

## Stack tecnico

- **Libreria**: Angular 22, TypeScript 6, Tailwind CSS v4
- **Build**: ng-packagr (partial-Ivy)
- **Test**: Vitest
- **Lint**: ESLint + angular-eslint
- **CI**: GitHub Actions (public), Forgejo Actions (private)
- **Deploy**: Docker + Traefik su `orbit.wyrmrest.it`
