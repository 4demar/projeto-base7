# Project Structure

```
src/
├── main.tsx              # App entry point (React.StrictMode, root render)
├── App.tsx               # Route definitions, ThemeProvider, CssBaseline
├── theme.ts              # MUI dark theme configuration
├── index.css             # Global CSS reset
├── App.css               # App-level styles
├── vite-env.d.ts         # Vite client type declarations
├── types/
│   └── index.ts          # All shared TypeScript interfaces and types
├── data/
│   └── mockData.ts       # Static application/environment/tool catalog data
├── store/
│   └── useStore.ts       # Custom hooks for state + localStorage persistence
├── components/
│   └── Layout.tsx         # App shell: AppBar, Drawer nav, Outlet for pages
├── pages/
│   ├── DashboardPage.tsx  # Application → Environment → Tool selector + responsibles
│   ├── TarefasPage.tsx    # Kanban task board
│   ├── ToolsPage.tsx      # Developer utility tools (converters, formatters, etc.)
│   ├── AnnotationsPage.tsx # Markdown annotations with image support
│   └── RemindersPage.tsx  # Date-based reminders
└── assets/
    └── react.svg
```

## Conventions

- One page component per route, placed in `src/pages/`.
- Shared/reusable components go in `src/components/`.
- All TypeScript interfaces and type aliases are centralized in `src/types/index.ts`.
- State hooks that manage a domain entity (annotations, reminders, tasks) live in `src/store/useStore.ts` as named exports (e.g., `useAnnotations`, `useReminders`, `useTarefas`).
- Static/seed data lives in `src/data/`.
- Pages are default-exported functional components.
- Layout uses React Router's `<Outlet>` with `useOutletContext` to pass shared state (e.g., search query) to child pages.
- Routes are defined in `App.tsx` using a single nested `<Route>` under `<Layout>`.
- MUI Grid uses the `size` prop syntax (e.g., `size={{ xs: 12, md: 6 }}`), not the legacy `xs`/`md` props.
