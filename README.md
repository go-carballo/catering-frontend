<p align="center">
  <img src="https://img.shields.io/badge/Next.js-15-black?style=flat-square&logo=next.js" alt="Next.js">
  <img src="https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react" alt="React">
  <img src="https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript" alt="TypeScript">
  <img src="https://img.shields.io/badge/Tailwind-4-06B6D4?style=flat-square&logo=tailwindcss" alt="Tailwind">
  <img src="https://img.shields.io/badge/pnpm-9-F69220?style=flat-square&logo=pnpm" alt="pnpm">
</p>

<h1 align="center">🍽️ ChefOps</h1>

<p align="center">
  <strong>Modern Frontend for Catering Management System</strong><br>
  <em>Master's Thesis Project - Production-Grade React/Next.js Application</em><br>
  Plataforma moderna para gestionar contratos, servicios, reportes y equipo de catering.
</p>

<p align="center">
  <a href="#-features">Features</a> •
  <a href="#-architecture">Architecture</a> •
  <a href="#-documentation">Documentation</a> •
  <a href="#-tech-stack">Tech Stack</a> •
  <a href="#-getting-started">Getting Started</a> •
  <a href="#-project-structure">Structure</a> •
  <a href="#-scripts">Scripts</a>
</p>

---

## 📖 About This Project

ChefOps is a **production-grade, multi-tenant SaaS platform** for catering contract and service management. This repository contains the **frontend application** (Next.js 15 with React 19), which is one part of a complete Master's thesis project demonstrating:

- ✅ **Clean Architecture** - Layered, testable, maintainable code
- ✅ **Modern Frontend Patterns** - Server Components, React Query, hooks-based design
- ✅ **Type Safety** - Strict TypeScript, Zod validation, discriminated unions
- ✅ **Performance Optimization** - Code splitting, caching, responsive design
- ✅ **Production Ready** - Deployed on Vercel, integrated with Railway backend
- ✅ **Comprehensive Documentation** - Architecture, design decisions, components

**See also**: [Backend Repository](https://github.com/go-carballo/catering-api) - NestJS API with Clean Architecture

---

## 📚 Documentation

Complete frontend documentation for developers and evaluators:

### **Start here for thesis context:**
- **[FRONTEND_ARCHITECTURE.md](./FRONTEND_ARCHITECTURE.md)** - System design, data flow, state management
- **[FRONTEND_DEVELOPMENT_GUIDE.md](./FRONTEND_DEVELOPMENT_GUIDE.md)** - Setup, workflows, adding features

### **Component & Design:**
- **[COMPONENTS_DOCUMENTATION.md](./COMPONENTS_DOCUMENTATION.md)** - UI/Feature components, patterns, usage

### **Full documentation index:**
See [docs/README.md](./docs/README.md) for navigation by role (evaluator, developer)

---

## ✨ Features

- 🔐 **Autenticación** - Login seguro con JWT y refresh tokens, session timeout management
- 📋 **Gestión de Contratos** - CRUD completo de contratos entre catering y clientes
- 📅 **Días de Servicio** - Programación y confirmación de servicios (expected vs served)
- 📊 **Reportes** - Generación de reportes por contrato, análisis de deviaciones
- 💼 **Gestión de Empresas** - CRUD de empresas de catering y clientes
- 👥 **Gestión de Usuarios** - Administración de empleados por empresa
- 🎨 **UI Moderna** - Interfaz responsive con shadcn/ui, Tailwind CSS 4
- ⚡ **Rendimiento** - Server Components, React Query caching, optimizaciones de Next.js 15
- 📱 **Responsive Design** - Mobile-first approach, funciona en todos los dispositivos

---

## 🏗️ Architecture

The frontend follows a **layered architecture** with clear separation of concerns:

```
Pages (Next.js Routes)
        ↓
Components (UI + Feature)
        ↓
Hooks (React Query + Custom)
        ↓
Services (API Integration)
        ↓
API Client (Axios with Interceptors)
        ↓
Backend (REST API on Railway)
```

**Key Design Principles**:
- **Server Components by default** - Reduced JS bundle size
- **Client Components only when needed** - Interactions, hooks
- **TanStack Query for server state** - Caching, synchronization
- **Type-safe throughout** - TypeScript strict mode
- **Component composition** - Reusable, testable UI blocks

See [FRONTEND_ARCHITECTURE.md](./FRONTEND_ARCHITECTURE.md) for detailed explanation.

---

## 🛠️ Tech Stack

| Categoría | Tecnología |
|-----------|------------|
| **Framework** | [Next.js 15](https://nextjs.org/) (App Router) |
| **UI Library** | [React 19](https://react.dev/) |
| **Language** | [TypeScript 5](https://www.typescriptlang.org/) |
| **Styling** | [Tailwind CSS 4](https://tailwindcss.com/) |
| **Components** | [shadcn/ui](https://ui.shadcn.com/) |
| **State Management** | [TanStack Query](https://tanstack.com/query) |
| **Forms** | [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/) |
| **Package Manager** | [pnpm](https://pnpm.io/) |

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- pnpm 9+
- Backend API running on `http://localhost:3000/api`

### Installation

```bash
# Clone the repository
git clone https://github.com/go-carballo/catering-frontend.git
cd catering-frontend

# Install dependencies
pnpm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your API URL

# Start development server
pnpm dev
```

Open [http://localhost:3001](http://localhost:3001) to see the app.

### Environment Variables

```bash
# .env.local
NEXT_PUBLIC_API_URL=http://localhost:3000/api
```

### Test Credentials

Use these credentials to login to the application:

| Email                | Password    | Type     |
|---------------------|-------------|----------|
| delicias@example.com | password123 | CATERING |
| sabores@example.com  | password123 | CATERING |
| chef@example.com     | password123 | CATERING |
| techcorp@example.com | password123 | CLIENT   |
| finanzas@example.com | password123 | CLIENT   |
| startup@example.com  | password123 | CLIENT   |

**Note:** These credentials work with the seeded database. To seed the backend database, run `make seed` in the backend project or call the `/api/seed` endpoint.

---

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── (protected)/        # Authenticated routes
│   │   ├── contracts/      # Contract pages
│   │   ├── dashboard/      # Dashboard page
│   │   ├── companies/      # Companies management
│   │   ├── service-days/   # Service days
│   │   └── users/          # Users management
│   └── login/              # Auth pages
├── components/             # Reusable React components
│   ├── ui/                 # shadcn/ui base components
│   ├── layout/             # Layout components (Sidebar, Breadcrumbs)
│   ├── dashboard/          # Dashboard-specific components
│   ├── contracts/          # Contract-related components
│   ├── companies/          # Company management components
│   ├── users/              # User management components
│   └── auth/               # Authentication components
├── hooks/                  # Custom React hooks
│   ├── use-contracts.ts    # Contract data fetching
│   ├── use-users.ts        # User data fetching
│   ├── use-service-days.ts # Service day data
│   └── ...
├── services/               # API service layer
│   ├── api.ts              # Axios instance with interceptors
│   ├── contracts.service.ts
│   ├── users.service.ts
│   ├── auth.service.ts
│   └── ...
├── types/                  # TypeScript type definitions
│   ├── api.ts
│   ├── contract.ts
│   ├── users.ts
│   └── ...
├── lib/                    # Utility functions
│   ├── currency-formatter.ts
│   ├── date-formatter.ts
│   └── validations/        # Zod schemas
├── providers/              # React Context providers
│   ├── auth-provider.tsx
│   └── query-provider.tsx
└── middleware.ts           # Next.js middleware (auth checks)
```

---

## 📜 Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start development server on port 3001 |
| `pnpm build` | Build for production |
| `pnpm start` | Start production server |
| `pnpm lint` | Run ESLint |
| `pnpm type-check` | Run TypeScript type checking |
| `pnpm test` | Run Vitest unit tests |
| `pnpm test --watch` | Run tests in watch mode |
| `pnpm format` | Format code with Prettier |

---

## 🔒 Code Quality

This project uses [Gentleman Guardian Angel (gga)](https://github.com/Gentleman-Programming/gentleman-guardian-angel) for AI-powered code review on every commit.

```bash
# Install gga
brew tap gentleman-programming/tap
brew install gga

# Initialize in project (already done)
gga init
gga install
```

---

## 🌐 Deployment

### Production

- **Frontend:** [https://catering-frontend-two.vercel.app](https://catering-frontend-two.vercel.app)
- **Backend API:** [https://catering-api-production.up.railway.app/api](https://catering-api-production.up.railway.app/api)
- **API Docs (Swagger):** [https://catering-api-production.up.railway.app/docs](https://catering-api-production.up.railway.app/docs)

The frontend is automatically deployed to Vercel on every push to `main`.

---

## 📄 License

MIT

---

<p align="center">
  <sub>Built with ❤️ using Next.js and React | Part of Master's Thesis Project</sub>
</p>
