import { redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart3,
  Calendar,
  Users,
  TrendingUp,
  CheckCircle,
  ArrowRight,
} from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-sm border-b border-slate-200 z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-teal-600 flex items-center justify-center">
              <span className="text-white font-bold text-sm">C</span>
            </div>
            <span className="text-xl font-bold text-slate-900">Catering</span>
          </div>
          <div className="flex gap-3">
            <Link href="/login">
              <Button variant="outline">Iniciar Sesión</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <h1 className="text-5xl sm:text-6xl font-bold text-slate-900 tracking-tight">
            Gestión Inteligente de
            <br />
            <span className="text-teal-600">Contratos de Catering</span>
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Plataforma integral para conectar empresas de catering con clientes.
            Automatiza confirmaciones, servicios y reportes financieros.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Link href="/login">
              <Button size="lg" className="gap-2">
                Comenzar Ahora
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <button className="px-8 py-3 rounded-lg border border-slate-300 font-medium text-slate-900 hover:bg-slate-50 transition">
              Conocer Más
            </button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">
              Para Clientes
            </h2>
            <p className="text-lg text-slate-600">
              Gestiona tus contratos de catering con control total
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
            {[
              {
                icon: Calendar,
                title: "Contratación Flexible",
                description:
                  "Define días de servicio, cantidades y precios personalizados para cada contrato.",
              },
              {
                icon: CheckCircle,
                title: "Confirmaciones Dual",
                description:
                  "Confirma cantidades esperadas y controlá lo que realmente se sirve.",
              },
              {
                icon: BarChart3,
                title: "Reportes Financieros",
                description:
                  "Dashboard con presupuesto, gastos, KPIs y proyecciones precisas.",
              },
              {
                icon: TrendingUp,
                title: "Análisis de Desviaciones",
                description:
                  "Identifica diferencias entre lo presupuestado y lo consumido.",
              },
              {
                icon: Users,
                title: "Gestión de Usuarios",
                description:
                  "Invita usuarios de tu empresa con roles diferenciados (Admin, Manager, Employee).",
              },
              {
                icon: Calendar,
                title: "Historial Completo",
                description:
                  "Acceso a todo el historial de servicios, confirmaciones y pagos.",
              },
            ].map((feature, idx) => (
              <Card
                key={idx}
                className="hover:shadow-lg transition-shadow duration-300"
              >
                <CardHeader>
                  <feature.icon className="h-8 w-8 text-teal-600 mb-2" />
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-600">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">
              Para Caterings
            </h2>
            <p className="text-lg text-slate-600">
              Optimiza tu operación y gestiona múltiples clientes
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: TrendingUp,
                title: "Panel Operacional",
                description:
                  "Vista rápida de contratos activos, capacidad disponible y próximos servicios.",
              },
              {
                icon: Calendar,
                title: "Gestión de Servicios",
                description:
                  "Confirma cantidades servidas y mantén un registro preciso de operaciones.",
              },
              {
                icon: BarChart3,
                title: "Control de Capacidad",
                description:
                  "Monitorea tu capacidad diaria contra las demandas de todos tus clientes.",
              },
              {
                icon: Users,
                title: "Equipo Colaborativo",
                description:
                  "Asigna roles y permisos a tu equipo para gestionar operaciones.",
              },
              {
                icon: CheckCircle,
                title: "Confirmaciones Automáticas",
                description:
                  "Sistema de fallback automático si el cliente no confirma a tiempo.",
              },
              {
                icon: BarChart3,
                title: "Histórico Detallado",
                description:
                  "Registro completo de todas las operaciones para auditoría y análisis.",
              },
            ].map((feature, idx) => (
              <Card
                key={idx}
                className="hover:shadow-lg transition-shadow duration-300"
              >
                <CardHeader>
                  <feature.icon className="h-8 w-8 text-teal-600 mb-2" />
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-600">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div>
            <h2 className="text-4xl font-bold text-slate-900 mb-4">
              ¿Listo para Comenzar?
            </h2>
            <p className="text-xl text-slate-600">
              Optimiza tu gestión de contratos de catering hoy mismo
            </p>
          </div>
          <Link href="/login">
            <Button size="lg" className="gap-2">
              Iniciar Sesión
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto text-center text-slate-600">
          <p>&copy; 2026 Catering App. Todos los derechos reservados.</p>
        </div>
      </footer>
    </div>
  );
}
