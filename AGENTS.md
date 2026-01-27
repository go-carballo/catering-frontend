# Code Review Rules - Catering Frontend

## General Principles

- Write clean, readable, and maintainable code
- Follow DRY (Don't Repeat Yourself) principle
- Keep functions small and focused on a single responsibility
- Use meaningful and descriptive names for variables, functions, and components

## TypeScript

- Always use explicit types, avoid `any`
- Prefer interfaces over types for object shapes
- Use type inference where the type is obvious
- Export types from dedicated files in `src/types/`
- Use discriminated unions for complex state management

## React & Next.js

- Use functional components with hooks
- Keep components small and focused
- Extract reusable logic into custom hooks in `src/hooks/`
- Use `'use client'` directive only when necessary
- Prefer Server Components when possible
- Colocate related files (component, styles, tests)

## Component Structure

```tsx
// 1. Imports
// 2. Types/Interfaces
// 3. Component
// 4. Exports
```

## State Management

- Use React Query for server state
- Use React Context for global UI state (auth, theme)
- Keep local state close to where it's used
- Avoid prop drilling - use composition or context

## Styling

- Use Tailwind CSS utility classes
- Use `cn()` utility for conditional classes
- Follow mobile-first responsive design
- Use shadcn/ui components as base

## File Organization

- Components: `src/components/`
- Pages: `src/app/`
- Hooks: `src/hooks/`
- Services/API: `src/services/`
- Types: `src/types/`
- Utilities: `src/lib/`

## Naming Conventions

- Components: PascalCase (`UserProfile.tsx`)
- Hooks: camelCase with `use` prefix (`useAuth.ts`)
- Services: camelCase with `.service` suffix (`auth.service.ts`)
- Types: PascalCase (`User`, `AuthResponse`)
- Files: kebab-case (`user-profile.tsx`)

## Error Handling

- Always handle errors in async operations
- Use try-catch blocks appropriately
- Provide meaningful error messages to users
- Log errors for debugging

## Performance

- Memoize expensive computations with `useMemo`
- Memoize callbacks with `useCallback` when passing to children
- Use dynamic imports for code splitting
- Optimize images with Next.js Image component

## Security

- Never expose sensitive data in client code
- Validate all user inputs
- Use environment variables for API keys
- Sanitize data before rendering

## Accessibility

- Use semantic HTML elements
- Include ARIA labels where necessary
- Ensure keyboard navigation works
- Maintain sufficient color contrast
