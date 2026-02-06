"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight, Home } from "lucide-react";

const breadcrumbConfig: Record<string, { label: string; href: string }> = {
  dashboard: { label: "Dashboard", href: "/dashboard" },
  contracts: { label: "Contratos", href: "/contracts" },
  "service-days": { label: "Servicios", href: "/service-days" },
  companies: { label: "Empresas", href: "/companies" },
  users: { label: "Usuarios", href: "/users" },
};

export function Breadcrumbs() {
  const pathname = usePathname();

  // Extract segments and filter out empty ones
  const segments = pathname
    .split("/")
    .filter((segment) => segment && segment !== "protected");

  // Build breadcrumb items
  const items = segments.map((segment, index) => {
    const config = breadcrumbConfig[segment] || {
      label: segment.charAt(0).toUpperCase() + segment.slice(1),
      href: `/${segments.slice(0, index + 1).join("/")}`,
    };
    return {
      ...config,
      isCurrent: index === segments.length - 1,
    };
  });

  return (
    <nav className="flex items-center gap-2 text-sm text-gray-600 mb-6">
      <Link
        href="/dashboard"
        className="flex items-center gap-1 hover:text-gray-900 transition-colors"
      >
        <Home className="w-4 h-4" />
        <span>Inicio</span>
      </Link>

      {items.map((item) => (
        <div key={item.href} className="flex items-center gap-2">
          <ChevronRight className="w-4 h-4 text-gray-400" />
          {item.isCurrent ? (
            <span className="font-medium text-gray-900">{item.label}</span>
          ) : (
            <Link
              href={item.href}
              className="hover:text-gray-900 transition-colors"
            >
              {item.label}
            </Link>
          )}
        </div>
      ))}
    </nav>
  );
}
