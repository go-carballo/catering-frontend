"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/providers";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
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
} from "lucide-react";

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
           <Link href="/dashboard" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
             <ChefHat className="h-8 w-8 text-blue-600" />
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
                     ? "bg-blue-50 text-blue-700 border border-blue-200 shadow-sm"
                     : "text-slate-600 hover:bg-slate-50 hover:text-slate-900 border border-transparent",
                 )}
               >
                 <item.icon className="h-5 w-5" />
                 <span>{item.name}</span>
               </Link>
             );
           })}
         </nav>

         {/* User section */}
         <div className="p-4 border-t border-gray-100 bg-slate-50 space-y-3">
           <div className="flex items-center gap-3 px-2">
             <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
               <span className="text-sm font-bold text-blue-600">
                 {company?.name?.charAt(0).toUpperCase()}
               </span>
             </div>
             <div className="flex-1 min-w-0">
               <p className="text-sm font-semibold text-slate-900 truncate">{company?.name}</p>
               <p className="text-xs text-slate-500 truncate">
                 {company?.companyType === "CLIENT" ? "Cliente" : "Catering"}
               </p>
             </div>
           </div>
           <Button
             variant="outline"
             size="sm"
             className="w-full justify-start text-slate-600 hover:text-slate-900 hover:bg-white"
             onClick={() => setIsChangePasswordOpen(true)}
           >
             <Key className="h-4 w-4 mr-2" />
             Cambiar contraseña
           </Button>
           <Button
             variant="outline"
             className="w-full justify-start text-slate-600 hover:text-red-600 hover:bg-red-50"
             onClick={logout}
           >
             <LogOut className="h-4 w-4 mr-2" />
             Cerrar sesión
           </Button>
         </div>
      </aside>

      <ChangePasswordDialog
        isOpen={isChangePasswordOpen}
        onClose={() => setIsChangePasswordOpen(false)}
      />
    </>
  );
}
