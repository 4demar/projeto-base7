# Implementation Plan: Editor de Layout de Banner

## Overview

Incremental implementation of the Banner Layout Editor page for DevPortal. Each task builds on the previous, starting with types and state management, then core components, and finally wiring everything together with dialogs and navigation. The `generateHtml` pure function is implemented early to enable property testing alongside UI work.

## Tasks

- [x] 1. Define data types and state management hook
  - [x] 1.1 Add `BannerTextElement` and `BannerProject` interfaces to `src/types/index.ts`
    - `BannerTextElement`: id, content, x, y, fontSize, color, fontWeight
    - `BannerProject`: id, name, backgroundImage, textElements, createdAt, updatedAt
    - _Requirements: 3.7, 9.2, 10.1_

  - [x] 1.2 Implement `useBannerEditor` hook in `src/store/useStore.ts`
    - Add localStorage key `devportal_banner_projects`
    - Implement `saveProject`, `updateProject`, `loadProject`, `deleteProject` functions
    - Follow existing `useLembrete` pattern with `loadFromStorage`/`saveToStorage`
    - Use `useState` + `useCallback`, IDs via `crypto.randomUUID()`
    - _Requirements: 10.1, 10.2, 10.3, 10.4_

  - [ ]* 1.3 Write property test for project save/load round-trip
    - **Property 6: Round-trip de salvar/carregar projeto**
    - Generate arbitrary `BannerProject` objects with fast-check
    - Verify serializing to localStorage and loading back produces equivalent object
    - **Validates: Requirements 9.2, 9.4, 9.8, 10.3**

  - [ ]* 1.4 Write property test for project deletion
    - **Property 7: Exclusão de projeto**
    - Generate arbitrary list of projects and pick one to delete
    - Verify list shrinks by one, deleted project is gone, others unchanged
    - **Validates: Requirements 9.6**

- [x] 2. Implement `generateHtml` pure function
  - [x] 2.1 Create `src/components/BannerEditor/generateHtml.ts`
    - Accept a `BannerProject` (or its relevant fields: backgroundImage, textElements) and return an HTML string
    - Container with `relative inline-block` class
    - `<img>` tag with Data URL src and `w-full h-auto block` classes
    - Each text element as `<span>` with `absolute` class, inline styles for top/left/font-size/color, Tailwind class for font-weight
    - _Requirements: 7.2, 7.4, 7.5, 7.6_

  - [ ]* 2.2 Write property test for HTML generation correctness
    - **Property 5: Corretude da geração de HTML**
    - Generate arbitrary backgroundImage strings and lists of BannerTextElement
    - Verify output contains `relative` container, `<img>` with correct src, exactly N `absolute` text elements with matching styles
    - **Validates: Requirements 7.2, 7.4, 7.5, 7.6**

- [x] 3. Implement canvas and text element overlay components
  - [x] 3.1 Create `src/components/BannerEditor/TextElementOverlay.tsx`
    - Render text element with `position: absolute`, `left`/`top` in percentage
    - Implement drag-and-drop via `onMouseDown` on element, `onMouseMove`/`onMouseUp` on `document`
    - Apply fontSize, color, fontWeight styles from element props
    - Highlight when selected, call `onSelect` on click
    - Clamp positions to [0, 100] range during drag
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 5.5, 6.2_

  - [x] 3.2 Create `src/components/BannerEditor/BannerCanvas.tsx`
    - Render container with `position: relative`, display background image or placeholder
    - Maintain aspect ratio of loaded image
    - Render `TextElementOverlay` for each text element
    - Use `ref` on container to calculate relative positions for drag
    - _Requirements: 2.5, 6.1, 6.3, 6.4_

  - [ ]* 3.3 Write property test for position calculation and clamping
    - **Property 4: Cálculo e limitação de posição**
    - Generate arbitrary mouse positions and canvas dimensions
    - Verify computed percentage is in [0, 100] and correct formula `(mouseOffset / canvasDimension) * 100`
    - **Validates: Requirements 4.3, 4.4**

- [x] 4. Implement properties panel
  - [x] 4.1 Create `src/components/BannerEditor/PropertiesPanel.tsx`
    - Show "Selecione um elemento de texto" when no element selected
    - TextField for content editing
    - TextField (number) or Slider for fontSize
    - Color input for text color
    - Select for fontWeight (normal / bold)
    - All changes call back to parent to update element in real time
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5_

- [x] 5. Checkpoint — Ensure core components compile and render
  - Ensure all tests pass, ask the user if questions arise.

- [x] 6. Implement dialogs
  - [x] 6.1 Create `src/components/BannerEditor/HtmlCodeDialog.tsx`
    - MUI Dialog displaying generated HTML in `<pre><code>` block
    - "Copiar Código" button using `navigator.clipboard.writeText()`
    - Snackbar for success ("Código copiado com sucesso") and error feedback
    - _Requirements: 7.1, 7.3, 8.1, 8.2, 8.3, 8.4_

  - [x] 6.2 Create `src/components/BannerEditor/ProjectsListDialog.tsx`
    - MUI Dialog listing saved projects by name
    - "Carregar" button to load a project, "Excluir" button to delete
    - Confirm deletion before removing
    - _Requirements: 9.3, 9.4, 9.5, 9.6_

- [x] 7. Implement the BannerEditor page and wire everything together
  - [x] 7.1 Create `src/pages/BannerEditor.tsx` (default export)
    - Two-column layout: canvas (left) + properties panel (right)
    - Toolbar with buttons: upload image, "Adicionar Texto", "Ver Código HTML", "Salvar Projeto", "Projetos"
    - Image upload with file input (accept PNG, JPG, JPEG, WebP), validate MIME type, convert to Data URL via FileReader
    - Show error Snackbar for invalid file types
    - Manage local state: backgroundImage, textElements, selectedElementId, dialog open states
    - Use `useBannerEditor` hook for project persistence
    - "Salvar Projeto" prompts for project name, saves via hook
    - Loading a project restores backgroundImage, textElements, positions and styles
    - Disable "Ver Código HTML" when no background image loaded
    - _Requirements: 1.1, 2.1, 2.2, 2.3, 2.4, 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 6.1, 9.1, 9.7_

  - [ ]* 7.2 Write property test for image file type validation
    - **Property 1: Validação de tipo de arquivo de imagem**
    - Generate arbitrary MIME type strings with fast-check
    - Verify files with type in `{image/png, image/jpeg, image/webp}` are accepted, all others rejected
    - **Validates: Requirements 2.2, 2.3**

  - [ ]* 7.3 Write property test for text element ID uniqueness
    - **Property 2: Unicidade de IDs dos elementos de texto**
    - Generate arbitrary N (number of add operations)
    - Verify all N elements have distinct IDs and list length equals N
    - **Validates: Requirements 3.3, 3.7**

  - [ ]* 7.4 Write property test for text element removal
    - **Property 3: Remoção de elemento de texto**
    - Generate arbitrary list of text elements, pick one to remove
    - Verify list shrinks by one and removed element is absent
    - **Validates: Requirements 3.6**

- [x] 8. Add route and navigation entry
  - [x] 8.1 Add `/banner-editor` route in `src/App.tsx`
    - Import `BannerEditor` page and add `<Route path="/banner-editor" element={<BannerEditor />} />`
    - _Requirements: 1.1, 1.3_

  - [x] 8.2 Add "Editor de Banner" menu item in `src/components/Layout.tsx`
    - Add entry to `menuItems` array with appropriate MUI icon
    - _Requirements: 1.2_

- [x] 9. Final checkpoint — Ensure all tests pass and feature is integrated
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Each task references specific requirements for traceability
- Property tests use fast-check and validate the 7 correctness properties from the design
- Tailwind CSS is only used inside the generated HTML output, not in the app UI
- All UI labels must be in pt-BR
