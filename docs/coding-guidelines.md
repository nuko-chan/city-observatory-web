# Coding Guidelines

[← README に戻る](../README.md)

## TypeScript

- Type definitions must use `type`, not `interface`.
- Top-level functions should use `function` declarations.
- Non top-level functions should use arrow functions.
- Prefer `undefined` over `null`.

## React and State Management

- Use `useState` for local state by default.
- Use `jotai` only when global state is unavoidable.
- `useContext` is prohibited.
- Use `useCallback`, `useMemo`, and `memo` when needed to avoid unnecessary re-renders.
  - If memoization is unnecessary (e.g., RSC), do not add it.

## Comments

- Add comments in Japanese only when the code is a bit complex or hard to read.
- Comments should explain why the function is needed, what it is trying to do, and what it achieves.

## Architecture

- Build with an FSD (Feature-Sliced Design) mindset.
- Barrel files are prohibited.

## Naming

- All directory and file names must be kebab-case.
