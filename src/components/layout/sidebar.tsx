"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useAuth } from "@/providers";
import { ChangePasswordDialog } from "@/components/auth/change-password-dialog";
import {
  LayoutDashboard,
  FileText,
  Calendar,
  Building2,
  Users,
  LogOut,
  ChefHat,
  Key,
  Settings,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Contratos", href: "/contracts", icon: FileText },
  { name: "Servicios", href: "/service-days", icon: Calendar },
  { name: "Empresas", href: "/companies", icon: Building2 },
  { name: "Usuarios", href: "/users", icon: Users },
];

export function Sidebar() {
  const pathname = usePathname();
  const { company, logout } = useAuth();
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);

  return (
    <>
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col shadow-sm">
        {/* Logo */}
        <div className="p-6 border-b border-gray-100 bg-slate-50">
          <Link
            href="/dashboard"
            className="flex items-center gap-2 hover:opacity-80 transition-opacity"
          >
            <ChefHat className="h-8 w-8 text-teal-600" />
            <span className="text-xl font-bold text-slate-900">Catering</span>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-3 space-y-1">
          {navigation.map((item) => {
            const isActive = pathname.startsWith(item.href);
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
                  isActive
                    ? "bg-teal-50 text-teal-700 border border-teal-200 shadow-sm"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900 border border-transparent",
                )}
              >
                <item.icon className="h-5 w-5" />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* User section - Dropdown Menu */}
        <div className="p-4 border-t border-gray-100 bg-slate-50">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="w-full flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-white transition-colors">
                <div className="w-10 h-10 rounded-lg bg-teal-100 flex items-center justify-center flex-shrink-0">
                  <span className="text-sm font-bold text-teal-600">
                    {company?.name?.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="flex-1 min-w-0 text-left">
                  <p className="text-sm font-semibold text-slate-900 truncate">
                    {company?.name}
                  </p>
                  <p className="text-xs text-slate-500 truncate">
                    {company?.companyType === "CLIENT" ? "Cliente" : "Catering"}
                  </p>
                </div>
              </button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="start" className="w-56">
              <DropdownMenuLabel className="flex flex-col space-y-1">
                <span>{company?.name}</span>
                <span className="text-xs font-normal text-slate-500">
                  {company?.email}
                </span>
              </DropdownMenuLabel>

              <DropdownMenuSeparator />

              <DropdownMenuItem onClick={() => setIsChangePasswordOpen(true)}>
                <Key className="h-4 w-4 mr-2" />
                <span>Cambiar contraseña</span>
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              <DropdownMenuItem
                onClick={logout}
                className="text-red-600 focus:bg-red-50 focus:text-red-600"
              >
                <LogOut className="h-4 w-4 mr-2" />
                <span>Cerrar sesión</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </aside>

      <ChangePasswordDialog
        isOpen={isChangePasswordOpen}
        onClose={() => setIsChangePasswordOpen(false)}
      />
    </>
  );
}
