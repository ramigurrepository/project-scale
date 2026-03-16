# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Mobile-first weight tracking web app (RTL Hebrew UI). Users log body weight across multiple named scales (home, gym, etc.) and view a multi-line chart of their history.

## Tech Stack

- React 18 + Vite + TypeScript
- Tailwind CSS (mobile-first)
- Recharts (multi-line chart)
- localStorage only (no backend)

## Commands

```bash
npm install       # first-time setup
npm run dev       # dev server at http://localhost:5173
npm run build     # production build
npm run preview   # preview production build
```

## Architecture

**State management:** `DataContext` + `useReducer` in [src/context/DataContext.tsx](src/context/DataContext.tsx). A single `dataReducer` handles all CRUD. State auto-syncs to `localStorage` via `useEffect` after every dispatch.

**Navigation:** State-based (`activeScreen` in `App.tsx`) — no router. Three screens: `log`, `history`, `scales`.

**Data models** (defined in [src/types/index.ts](src/types/index.ts)):
- `Scale` — named weighing device with auto-assigned color
- `WeightEntry` — weight measurement with `loggedAt` (user-editable) and `createdAt` (immutable)

**Chart data:** `useChartData(days)` in [src/hooks/useChartData.ts](src/hooks/useChartData.ts) transforms entries into `{ date, [scaleId]: number }[]` for Recharts. Multiple entries same scale+day → takes the latest.

**localStorage keys:** `scale_tracker_scales` and `scale_tracker_entries`

**Scale colors:** 8-color palette auto-assigned in order; defined in [src/constants/index.ts](src/constants/index.ts).
