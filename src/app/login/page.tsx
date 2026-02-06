"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuth } from "@/providers";
import { toast } from "sonner";
import { Users, UtensilsCrossed } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const loginSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(1, "La contraseña es requerida"),
  rememberMe: z.boolean().default(false),
});

type LoginForm = z.infer<typeof loginSchema>;

type AccountType = "client" | "catering" | null;

const accountDescriptions = {
  client: {
    title: "Cliente",
    description:
      "Gestiona tus contratos de catering, presupuesto y servicios",
    icon: Users,
  },
  catering: {
    title: "Catering",
    description:
      "Controla tus contratos activos, capacidad y próximos servicios",
    icon: UtensilsCrossed,
  },
};

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [accountType, setAccountType] = useState<AccountType>(null);

  const form = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(data: LoginForm) {
    setIsLoading(true);
    try {
      await login(data);
      toast.success("¡Bienvenido!");
      router.push("/dashboard");
    } catch (error) {
      console.error("Login error:", error);
      toast.error("Credenciales inválidas");
    } finally {
      setIsLoading(false);
    }
  }

  // Step 1: Select account type
  if (!accountType) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-slate-50 to-white px-4">
        <div className="w-full max-w-2xl space-y-8">
          {/* Header */}
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold text-slate-900">Catering App</h1>
            <p className="text-slate-600">
              ¿Cuál es tu rol en la plataforma?
            </p>
          </div>

          {/* Account Type Selection */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {(["client", "catering"] as AccountType[]).map((type) => {
              const Icon = accountDescriptions[type].icon;
              return (
                <button
                  key={type}
                  onClick={() => setAccountType(type)}
                  className="group relative rounded-lg border-2 border-slate-200 p-6 text-left transition-all hover:border-teal-600 hover:shadow-lg"
                >
                  <div className="space-y-4">
                    <div className="inline-block p-3 rounded-lg bg-teal-50 group-hover:bg-teal-100 transition">
                      <Icon className="h-6 w-6 text-teal-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-slate-900">
                        {accountDescriptions[type].title}
                      </h3>
                      <p className="text-sm text-slate-600 mt-1">
                        {accountDescriptions[type].description}
                      </p>
                    </div>
                  </div>
                  <div className="mt-4 flex items-center gap-2 text-teal-600 font-medium">
                    Continuar
                    <span className="group-hover:translate-x-1 transition">
                      →
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Back to landing */}
          <div className="text-center">
            <Link href="/" className="text-sm text-slate-600 hover:text-slate-900">
              ← Volver al inicio
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Step 2: Login form
  const description = accountDescriptions[accountType];
  const Icon = description.icon;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-slate-50 to-white px-4">
      <div className="w-full max-w-md space-y-4">
        {/* Back button */}
        <button
          onClick={() => setAccountType(null)}
          className="text-sm text-slate-600 hover:text-slate-900 flex items-center gap-1"
        >
          ← Cambiar tipo de cuenta
        </button>

        {/* Card */}
        <Card>
          <CardHeader className="text-center">
            <div className="flex justify-center mb-3">
              <div className="p-3 rounded-lg bg-teal-50">
                <Icon className="h-6 w-6 text-teal-600" />
              </div>
            </div>
            <CardTitle className="text-2xl">Iniciar Sesión</CardTitle>
            <CardDescription className="mt-2">
              {description.title} - {description.description}
            </CardDescription>
          </CardHeader>

          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="tu@email.com"
                          autoComplete="email"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Contraseña</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="••••••••"
                          autoComplete="current-password"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  className="w-full"
                  disabled={isLoading}
                  size="lg"
                >
                  {isLoading ? "Ingresando..." : "Ingresar"}
                </Button>

                <div className="text-center text-sm">
                  <Link
                    href="/forgot-password"
                    className="text-teal-600 hover:underline"
                  >
                    ¿Olvidaste tu contraseña?
                  </Link>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>

        {/* Test Credentials */}
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="pt-6">
            <p className="text-xs font-semibold text-blue-900 mb-2">
              CREDENCIALES DE PRUEBA:
            </p>
            {accountType === "client" && (
              <div className="text-xs text-blue-800 space-y-1">
                <p>Email: techcorp@example.com</p>
                <p>Password: password123</p>
              </div>
            )}
            {accountType === "catering" && (
              <div className="text-xs text-blue-800 space-y-1">
                <p>Email: delicias@example.com</p>
                <p>Password: password123</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
