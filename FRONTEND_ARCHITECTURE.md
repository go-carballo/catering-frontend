# Frontend Architecture
## Next.js 15, React 19, and State Management Design

---

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Technology Stack](#technology-stack)
3. [Project Structure](#project-structure)
4. [Data Flow & State Management](#data-flow--state-management)
5. [Authentication Flow](#authentication-flow)
6. [Component Architecture](#component-architecture)
7. [Service Layer](#service-layer)
8. [Hooks & Custom Logic](#hooks--custom-logic)
9. [Type System](#type-system)
10. [Performance Optimizations](#performance-optimizations)

---

## Architecture Overview

ChefOps frontend follows a **layered architecture** with clear separation of concerns:

```
┌─────────────────────────────────────────────────────────────┐
│                    Pages (Next.js App Router)               │
│           (Presentation Layer - thin wrapper)               │
└────────────────────┬────────────────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────────────────┐
│                    Components Layer                          │
│  ┌──────────┬──────────┬──────────┬──────────────────────┐  │
│  │   UI     │ Feature  │  Layout  │   Dialog/Modal       │  │
│  │Components│Components│Components│   Components         │  │
│  └──────────┴──────────┴──────────┴──────────────────────┘  │
└────────────────────┬────────────────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────────────────┐
│              Hooks Layer (React Query + Custom)              │
│  ┌──────────────┬──────────────┬──────────────────────────┐ │
│  │ React Query  │ Custom Hooks │ Session/Auth Hooks       │ │
│  │ (useUsers,   │ (useSession) │ (useSessionTimeout)      │ │
│  │  useContracts│              │                          │ │
│  │  etc)        │              │                          │ │
│  └──────────────┴──────────────┴──────────────────────────┘ │
└────────────────────┬────────────────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────────────────┐
│                  Service Layer                               │
│  ┌──────────────┬──────────┬──────────┬───────────────────┐ │
│  │ Auth Service │ Contract │ Catering │ User Service      │ │
│  │              │ Service  │ Service  │                   │ │
│  │              │ Clients  │ Service  │ Finance Metrics   │ │
│  │              │ Service  │ Reports  │                   │ │
│  └──────────────┴──────────┴──────────┴───────────────────┘ │
└────────────────────┬────────────────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────────────────┐
│                  API Client (Axios)                          │
│            (Backend: Railway Production / Localhost)          │
└─────────────────────────────────────────────────────────────┘
```

---

## Technology Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Framework** | Next.js 15 (App Router) | Server-side rendering, API routes, file-based routing |
| **UI Library** | React 19 | Component framework with latest hooks |
| **Language** | TypeScript 5 | Type safety across the entire stack |
| **Styling** | Tailwind CSS 4 | Utility-first CSS for consistent design |
| **Components** | shadcn/ui | Pre-built, accessible React components |
| **State** | TanStack Query (React Query) | Server state management and caching |
| **Forms** | React Hook Form | Lightweight form state management |
| **Validation** | Zod | Type-safe runtime validation |
| **HTTP Client** | Axios | API requests with interceptors |
| **Toasts** | Sonner | Toast notifications |
| **Package Manager** | pnpm | Fast, efficient dependency management |
| **Testing** | Vitest | Unit and component testing |

---

## Project Structure

```
src/
├── app/                                 # Next.js App Router (Pages)
│   ├── api/                            # API routes (not used - backend is external)
│   ├── layout.tsx                      # Root layout
│   ├── page.tsx                        # Home/login redirect
│   ├── globals.css                     # Global styles
│   ├── login/
│   │   └── page.tsx                    # Login page
│   ├── forgot-password/
│   │   └── page.tsx                    # Forgot password page
│   ├── reset-password/
│   │   └── page.tsx                    # Password reset page
│   └── (protected)/                    # Authenticated routes (layout wrapper)
│       ├── layout.tsx                  # Protected layout (Sidebar + Breadcrumbs)
│       ├── error.tsx                   # Error boundary
│       ├── dashboard/
│       │   └── page.tsx                # Dashboard (KPIs, recent services)
│       ├── contracts/
│       │   └── page.tsx                # Contracts list/CRUD
│       ├── service-days/
│       │   └── page.tsx                # Service days (scheduling/confirmation)
│       ├── companies/
│       │   └── page.tsx                # Companies management
│       └── users/
│           └── page.tsx                # Users/employees management
│
├── components/                         # Reusable React components
│   ├── ui/                            # Primitive UI components (shadcn/ui)
│   │   ├── button.tsx
│   │   ├── dialog.tsx
│   │   ├── card.tsx
│   │   ├── table.tsx
│   │   ├── form.tsx
│   │   └── ... (20+ components)
│   │
│   ├── layout/                        # Layout components
│   │   ├── sidebar.tsx                # Navigation sidebar
│   │   ├── breadcrumbs.tsx            # Breadcrumb navigation
│   │   └── index.ts
│   │
│   ├── dashboard/                    # Dashboard-specific components
│   │   ├── kpis-grid.tsx             # Key performance indicators
│   │   ├── budget-card.tsx           # Budget visualization
│   │   ├── recent-services-table.tsx # Recent services table
│   │   ├── deviation-alert.tsx       # Budget deviation warnings
│   │   ├── catering-home.tsx         # Catering-specific dashboard
│   │   ├── empty-state.tsx           # No data state
│   │   ├── error-state.tsx           # Error state
│   │   ├── loading-skeleton.tsx      # Loading skeleton
│   │   └── index.ts
│   │
│   ├── contracts/                    # Contract-related components
│   │   └── create-contract-dialog.tsx # Contract creation modal
│   │
│   ├── companies/                    # Company management components
│   │   ├── catering-form-dialog.tsx  # Catering company form
│   │   └── client-form-dialog.tsx    # Client company form
│   │
│   ├── users/                        # User management components
│   │   └── user-form-dialog.tsx      # User creation/edit form
│   │
│   └── auth/                         # Authentication components
│       ├── session-warning-modal.tsx # Session timeout warning
│       └── change-password-dialog.tsx # Password change form
│
├── hooks/                            # Custom React hooks
│   ├── use-contracts.ts              # Contract data fetching & mutations
│   ├── use-caterings.ts              # Catering company data
│   ├── use-clients.ts                # Client company data
│   ├── use-users.ts                  # User/employee data
│   ├── use-service-days.ts           # Service day data & scheduling
│   ├── use-finance-metrics.ts        # Financial KPIs
│   ├── use-session-timeout.ts        # Session timeout management
│   └── index.ts
│
├── services/                         # Service layer (API communication)
│   ├── api.ts                        # Axios instance with interceptors
│   ├── auth.service.ts               # Authentication & JWT token management
│   ├── contracts.service.ts          # Contract API calls
│   ├── caterings.service.ts          # Catering company API calls
│   ├── clients.service.ts            # Client company API calls
│   ├── users.service.ts              # User/employee API calls
│   ├── service-days.service.ts       # Service day API calls
│   ├── reports.service.ts            # Report generation API calls
│   ├── change-password.service.ts    # Password change API calls
│   ├── reset-password.service.ts     # Password reset API calls
│   └── index.ts
│
├── types/                            # TypeScript type definitions
│   ├── api.ts                        # API response/request types
│   ├── auth.ts                       # Authentication types
│   ├── contract.ts                   # Contract types
│   ├── service-day.ts                # Service day types
│   ├── users.ts                      # User types
│   ├── finance-metrics.ts            # Financial metrics types
│   ├── change-password.ts            # Password change types
│   ├── reset-password.ts             # Password reset types
│   └── index.ts
│
├── lib/                              # Utility functions
│   ├── utils.ts                      # General utilities (cn, etc)
│   ├── currency-formatter.ts         # Currency formatting
│   ├── currency-formatter.test.ts    # Tests
│   ├── date-formatter.ts             # Date formatting
│   ├── date-formatter.test.ts        # Tests
│   ├── formatters.ts                 # General formatters
│   ├── pdf-generator.ts              # PDF export functionality
│   └── validations/                  # Zod validation schemas
│       ├── contract.ts
│       ├── catering.ts
│       ├── client.ts
│       └── users.ts
│
├── providers/                        # React Context providers
│   ├── auth-provider.tsx             # Authentication context (JWT, user info)
│   ├── query-provider.tsx            # React Query provider
│   └── index.ts
│
├── middleware.ts                     # Next.js middleware (auth checks)
└── config/
    └── env.ts                        # Environment variables
```

---

## Data Flow & State Management

### State Management Strategy

**Server State (Data from Backend)**
- **Tool**: TanStack Query (React Query)
- **Purpose**: Caching, synchronization, automatic refetch
- **Example**:
  ```tsx
  // In hook
  const { data: contracts, isLoading } = useQuery({
    queryKey: ['contracts'],
    queryFn: () => contractService.getContracts()
  });
  ```
- **Benefits**:
  - Automatic deduplication
  - Background refetching
  - Stale-while-revalidate pattern
  - Request cancellation on unmount

**UI State (Local Component State)**
- **Tool**: React `useState` (component-level)
- **Purpose**: Dialog open/close, form inputs, pagination
- **Example**:
  ```tsx
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [filters, setFilters] = useState({ status: 'ALL' });
  ```

**Global UI State (Theme, Auth)**
- **Tool**: React Context
- **Purpose**: Authentication state, user info
- **Examples**:
  - `AuthProvider` - JWT token, user company, permissions
  - `QueryProvider` - React Query configuration

**Form State**
- **Tool**: React Hook Form + Zod
- **Purpose**: Form input management with validation
- **Example**:
  ```tsx
  const form = useForm({
    resolver: zodResolver(createContractSchema),
    defaultValues: { ... }
  });
  ```

### Data Flow Example: Creating a Contract

```
1. User fills form in CreateContractDialog
   ↓
2. React Hook Form manages input state
   ↓
3. User clicks "Create"
   ↓
4. Form validation (Zod schema)
   ↓
5. If valid: POST /api/contracts with form data
   ↓
6. API call goes through axios interceptor (adds JWT token)
   ↓
7. Backend returns contract object
   ↓
8. React Query invalidates 'contracts' cache
   ↓
9. useContracts hook refetches data
   ↓
10. Component re-renders with new contract
    ↓
11. Toast notification: "Contract created successfully"
    ↓
12. Dialog closes, form resets
```

---

## Authentication Flow

### Login Process

```
1. User enters email/password on /login page
   ↓
2. AuthService.login() calls POST /api/auth/login
   ↓
3. Backend returns { accessToken, refreshToken, user }
   ↓
4. AuthService stores tokens in localStorage
   ↓
5. AuthProvider updates context with user info
   ↓
6. Middleware checks auth on protected routes
   ↓
7. If valid: redirect to /dashboard
   ↓
8. If invalid/expired: redirect to /login
```

### Token Management

**Access Token**
- Short-lived (15 minutes typical)
- Sent in `Authorization: Bearer <token>` header
- Stored in localStorage

**Refresh Token**
- Long-lived (7 days typical)
- Stored in localStorage
- Used to get new access token when expired

**Axios Interceptor** (`api.ts`)
```tsx
// Request interceptor: Adds JWT to headers
api.interceptors.request.use((config) => {
  const token = authService.getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor: Handles 401, refreshes token
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Try refresh token
      const refreshed = await authService.refreshToken();
      if (refreshed) {
        // Retry original request
        return api.request(error.config);
      } else {
        // Redirect to login
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);
```

### Session Timeout

**useSessionTimeout Hook**
- Monitors user inactivity (keyboard, mouse events)
- Shows warning modal after 10 minutes of inactivity
- Auto-logs out after 15 minutes
- Resets timer on user activity
- Configured in protected layout

---

## Component Architecture

### Component Classification

**Presentation Components** (Pure, no hooks except useState)
- `Button`, `Card`, `Dialog`, `Badge`, `Table`
- Props: styling, content, onClick handlers
- No business logic
- Location: `components/ui/`

**Feature Components** (Business logic, multiple hooks)
- `CreateContractDialog`, `UserFormDialog`, `BudgetCard`
- Use custom hooks for data
- Handle user interactions
- Location: `components/{feature}/`

**Layout Components** (Structural)
- `Sidebar`, `Breadcrumbs`, `ProtectedLayout`
- Wrap content, provide navigation
- Location: `components/layout/`

**Page Components** (Next.js pages)
- `app/*/page.tsx`
- Thin wrapper - mostly delegate to feature components
- Set up layout and metadata

### Example Component Structure

```tsx
// components/contracts/create-contract-dialog.tsx

'use client'; // Client component (uses hooks)

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { useContracts } from '@/hooks';
import { createContractSchema } from '@/lib/validations';
import { Dialog, Button, Form } from '@/components/ui';

interface CreateContractDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CreateContractDialog({
  isOpen,
  onClose,
}: CreateContractDialogProps) {
  const { mutateAsync: createContract, isPending } = useContracts().createMutation;
  const form = useForm({
    resolver: zodResolver(createContractSchema),
  });

  const onSubmit = async (data: CreateContractInput) => {
    await createContract(data);
    form.reset();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <Dialog.Content>
        <Dialog.Header>
          <Dialog.Title>Create Contract</Dialog.Title>
        </Dialog.Header>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            {/* Form fields */}
            <Button type="submit" disabled={isPending}>
              {isPending ? 'Creating...' : 'Create'}
            </Button>
          </form>
        </Form>
      </Dialog.Content>
    </Dialog>
  );
}
```

---

## Service Layer

### Purpose

Encapsulates all API communication. Each service is responsible for one domain:

### Services Overview

| Service | Responsibility |
|---------|-----------------|
| `auth.service.ts` | Login, logout, token management, password reset |
| `contracts.service.ts` | Contract CRUD, list, details |
| `caterings.service.ts` | Catering company CRUD |
| `clients.service.ts` | Client company CRUD |
| `users.service.ts` | User/employee CRUD |
| `service-days.service.ts` | Service day CRUD, confirm/schedule |
| `reports.service.ts` | Report generation (PDF, JSON) |
| `finance-metrics.service.ts` | KPIs, budgets, deviations |

### Service Example

```tsx
// services/contracts.service.ts

import { api } from './api';
import { Contract, CreateContractInput, UpdateContractInput } from '@/types';

class ContractService {
  async getContracts(filters?: ContractFilters): Promise<Contract[]> {
    const { data } = await api.get('/contracts', { params: filters });
    return data;
  }

  async getContractById(id: string): Promise<Contract> {
    const { data } = await api.get(`/contracts/${id}`);
    return data;
  }

  async createContract(input: CreateContractInput): Promise<Contract> {
    const { data } = await api.post('/contracts', input);
    return data;
  }

  async updateContract(id: string, input: UpdateContractInput): Promise<Contract> {
    const { data } = await api.patch(`/contracts/${id}`, input);
    return data;
  }

  async deleteContract(id: string): Promise<void> {
    await api.delete(`/contracts/${id}`);
  }
}

export const contractService = new ContractService();
```

### API Client Configuration (`api.ts`)

```tsx
import axios from 'axios';
import { authService } from './auth.service';

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor: Add JWT token
api.interceptors.request.use((config) => {
  const token = authService.getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor: Handle errors & refresh token
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        await authService.refreshToken();
        return api(originalRequest);
      } catch {
        authService.logout();
        window.location.href = '/login';
      }
    }

    return Promise.reject(error);
  }
);
```

---

## Hooks & Custom Logic

### React Query Hooks (Server State)

All custom hooks use TanStack Query for server state management.

**Pattern**:
```tsx
export function useContracts() {
  return {
    // Read: useQuery
    list: useQuery({
      queryKey: ['contracts'],
      queryFn: () => contractService.getContracts(),
    }),
    
    // Write: useMutation
    createMutation: useMutation({
      mutationFn: (input) => contractService.createContract(input),
      onSuccess: () => {
        // Invalidate list cache
        queryClient.invalidateQueries({ queryKey: ['contracts'] });
      },
    }),
  };
}
```

### useSessionTimeout (Custom Hook)

Manages session timeout and inactivity:

```tsx
// hooks/use-session-timeout.ts

export function useSessionTimeout() {
  const [timeoutWarning, setTimeoutWarning] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout>();
  const warningRef = useRef<NodeJS.Timeout>();

  const resetTimeout = useCallback(() => {
    clearTimeout(timeoutRef.current);
    clearTimeout(warningRef.current);
    setTimeoutWarning(false);

    // Show warning after 10 minutes of inactivity
    warningRef.current = setTimeout(() => {
      setTimeoutWarning(true);
    }, 10 * 60 * 1000);

    // Auto-logout after 15 minutes
    timeoutRef.current = setTimeout(() => {
      authService.logout();
      window.location.href = '/login';
    }, 15 * 60 * 1000);
  }, []);

  useEffect(() => {
    resetTimeout();
    window.addEventListener('mousemove', resetTimeout);
    window.addEventListener('keypress', resetTimeout);

    return () => {
      window.removeEventListener('mousemove', resetTimeout);
      window.removeEventListener('keypress', resetTimeout);
    };
  }, [resetTimeout]);

  return { timeoutWarning, setTimeoutWarning };
}
```

---

## Type System

### Strategy

- **All external data** typed: API responses, props, etc.
- **No `any`**: Strict TypeScript mode
- **Discriminated unions** for complex states
- **Type inference** for obvious cases

### Type Organization

```
types/
├── api.ts           # API request/response types
├── auth.ts          # Auth-related types
├── contract.ts      # Contract domain types
├── users.ts         # User/employee types
├── service-day.ts   # Service day types
└── index.ts         # Re-exports all types
```

### Example Types

```tsx
// types/contract.ts

export enum ContractStatus {
  PENDING = 'PENDING',
  ACTIVE = 'ACTIVE',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

export interface Contract {
  id: string;
  cateringId: string;
  clientId: string;
  status: ContractStatus;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateContractInput {
  cateringId: string;
  clientId: string;
}

export interface UpdateContractInput {
  status?: ContractStatus;
}
```

---

## Performance Optimizations

### React Query Caching

- **Stale time**: 5 minutes (data considered fresh)
- **Cache time**: 10 minutes (cached data kept in memory)
- **Automatic invalidation**: On mutations
- **Background refetch**: When tab regains focus

### Code Splitting

- Each page route is automatically code-split by Next.js
- Lazy loading for heavy components (e.g., PDF generators)

### Image Optimization

- Using Next.js `Image` component for all images
- Automatic format conversion (WebP)
- Responsive sizing

### Bundle Size

- Tree-shaking enabled
- Minimal dependencies
- No unused shadcn/ui components included

### Rendering Optimization

- **Server Components** by default (fast rendering, reduced JS)
- **Client Components** only where needed (interactions, hooks)
- **Memo** for expensive components
- **useCallback** for callbacks passed to memoized components

---

## Key Design Decisions

### Why Next.js App Router (not Pages Router)?

- ✅ Server Components reduce JS bundle
- ✅ Better code organization
- ✅ Improved performance with streaming
- ✅ Built-in layouts for shared UI

### Why TanStack Query (not Redux)?

- ✅ Server state ≠ UI state (Query is better)
- ✅ Built-in caching & synchronization
- ✅ Less boilerplate
- ✅ Automatic background refetch

### Why Zod (not other validators)?

- ✅ TypeScript-first
- ✅ Small bundle size
- ✅ Works at runtime (not just type-checking)
- ✅ Good error messages

### Why shadcn/ui (not Material-UI)?

- ✅ Headless, highly customizable
- ✅ Small bundle size
- ✅ Copy-paste, not dependency (easier to customize)
- ✅ Great accessibility defaults

---

## Debugging & Development

### Common Patterns

**Check React Query state**:
```tsx
import { useQueryClient } from '@tanstack/react-query';

const queryClient = useQueryClient();
console.log(queryClient.getQueryData(['contracts']));
```

**View all active queries**:
```tsx
// Install @tanstack/react-query-devtools
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

// Add to layout
<QueryProvider>
  <ReactQueryDevtools initialIsOpen={false} />
</QueryProvider>
```

**Mock API responses (testing)**:
```tsx
vi.mock('@/services/contracts.service', () => ({
  contractService: {
    getContracts: vi.fn().mockResolvedValue([
      { id: '1', name: 'Test Contract' }
    ])
  }
}));
```

---

**Last Updated**: February 2026  
**Version**: 1.0 (Master's Thesis Edition)
