# Frontend Components Documentation
## UI Components, Feature Components, and Usage Examples

---

## Table of Contents

1. [Overview](#overview)
2. [UI Components (shadcn/ui)](#ui-components-shadcnui)
3. [Feature Components](#feature-components)
4. [Layout Components](#layout-components)
5. [Component Patterns](#component-patterns)
6. [Styling Components](#styling-components)
7. [Form Components](#form-components)
8. [Data Display Components](#data-display-components)

---

## Overview

The component library is organized into three layers:

1. **UI Components** - Primitive, reusable components (buttons, dialogs, cards)
2. **Feature Components** - Domain-specific components (contracts, users, companies)
3. **Layout Components** - Structural components (sidebar, breadcrumbs)

All components follow consistent patterns:
- ✅ TypeScript with explicit props
- ✅ Client/Server component designation
- ✅ Consistent naming
- ✅ Accessibility built-in (via shadcn/ui)
- ✅ Responsive design with Tailwind

---

## UI Components (shadcn/ui)

These are base components from [shadcn/ui](https://ui.shadcn.com/). They're minimal, unstyled, and highly customizable.

### Button

```tsx
import { Button } from '@/components/ui/button';

// Basic button
<Button>Click me</Button>

// Variants
<Button variant="outline">Outline</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="destructive">Delete</Button>

// Sizes
<Button size="sm">Small</Button>
<Button size="lg">Large</Button>

// Disabled
<Button disabled>Disabled</Button>

// Loading state (common pattern)
<Button disabled={isLoading}>
  {isLoading ? 'Saving...' : 'Save'}
</Button>
```

### Dialog

Modal dialog for user actions:

```tsx
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { useState } from 'react';

export function CreateUserDialog() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create User</DialogTitle>
          <DialogDescription>
            Fill in the form below to create a new user.
          </DialogDescription>
        </DialogHeader>

        {/* Form content */}

        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleCreate}>Create</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
```

### Card

Container component for grouping content:

```tsx
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

<Card>
  <CardHeader>
    <CardTitle>Title</CardTitle>
    <CardDescription>Optional subtitle</CardDescription>
  </CardHeader>
  <CardContent>
    Card content goes here
  </CardContent>
</Card>
```

### Table

Data table component:

```tsx
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

<Table>
  <TableHeader>
    <TableRow>
      <TableHead>Name</TableHead>
      <TableHead>Email</TableHead>
      <TableHead className="text-right">Amount</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    {items.map((item) => (
      <TableRow key={item.id}>
        <TableCell>{item.name}</TableCell>
        <TableCell>{item.email}</TableCell>
        <TableCell className="text-right">{item.amount}</TableCell>
      </TableRow>
    ))}
  </TableBody>
</Table>
```

### Form

Built on React Hook Form:

```tsx
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { createUserSchema } from '@/lib/validations/users';

export function UserForm() {
  const form = useForm({
    resolver: zodResolver(createUserSchema),
  });

  const onSubmit = (data) => {
    console.log(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="John Doe" {...field} />
              </FormControl>
              <FormDescription>Your full name</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}
```

### Input

Text input field:

```tsx
import { Input } from '@/components/ui/input';

<Input
  type="text"
  placeholder="Enter text"
  value={value}
  onChange={(e) => setValue(e.target.value)}
/>

// Types: text, email, password, number, date, etc.
<Input type="email" placeholder="user@example.com" />
<Input type="password" placeholder="Enter password" />
<Input type="number" placeholder="0" />
```

### Select

Dropdown select component:

```tsx
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

<Select value={value} onValueChange={setValue}>
  <SelectTrigger>
    <SelectValue placeholder="Select option" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="option1">Option 1</SelectItem>
    <SelectItem value="option2">Option 2</SelectItem>
    <SelectItem value="option3">Option 3</SelectItem>
  </SelectContent>
</Select>
```

### Badge

Small tag/label component:

```tsx
import { Badge } from '@/components/ui/badge';

<Badge>Active</Badge>
<Badge variant="outline">Pending</Badge>
<Badge variant="destructive">Cancelled</Badge>
```

### Checkbox

Boolean toggle:

```tsx
import { Checkbox } from '@/components/ui/checkbox';

<Checkbox
  checked={isChecked}
  onCheckedChange={setIsChecked}
/>

// With label
<div className="flex items-center space-x-2">
  <Checkbox id="agree" />
  <label htmlFor="agree">I agree to terms</label>
</div>
```

### Alert Dialog

Confirmation dialog:

```tsx
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';

<AlertDialog>
  <AlertDialogTrigger asChild>
    <Button variant="destructive">Delete</Button>
  </AlertDialogTrigger>
  <AlertDialogContent>
    <AlertDialogHeader>
      <AlertDialogTitle>Delete User?</AlertDialogTitle>
      <AlertDialogDescription>
        This action cannot be undone.
      </AlertDialogDescription>
    </AlertDialogHeader>
    <AlertDialogCancel>Cancel</AlertDialogCancel>
    <AlertDialogAction onClick={handleDelete} className="bg-red-600">
      Delete
    </AlertDialogAction>
  </AlertDialogContent>
</AlertDialog>
```

### Skeleton

Loading placeholder:

```tsx
import { Skeleton } from '@/components/ui/skeleton';

// While loading
{isLoading ? (
  <div className="space-y-2">
    <Skeleton className="h-4 w-full" />
    <Skeleton className="h-4 w-3/4" />
  </div>
) : (
  <p>{data}</p>
)}
```

### Progress

Progress bar:

```tsx
import { Progress } from '@/components/ui/progress';

<Progress value={75} className="w-full" />
```

### Tabs

Tabbed interface:

```tsx
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

<Tabs defaultValue="tab1">
  <TabsList>
    <TabsTrigger value="tab1">Tab 1</TabsTrigger>
    <TabsTrigger value="tab2">Tab 2</TabsTrigger>
  </TabsList>
  <TabsContent value="tab1">Content for tab 1</TabsContent>
  <TabsContent value="tab2">Content for tab 2</TabsContent>
</Tabs>
```

### Dropdown Menu

Context menu:

```tsx
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

<DropdownMenu>
  <DropdownMenuTrigger asChild>
    <Button variant="ghost">Menu</Button>
  </DropdownMenuTrigger>
  <DropdownMenuContent>
    <DropdownMenuLabel>Actions</DropdownMenuLabel>
    <DropdownMenuItem onClick={handleEdit}>Edit</DropdownMenuItem>
    <DropdownMenuItem onClick={handleDelete}>Delete</DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>
```

---

## Feature Components

Domain-specific components combining UI components with business logic.

### CreateContractDialog

Creates a new catering contract:

```tsx
import { CreateContractDialog } from '@/components/contracts/create-contract-dialog';
import { useState } from 'react';

export function ContractsPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <div>
      <Button onClick={() => setIsDialogOpen(true)}>
        Create Contract
      </Button>
      <CreateContractDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
      />
    </div>
  );
}
```

**Features**:
- Select catering company and client company
- Validation with Zod
- Automatic cache invalidation on submit
- Error handling and toast notifications

### UserFormDialog

Create or edit user/employee:

```tsx
import { UserFormDialog } from '@/components/users/user-form-dialog';

<UserFormDialog
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  defaultValues={existingUser} // optional, for edit mode
/>
```

**Features**:
- Form validation
- Role selection (ADMIN, MANAGER, EMPLOYEE)
- Status toggle
- Create or update modes

### CateringFormDialog & ClientFormDialog

Create or edit companies:

```tsx
import { CateringFormDialog } from '@/components/companies/catering-form-dialog';

<CateringFormDialog
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  defaultValues={existingCatering} // optional
/>
```

---

## Layout Components

### Sidebar

Main navigation sidebar:

```tsx
import { Sidebar } from '@/components/layout/sidebar';

// Used in protected layout
export default function ProtectedLayout({ children }) {
  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1">
        {children}
      </main>
    </div>
  );
}
```

**Features**:
- Navigation links
- Active route highlighting
- User info display
- Company type indicator
- Logout button

### Breadcrumbs

Page navigation breadcrumbs:

```tsx
import { Breadcrumbs } from '@/components/layout/breadcrumbs';

// Auto-generated from URL
export default function Page() {
  return (
    <div>
      <Breadcrumbs /> {/* Generates: Dashboard > Contracts > Details */}
      <h1>Contract Details</h1>
    </div>
  );
}
```

**Features**:
- Auto-generated from Next.js route
- Links to parent pages
- Current page as plain text

---

## Component Patterns

### Loading State Pattern

```tsx
export function MyComponent() {
  const { data, isLoading, error } = useMyData();

  if (isLoading) return <LoadingSkeleton />;
  if (error) return <ErrorState error={error} />;
  if (!data) return <EmptyState />;

  return <div>{/* render data */}</div>;
}
```

### Modal Pattern

```tsx
export function MyDialog({ isOpen, onClose }) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      await submitAction();
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Title</DialogTitle>
        </DialogHeader>
        {/* Content */}
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : 'Save'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
```

### Conditional Rendering Pattern

```tsx
// ✅ DO: Use discriminated unions
type State = 
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: Data[] }
  | { status: 'error'; error: Error };

function render(state: State) {
  if (state.status === 'loading') return <Spinner />;
  if (state.status === 'error') return <Error error={state.error} />;
  if (state.status === 'success') return <List items={state.data} />;
  return null;
}

// ❌ DON'T: Optional flags
function render(props: { isLoading?: boolean; data?: Data[]; error?: Error }) {
  // Hard to reason about valid combinations
}
```

---

## Styling Components

### Utility Class Patterns

```tsx
// Container with consistent padding
<div className="container mx-auto px-4 py-8">
  {/* content */}
</div>

// Card with hover effect
<div className="bg-white rounded-lg border border-slate-200 shadow-sm hover:shadow-md transition-shadow p-4">
  {/* content */}
</div>

// Flexbox row with spacing
<div className="flex items-center justify-between gap-4">
  <div>Left</div>
  <div>Right</div>
</div>

// Responsive grid
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  {items.map((item) => <Card key={item.id} {...item} />)}
</div>

// Status badge
<span className="inline-flex items-center px-3 py-1 text-sm font-medium rounded-full bg-blue-100 text-blue-700">
  Active
</span>
```

### Colors

Primary brand colors:

```
Blue-600: #0066FF (primary actions, links)
Blue-50: #F0F7FF (hover states)
Slate-50: #F8FAFC (backgrounds, headers)
Slate-100: #E2E8F0 (borders, dividers)
Slate-200: #CBD5E1 (card borders)
Slate-600: #475569 (secondary text)
Slate-700: #334155 (body text)
Slate-900: #0F172A (headings)
Red-600: #DC2626 (danger, delete)
```

### Responsive Design

Mobile-first approach:

```tsx
// Mobile (base), Tablet (md:), Desktop (lg:)
<div className="px-4 md:px-6 lg:px-8">
  {/* padding increases on larger screens */}
</div>

<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
  {/* 1 column on mobile, 2 on tablet, 3 on desktop */}
</div>

<div className="text-sm md:text-base lg:text-lg">
  {/* text size increases on larger screens */}
</div>
```

---

## Form Components

### Example: Complete Form

```tsx
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createContractSchema } from '@/lib/validations/contract';
import { useContracts } from '@/hooks';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';

export function CreateContractForm() {
  const { data: caterings } = useCaterings().list;
  const { data: clients } = useClients().list;
  const { mutateAsync: createContract, isPending } = useContracts().createMutation;

  const form = useForm({
    resolver: zodResolver(createContractSchema),
    defaultValues: {
      cateringId: '',
      clientId: '',
    },
  });

  const onSubmit = async (data) => {
    await createContract(data);
    form.reset();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="cateringId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Catering Company</FormLabel>
              <Select value={field.value} onValueChange={field.onChange}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select catering" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {caterings?.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="clientId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Client Company</FormLabel>
              <Select value={field.value} onValueChange={field.onChange}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select client" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {clients?.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isPending}>
          {isPending ? 'Creating...' : 'Create Contract'}
        </Button>
      </form>
    </Form>
  );
}
```

---

## Data Display Components

### Dashboard KPIs Grid

```tsx
import { KpisGrid } from '@/components/dashboard/kpis-grid';

<KpisGrid
  kpis={[
    { label: 'Total Contracts', value: 42, change: '+5%' },
    { label: 'Active Services', value: 12, change: '-2%' },
    { label: 'Budget Spent', value: '$45,000', change: '+15%' },
    { label: 'Deviations', value: 3, change: 'warning' },
  ]}
/>
```

### Recent Services Table

```tsx
import { RecentServicesTable } from '@/components/dashboard/recent-services-table';

<RecentServicesTable
  services={services}
  onServiceClick={(service) => {
    // Handle click
  }}
/>
```

### Budget Card

```tsx
import { BudgetCard } from '@/components/dashboard/budget-card';

<BudgetCard
  title="Q1 Budget"
  budgeted={100000}
  spent={65000}
  remaining={35000}
/>
```

---

## Common Component Tasks

### Add a new component to shadcn

```bash
# Install from shadcn/ui
npx shadcn-ui@latest add component-name

# Example
npx shadcn-ui@latest add tabs
```

### Create a feature component

```tsx
// 1. Create file
touch src/components/features/my-feature.tsx

// 2. Structure:
'use client';

import { useState } from 'react';
import { useMyHook } from '@/hooks';
import { Card, Button } from '@/components/ui';

interface MyFeatureProps {
  id: string;
}

export function MyFeature({ id }: MyFeatureProps) {
  const { data, isLoading } = useMyHook(id);

  if (isLoading) return <div>Loading...</div>;

  return (
    <Card>
      {/* Component content */}
    </Card>
  );
}
```

---

**Last Updated**: February 2026  
**Version**: 1.0 (Master's Thesis Edition)
