# L'Étoile Sucrée — Client-Side Development Guidelines

Guidelines, commands, and code styling rules for building the React/Vite/TS frontend application.

---

## 🛠️ Essential Commands

- **Development Server**: `npm run dev` (starts hot-reload server at `http://localhost:5173`)
- **Production Build**: `npm run build` (compiles TS and runs Vite build output into `dist/`)
- **TypeScript Compilation Check**: `npx tsc --noEmit` (runs Type-checking on all source code)
- **Code Linter**: `npm run lint` (runs ESLint checks)

---

## 📐 Code Style & Architecture

### 1. Types & Imports
- **Verbatim Module Syntax**: Always import types explicitly using `import type` to comply with the TS compile configuration.
  - *Correct*: `import type { Cake } from '../hooks/useCart';`
  - *Incorrect*: `import { Cake } from '../hooks/useCart';`
- **Strict Typing**: Avoid using `any`. Define interface structures for all components, API payloads, and state wrappers.

### 2. Naming Conventions
- **Components**: PascalCase (e.g. `Header.tsx`, `CakeCard.tsx`).
- **Hooks**: camelCase starting with `use` (e.g. `useAuth.tsx`, `useCart.tsx`).
- **Utilities & Assets**: camelCase (e.g. `api.ts`, `validation.ts`).

### 3. Styling & CSS Rules
- **CSS Tokens**: Centralize all style parameters inside `client/src/index.css`. Use CSS custom properties (`var(--primary)`, `var(--radius-md)`) rather than hardcoding colors, borders, or font families.
- **Light/Dark Mode**: Always design components to adapt using the system `prefers-color-scheme` tokens.
- **Animations**: Prefer `framer-motion` for complex interactive state transitions. Keep transition times between `150ms` (micro-interactions) and `300ms` (entering screens).
- **Responsive Layout**: Use flexbox and CSS Grid with viewport-relative units. Never hardcode container widths that cause horizontal scrollbars on mobile viewports.

### 4. Components & Hooks
- **Separation of concerns**: Place raw API interaction details in `utils/api.ts` or custom hooks. Do not fetch data directly from UI rendering code.
- **Hook Colocation**: Keep custom hooks inside the `src/hooks` folder. Persist user baskets or auth sessions in `localStorage` inside the hook logic.
