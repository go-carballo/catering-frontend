<p align="center">
  <img src="https://img.shields.io/badge/Next.js-15-black?style=flat-square&logo=next.js" alt="Next.js">
  <img src="https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react" alt="React">
  <img src="https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript" alt="TypeScript">
  <img src="https://img.shields.io/badge/Tailwind-4-06B6D4?style=flat-square&logo=tailwindcss" alt="Tailwind">
  <img src="https://img.shields.io/badge/pnpm-9-F69220?style=flat-square&logo=pnpm" alt="pnpm">
</p>

<h1 align="center">🍽️ Catering Frontend</h1>

<p align="center">
  <strong>Sistema de gestión de catering</strong><br>
  Aplicación web moderna para gestionar contratos, servicios y reportes de catering.
</p>

<p align="center">
  <a href="#-features">Features</a> •
  <a href="#-tech-stack">Tech Stack</a> •
  <a href="#-getting-started">Getting Started</a> •
  <a href="#-project-structure">Structure</a> •
  <a href="#-scripts">Scripts</a>
</p>

---

## ✨ Features

- 🔐 **Autenticación** - Login seguro con JWT y refresh tokens
- 📋 **Gestión de Contratos** - CRUD completo de contratos de catering
- 📅 **Días de Servicio** - Programación y seguimiento de servicios
- 📊 **Reportes** - Generación de reportes por contrato
- 🎨 **UI Moderna** - Interfaz responsive con shadcn/ui
- ⚡ **Rendimiento** - Server Components y optimizaciones de Next.js 15

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
NEXT_PUBLIC_API_URL=http://localhost:8080/api
```

---

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── (protected)/        # Authenticated routes
│   │   ├── contracts/      # Contract pages
│   │   └── dashboard/      # Dashboard page
│   └── login/              # Auth pages
├── components/
│   ├── layout/             # Layout components (Sidebar)
│   └── ui/                 # shadcn/ui components
├── hooks/                  # Custom React hooks
├── lib/                    # Utility functions
├── providers/              # React Context providers
├── services/               # API service layer
└── types/                  # TypeScript type definitions
```

---

## 📜 Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start development server on port 3001 |
| `pnpm build` | Build for production |
| `pnpm start` | Start production server |
| `pnpm lint` | Run ESLint |

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

## 📄 License

MIT

---

<p align="center">
  <sub>Built with ❤️ using Next.js and React</sub>
</p>
# Build 1770238843
