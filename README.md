# Samo L-22

Un'app cross-platform moderna e premium per studenti di Scienze Motorie (L-22).

## Struttura Monorepo
Questo è un monorepo gestito con Turborepo e `pnpm`. Utilizza **Next.js** per il web, **Expo** per mobile e **Tamagui** per il design system.

### Setup Iniziale
1. Assicurati di avere `pnpm` installato.
2. Installa le dipendenze:
   ```bash
   pnpm install
   ```

### Esecuzione
- **Avvia tutte le app (Web e Mobile)**:
  ```bash
  pnpm dev
  ```
- **Avvia solo Web (Next.js)**:
  ```bash
  cd apps/web && pnpm dev
  ```
- **Avvia solo Mobile (Expo)**:
  ```bash
  cd apps/mobile && pnpm start
  ```

### Database e Backend
Il backend utilizza Supabase. Per avviare localmente:
```bash
supabase start
```
Assicurati di creare e applicare le migration contenute nella directory `supabase/migrations`.

## Design System
Tutti i componenti UI (Button, Card, ProgressRing) sono definiti in `packages/ui` e sono condivisi tra web e mobile. Il design supporta nativamente Light e Dark mode.