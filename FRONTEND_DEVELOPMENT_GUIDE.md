# Frontend Development Guide
## Setup, Workflows, and Contributing to ChefOps Frontend

---

## Table of Contents

1. [Quick Start](#quick-start)
2. [Project Setup](#project-setup)
3. [Development Workflow](#development-workflow)
4. [Code Conventions](#code-conventions)
5. [Adding New Features](#adding-new-features)
6. [Testing](#testing)
7. [Styling & Design System](#styling--design-system)
8. [Common Tasks](#common-tasks)
9. [Troubleshooting](#troubleshooting)
10. [Deployment](#deployment)

---

## Quick Start

### One Command Setup

```bash
# Clone and install
git clone https://github.com/go-carballo/catering-frontend.git
cd catering-frontend

# Full setup with dependencies
pnpm install

# Set environment variables
cp .env.example .env.local

# Start development server
pnpm dev
```

Open [http://localhost:3001](http://localhost:3001) in your browser.

### Test Credentials

```
Email: delicias@example.com
Password: password123
```

---

## Project Setup

### Prerequisites

- **Node.js**: 18+ (recommended: 22+)
- **pnpm**: 9+ ([install](https://pnpm.io/installation))
- **Git**: Latest version
- **Backend API**: Running on `http://localhost:3000/api` (see catering-api README)

### Environment Variables

Create `.env.local`:

```bash
# .env.local

# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:3000/api

# Optional: for production builds
# NEXT_PUBLIC_API_URL=https://catering-api-production.up.railway.app/api
```

**Why `NEXT_PUBLIC_` prefix?**
- Makes variable available in browser (for client-side API calls)
- Do NOT include secrets with this prefix
- Build fails if you use `NEXT_PUBLIC_` for secrets

### Install Dependencies

```bash
pnpm install
```

This installs all dependencies listed in `package.json` and creates `pnpm-lock.yaml`.

### Verify Setup

```bash
# Check Node version
node --version  # v18.0.0 or higher

# Check pnpm version
pnpm --version  # 9.0.0 or higher

# Start dev server (should run without errors)
pnpm dev
```

---

## Development Workflow

### 1. Create a Feature Branch

```bash
# Always branch from main
git checkout main
git pull origin main

# Create feature branch (kebab-case)
git checkout -b feature/user-management
# or for bugs:
git checkout -b fix/login-redirect
```

**Branch naming conventions**:
- `feature/feature-name` - New feature
- `fix/bug-name` - Bug fix
- `refactor/component-name` - Code refactoring
- `docs/what-changed` - Documentation only

### 2. Develop Locally

```bash
# Terminal 1: Start dev server
pnpm dev

# Terminal 2: Run tests (optional, watch mode)
pnpm test --watch

# Terminal 3: Run linter in watch mode (optional)
pnpm lint --fix --watch
```

### 3. Code Quality Checks

Before committing, run these checks:

```bash
# Run ESLint (TypeScript linting)
pnpm lint

# Type checking
pnpm type-check

# Run tests (if you added tests)
pnpm test

# Run linter in fix mode (auto-fixes simple issues)
pnpm lint --fix
```

**Pre-commit hooks** (via Gentleman Guardian Angel):
- Automatically runs on `git commit`
- Checks TypeScript syntax
- Validates code standards in AGENTS.md
- Blocks commit if errors found

### 4. Commit Changes

```bash
# Stage changes
git add .

# Commit with clear message
git commit -m "feat: add user management CRUD interface"

# Commit styles:
# feat: new feature
# fix: bug fix
# refactor: code restructuring
# docs: documentation changes
# chore: dependencies, config changes
# test: add/update tests
```

The pre-commit hook will run automatically. If it fails, fix the issues and try again.

### 5. Push and Create Pull Request

```bash
# Push branch to remote
git push origin feature/user-management

# Create pull request on GitHub
# - Use clear title: "Add user management CRUD"
# - Description: what changed and why
# - Link related issues if any
```

### 6. Code Review & Merge

- Request review from a team member
- Address feedback
- Squash and merge when approved

---

## Code Conventions

### File Naming

| Type | Pattern | Example |
|------|---------|---------|
| Components | PascalCase | `UserFormDialog.tsx` |
| Pages | kebab-case in folder | `app/users/page.tsx` |
| Hooks | `use` prefix + camelCase | `useUsers.ts` |
| Services | `service.ts` suffix | `contracts.service.ts` |
| Types | PascalCase | `User.ts` or in `types/user.ts` |
| Utils | camelCase | `currency-formatter.ts` |

### Component Structure

```tsx
// components/users/user-form-dialog.tsx

'use client'; // Only if needed (uses hooks, interactivity)

// 1. Imports (group by: React, third-party, local)
import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';

import { useUsers } from '@/hooks';
import { Dialog, Button, Form } from '@/components/ui';
import { createUserSchema } from '@/lib/validations';

// 2. Types
interface UserFormDialogProps {
  isOpen: boolean;
  onClose: () => void;
  defaultValues?: User;
}

// 3. Component
export function UserFormDialog({
  isOpen,
  onClose,
  defaultValues,
}: UserFormDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { mutate: createUser } = useUsers().createMutation;

  const handleSubmit = async (data: CreateUserInput) => {
    setIsSubmitting(true);
    try {
      await createUser(data);
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      {/* Component JSX */}
    </Dialog>
  );
}

// 4. Export (named or default, but be consistent)
export default UserFormDialog;
```

### TypeScript Best Practices

```tsx
// ✅ DO: Explicit types, avoid any
interface User {
  id: string;
  name: string;
  email: string;
}

// ❌ DON'T: Use any
const user: any = { /* ... */ };

// ✅ DO: Use type inference for obvious cases
const name = 'John'; // Inferred as string

// ✅ DO: Use discriminated unions for complex state
type ApiState = 
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: User[] }
  | { status: 'error'; error: string };

// ❌ DON'T: Optional flags
interface ApiState {
  isLoading?: boolean;
  data?: User[];
  error?: string;
}
```

---

## Adding New Features

### Example: Add a New Page

**Step 1: Create page structure**

```bash
# Create page directory
mkdir -p src/app/\(protected\)/my-feature
touch src/app/\(protected\)/my-feature/page.tsx
```

**Step 2: Create page component**

```tsx
// src/app/(protected)/my-feature/page.tsx

import { MyFeatureContent } from '@/components/my-feature';

export const metadata = {
  title: 'My Feature',
};

export default function MyFeaturePage() {
  return <MyFeatureContent />;
}
```

**Step 3: Create feature component**

```tsx
// src/components/my-feature/index.ts
export * from './my-feature-content';

// src/components/my-feature/my-feature-content.tsx
'use client';

export function MyFeatureContent() {
  return (
    <div>
      <h1>My Feature</h1>
      {/* Feature content */}
    </div>
  );
}
```

**Step 4: Add to navigation (sidebar)**

```tsx
// src/components/layout/sidebar.tsx

const menuItems = [
  // ... existing items
  {
    href: '/my-feature',
    label: 'My Feature',
    icon: IconComponent,
  },
];
```

### Example: Add Data Fetching with React Query

**Step 1: Create service**

```tsx
// src/services/my-feature.service.ts

import { api } from './api';

class MyFeatureService {
  async getItems(filters?: Filters): Promise<Item[]> {
    const { data } = await api.get('/my-feature', { params: filters });
    return data;
  }

  async createItem(input: CreateItemInput): Promise<Item> {
    const { data } = await api.post('/my-feature', input);
    return data;
  }

  async updateItem(id: string, input: UpdateItemInput): Promise<Item> {
    const { data } = await api.patch(`/my-feature/${id}`, input);
    return data;
  }

  async deleteItem(id: string): Promise<void> {
    await api.delete(`/my-feature/${id}`);
  }
}

export const myFeatureService = new MyFeatureService();
```

**Step 2: Create hook**

```tsx
// src/hooks/use-my-feature.ts

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { myFeatureService } from '@/services';

export function useMyFeature() {
  const queryClient = useQueryClient();

  const listQuery = useQuery({
    queryKey: ['my-feature'],
    queryFn: () => myFeatureService.getItems(),
  });

  const createMutation = useMutation({
    mutationFn: (input: CreateItemInput) =>
      myFeatureService.createItem(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-feature'] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateItemInput }) =>
      myFeatureService.updateItem(id, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-feature'] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => myFeatureService.deleteItem(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-feature'] });
    },
  });

  return {
    list: listQuery,
    createMutation,
    updateMutation,
    deleteMutation,
  };
}
```

**Step 3: Use in component**

```tsx
'use client';

import { useMyFeature } from '@/hooks';
import { Card, Table, Button } from '@/components/ui';

export function MyFeatureContent() {
  const { list, createMutation } = useMyFeature();

  if (list.isLoading) return <div>Loading...</div>;
  if (list.error) return <div>Error: {list.error.message}</div>;

  return (
    <div className="space-y-4">
      <Button onClick={() => createMutation.mutate({ /* ... */ })}>
        Create Item
      </Button>

      <Table>
        <Table.Header>
          <Table.Row>
            <Table.Head>Name</Table.Head>
            <Table.Head>Email</Table.Head>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {list.data?.map((item) => (
            <Table.Row key={item.id}>
              <Table.Cell>{item.name}</Table.Cell>
              <Table.Cell>{item.email}</Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    </div>
  );
}
```

---

## Testing

### Unit & Component Tests

Use **Vitest** for unit tests:

```tsx
// src/lib/currency-formatter.test.ts

import { describe, it, expect } from 'vitest';
import { formatCurrency } from './currency-formatter';

describe('formatCurrency', () => {
  it('should format USD correctly', () => {
    expect(formatCurrency(1000, 'USD')).toBe('$1,000.00');
  });

  it('should format negative values', () => {
    expect(formatCurrency(-500, 'USD')).toBe('-$500.00');
  });
});
```

**Run tests**:

```bash
# Run all tests
pnpm test

# Run in watch mode (rerun on changes)
pnpm test --watch

# Run specific file
pnpm test src/lib/currency-formatter.test.ts

# Coverage report
pnpm test --coverage
```

### Component Testing

```tsx
// src/components/dashboard/budget-card.test.tsx

import { render, screen } from '@testing-library/react';
import { BudgetCard } from './budget-card';

describe('BudgetCard', () => {
  it('should render budget information', () => {
    const mockData = {
      title: 'Total Budget',
      amount: 5000,
      spent: 3500,
    };

    render(<BudgetCard {...mockData} />);

    expect(screen.getByText('Total Budget')).toBeInTheDocument();
    expect(screen.getByText('$3,500.00')).toBeInTheDocument();
  });
});
```

---

## Styling & Design System

### Tailwind CSS

ChefOps uses **Tailwind CSS 4** for styling:

```tsx
// Utility classes for styling
<div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-200">
  <h2 className="text-lg font-semibold text-slate-900">Title</h2>
  <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
    Action
  </button>
</div>
```

### Color Palette

```
Primary: Blue (#0066FF / blue-600)
  - Action buttons, links, focus states

Background: Slate
  - Slate-50: Headers, tables
  - White: Main content
  - Slate-100: Dividers, subtle borders

Text: Slate
  - Slate-900: Headings
  - Slate-700: Body text
  - Slate-600: Secondary text

Danger: Red
  - Red-600: Delete buttons, error states
```

### shadcn/ui Components

Using pre-built components from [shadcn/ui](https://ui.shadcn.com/):

```tsx
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader } from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

// Use them like regular React components
<Button variant="outline">Cancel</Button>
<Card>
  <CardHeader>
    <CardTitle>Title</CardTitle>
  </CardHeader>
  <CardContent>{/* content */}</CardContent>
</Card>
```

### Custom CSS

Minimal custom CSS in `globals.css`. Keep styling in Tailwind utilities.

```css
/* src/app/globals.css */

@tailwind base;
@tailwind components;
@tailwind utilities;

/* Only global resets or component classes */
@layer base {
  html {
    @apply scroll-smooth;
  }
}
```

---

## Common Tasks

### Add a New Route

```bash
# Create page directory
mkdir -p src/app/\(protected\)/new-route

# Create page file
touch src/app/\(protected\)/new-route/page.tsx
```

### Run Type Checking

```bash
# Check TypeScript errors (without emitting JS)
pnpm type-check
```

### Format Code

```bash
# Format all files with Prettier
pnpm format
```

### Check for Unused Dependencies

```bash
# List unused packages
pnpm install # (shows unused dependencies)
```

### Build for Production

```bash
# Build and output to .next folder
pnpm build

# Start production server (locally)
pnpm start
```

---

## Troubleshooting

### "Cannot find module" errors

**Issue**: TypeScript can't resolve imports

**Solution**:
1. Restart dev server: `Ctrl+C`, then `pnpm dev`
2. Check `tsconfig.json` for path aliases (`@/` should point to `src/`)
3. Verify file exists at expected path

### API calls return 401 (Unauthorized)

**Issue**: JWT token invalid or expired

**Cause**: 
- Backend not running
- Wrong API URL in `.env.local`
- Token refresh failed

**Solution**:
```bash
# 1. Check backend is running
curl http://localhost:3000/api/health

# 2. Verify .env.local API URL
cat .env.local

# 3. Clear localStorage and login again
# Open DevTools > Application > localStorage > Clear all

# 4. Check backend logs for errors
```

### Build fails with TypeScript errors

**Issue**: `pnpm build` fails

**Solution**:
```bash
# Check for all TypeScript errors
pnpm type-check

# Fix errors in your code, then try again
pnpm build
```

### Styling not applying (Tailwind)

**Issue**: Classes don't show effect

**Cause**: Tailwind not configured for file

**Solution**:
```bash
# Restart dev server (Tailwind needs to recompile)
# Ctrl+C, then pnpm dev
```

### Environment variable not recognized

**Issue**: `process.env.NEXT_PUBLIC_API_URL` is undefined

**Cause**: 
- Variable not in `.env.local`
- Doesn't have `NEXT_PUBLIC_` prefix
- Dev server not restarted after adding it

**Solution**:
```bash
# 1. Check .env.local exists
cat .env.local

# 2. Verify NEXT_PUBLIC_ prefix
# NEXT_PUBLIC_API_URL=...

# 3. Restart dev server
# Ctrl+C, then pnpm dev
```

### React Query cache not updating

**Issue**: After mutation, data still shows old values

**Cause**: Cache not invalidated after mutation

**Solution**:
```tsx
// In hook, ensure invalidation on success:
const mutation = useMutation({
  mutationFn: (input) => myService.create(input),
  onSuccess: () => {
    // Invalidate cache to force refetch
    queryClient.invalidateQueries({ queryKey: ['my-feature'] });
  },
});
```

---

## Deployment

### Deploy to Vercel (Frontend)

Frontend is deployed on **Vercel** automatically on push to `main`:

```bash
# Just push to main, Vercel handles the rest
git push origin main

# View deployments: https://vercel.com/dashboard
```

**Environment variables on Vercel**:
1. Go to [Vercel Dashboard](https://vercel.com)
2. Select `catering-frontend` project
3. Settings → Environment Variables
4. Add `NEXT_PUBLIC_API_URL` pointing to production API

### Verify Production Deployment

```bash
# Frontend
https://catering-frontend-two.vercel.app

# Swagger docs
https://catering-api-production.up.railway.app/docs
```

---

**Last Updated**: February 2026  
**Version**: 1.0 (Master's Thesis Edition)
