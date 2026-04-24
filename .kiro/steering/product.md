# DevPortal

An internal developer portal SPA (Single Page Application) for managing application contexts, developer tools, annotations, reminders, and a Kanban task board.

The UI language is Brazilian Portuguese (pt-BR). All user-facing labels, placeholders, and messages must be written in pt-BR.

## Core Features

- **Dashboard (Painel)**: Hierarchical selector for Application → Environment → Tool, showing associated tools and team responsibles for each context.
- **Tasks (Tarefas)**: Kanban board with columns: Backlog, A Fazer, Em Progresso, Revisão, Concluído. Tasks have priority levels (urgent, high, medium, low) and tags.
- **Tools (Ferramentas)**: Collection of developer utility tools organized in tabs — converters (number, timestamp, UTC, units), formatters (JSON, CSV, XML), encoders (Base64, URL, JWT), and text utilities (casing, compare, normalize, char count).
- **Annotations (Anotações)**: Markdown-based notes with image support (paste or upload), optionally linked to an application/environment/tool context.
- **Reminders (Lembretes)**: Date-based reminders that can be linked to annotations, with due-date status indicators.

## Data Persistence

All user data (annotations, reminders, tasks) is persisted to `localStorage`. There is no backend API. Application/environment/tool catalog data comes from static mock data.
