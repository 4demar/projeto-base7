# Tech Stack

## Core

- React 18 with TypeScript (strict mode)
- Vite 4 (dev server and bundler)
- MUI (Material UI) v7 with Emotion for styling
- React Router DOM v7 (BrowserRouter, nested routes via `<Outlet>`)
- date-fns v4 for date manipulation (with `ptBR` locale)
- react-markdown v10 for rendering Markdown content

## State Management

- No global state library. State is managed via custom React hooks (`useState`, `useCallback`) in `src/store/useStore.ts`.
- Data is persisted to `localStorage` with JSON serialization.
- IDs are generated with `crypto.randomUUID()`.

## Styling

- Dark theme by default, defined in `src/theme.ts` using MUI's `createTheme`.
- Primary color: `#6C63FF`, Secondary: `#00BFA6`, Background: `#0D1117`, Paper: `#161B22`.
- Font family: Inter, Roboto fallback.
- Border radius: 12px globally.
- Use MUI's `sx` prop and `styled()` for component-level styles. No CSS modules or Tailwind.

## TypeScript

- Strict mode enabled (`strict: true`, `noUnusedLocals`, `noUnusedParameters`).
- Target: ES2020, JSX: react-jsx, module resolution: bundler.
- Type definitions live in `src/types/index.ts`.

## Linting

- ESLint 8 with `@typescript-eslint` and `react-hooks` plugins.
- `react-refresh/only-export-components` rule enforced (warn).

## Commands

| Command           | Description                        |
|-------------------|------------------------------------|
| `npm run dev`     | Start Vite dev server              |
| `npm run build`   | Type-check with `tsc` then build   |
| `npm run lint`    | Run ESLint (zero warnings allowed) |
| `npm run preview` | Preview production build locally   |
