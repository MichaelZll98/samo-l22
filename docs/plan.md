# Samo L-22 - Piano Implementazione Fase 1

Questo documento contiene l'architettura per l'App Samo L-22, rivolta agli studenti universitari di Scienze Motorie.

## Architettura Monorepo (Turborepo)
- `apps/web`: Next.js (App Router)
- `apps/mobile`: Expo / React Native
- `packages/ui`: Componenti condivisi con Tamagui (Button, Card, ProgressRing)
- `packages/core`: Logica applicativa, Supabase Client e Zustand Store
- `packages/types`: Modelli e interfacce TypeScript
- `packages/config`: Configurazioni condivise per Tamagui e Linting

## Tecnologie e Design
- **UI Framework**: Tamagui per cross-platform Web e Native.
- **Design System**: Moderno, premium, ispirato ad Arc/Linear, con Glassmorphism leggero.
- **Database**: Supabase PostgreSQL.

## Funzionalità Base Implementate
1. **Autenticazione**: Supabase email/password.
2. **Dashboard**: Prossimi esami, progresso CFU, Quick Actions.
3. **Materie L-22**: Lista materie preconfigurata, selezionabile dall'utente.
4. **Tracciamento Progressi**: Monitoraggio carriera e statistiche CFU.

## Dati Iniziali (Seed)
Le seguenti materie da 6/9/12 CFU sono incluse nel DB:
Anatomia Umana, Fisiologia, Biomeccanica, Teoria e Metodologia dell'Allenamento, ecc.