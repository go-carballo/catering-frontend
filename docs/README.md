# ChefOps Frontend Documentation Index

Welcome to the ChefOps frontend documentation. This is the UI layer of the Master's thesis project.

---

## 📚 Start Here

### [ARCHITECTURE.md](../ARCHITECTURE.md)
Deep dive into the frontend system design:
- Next.js App Router structure and layers
- React 19 component patterns
- TanStack Query for state management
- Authentication and token management
- Service layer and API integration
- Type system and TypeScript patterns
- Performance optimizations
- Debugging strategies

**For**: Thesis evaluators, architects, developers understanding the system

---

## 👨‍💻 Development

### [DEVELOPMENT_GUIDE.md](../DEVELOPMENT_GUIDE.md)
Getting started and development workflows:
- Quick start (one-command setup)
- Prerequisites and environment setup
- Development workflow (branching, committing)
- Code conventions (naming, structure, TypeScript)
- Adding new features (pages, data fetching, services)
- Testing with Vitest
- Styling with Tailwind CSS
- Common tasks and troubleshooting
- Production deployment

**For**: Developers, contributors, DevOps engineers

---

## 🎨 Components & Patterns

### [COMPONENTS_DOCUMENTATION.md](../COMPONENTS_DOCUMENTATION.md)
Complete component library and usage:
- UI Components from shadcn/ui (Button, Dialog, Card, Table, etc.)
- Feature Components (CreateContractDialog, UserFormDialog, etc.)
- Layout Components (Sidebar, Breadcrumbs)
- Component patterns (loading states, modals, forms)
- Styling patterns and Tailwind utilities
- Form handling with React Hook Form + Zod
- Data display components (KPIs, tables, charts)

**For**: Developers building features, designers reviewing components

---

## 🔍 Additional Resources

### [SESSION_SUMMARY.md](session-summary.md)
Development session notes and progress tracking. Documents what was implemented when.

---

## 📋 Quick Navigation by Role

### For Thesis Evaluators
1. Read: Main [README.md](../README.md) - Overview
2. Understand: [ARCHITECTURE.md](../ARCHITECTURE.md) - Design & patterns
3. Dive deep: [COMPONENTS_DOCUMENTATION.md](../COMPONENTS_DOCUMENTATION.md) - Implementation details
4. Check out: Backend [MASTER_THESIS.md](../../catering-api/MASTER_THESIS.md) - Full context

### For Developers
1. Setup: [DEVELOPMENT_GUIDE.md](../DEVELOPMENT_GUIDE.md) - Get running locally
2. Learn: [ARCHITECTURE.md](../ARCHITECTURE.md) - Understand the structure
3. Build: [COMPONENTS_DOCUMENTATION.md](../COMPONENTS_DOCUMENTATION.md) - Use existing components
4. Code: Follow conventions in [DEVELOPMENT_GUIDE.md](../DEVELOPMENT_GUIDE.md) - Code style

### For DevOps/Ops
1. Deployment: [DEVELOPMENT_GUIDE.md](../DEVELOPMENT_GUIDE.md#deployment) - Vercel setup
2. Environment: See `.env.example` in root - API configuration
3. Scripts: [DEVELOPMENT_GUIDE.md](../DEVELOPMENT_GUIDE.md#scripts) - Available commands
4. Monitoring: Monitor Vercel dashboard for deploys and errors

---

## 📊 Frontend Stats

- **Framework**: Next.js 15 (App Router)
- **UI Library**: React 19
- **Language**: TypeScript 5 (strict mode)
- **Components**: 95+ files
- **Pages**: 8+ authenticated routes
- **Tests**: Unit tests with Vitest
- **Deployment**: Vercel (automatic on main branch)
- **Package Manager**: pnpm 9

---

## 🔗 Related Documentation

- **Backend**: [catering-api/docs/README.md](../../catering-api/docs/README.md)
- **Full Project**: [catering-api/MASTER_THESIS.md](../../catering-api/MASTER_THESIS.md) - Complete thesis overview
- **Backend Architecture**: [catering-api/ARCHITECTURE.md](../../catering-api/ARCHITECTURE.md)

---

**Last Updated**: February 2026  
**Version**: 1.0 (Master's Thesis Edition)
