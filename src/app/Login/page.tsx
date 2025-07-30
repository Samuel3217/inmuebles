"use client";

import React, { useState, useEffect } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
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
import { Eye, EyeClosed } from "lucide-react";
import { loginUser } from "./actions";
import { useRouter } from "next/navigation";


const formSchema = z.object({
  email: z.string().email("Correo electrónico inválido"),
  password: z
    .string()
    .min(8, "Contraseña debe tener al menos 8 caracteres")
    .refine((val) => /[A-Z]/.test(val), {
      message: "Debe contener al menos una letra mayúscula",
    })
    .refine((val) => /[a-z]/.test(val), {
      message: "Debe contener al menos una letra minúscula",
    })
    .refine((val) => /[^a-zA-Z0-9]/.test(val), {
      message: "Debe contener al menos un carácter especial",
    })
    .refine((val) => !/(?:\\d)(?=\\d)/.test(val), {
      message: "No se permiten números consecutivos",
    })
    .refine(
      (val) => {
        const lower = val.toLowerCase();
        for (let i = 0; i < lower.length - 1; i++) {
          const curr = lower.charCodeAt(i);
          const next = lower.charCodeAt(i + 1);
          if (/[a-z]/.test(lower[i]) && next === curr + 1) return false;
        }
        return true;
      },
      {
        message: "No se permiten letras consecutivas (ej: abc)",
      }
    ),
});



function LoginForm() {
  const [successMessage, setSuccessMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();


  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });


async function onSubmit(values: z.infer<typeof formSchema>) {
  try {
    const res = await loginUser(values.email, values.password);

    if (res.success) {
      setSuccessMessage("✅ " + res.message);

      // Espera 2 segundos para que se vea el mensaje
      setTimeout(() => {
        router.push("/");
      }, 1000);
    } else {
      setSuccessMessage("❌ " + res.message);
    }
  } catch (error) {
    console.error("Error durante el inicio de sesión:", error);
    setSuccessMessage("❌ Ocurrió un error inesperado. Inténtalo de nuevo.");
  }
}


  useEffect(() => {
    if (successMessage) {
      const timeout = setTimeout(() => setSuccessMessage(""), 3000);
      return () => clearTimeout(timeout);
    }
  }, [successMessage]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-sm mx-auto mt-10">
        <CardHeader>
          <CardTitle className="text-2xl text-center">Iniciar sesión</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              id="login-form"
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex flex-col gap-6"
            >
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Correo electrónico</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        {...field}
                        onChange={(e) => {
                          field.onChange(e);
                          form.trigger("email");
                        }}
                        onBlur={() => form.trigger("email")}
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
                      <div className="relative">
                        <Input
                          type={showPassword ? "text" : "password"}
                          {...field}
                          onChange={(e) => {
                            field.onChange(e);
                            form.trigger("password");
                          }}
                          onBlur={() => form.trigger("password")}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword((prev) => !prev)}
                          className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground"
                        >
                          {showPassword ? (
                            <EyeClosed size={18} />
                          ) : (
                            <Eye size={18} />
                          )}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex flex-col gap-2">
          <Button type="submit" form="login-form" className="w-full">
            Ingresar
          </Button>
          {successMessage && (
            <p className="text-green-600 text-sm font-medium text-center">
              {successMessage}
            </p>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}

export default LoginForm;
