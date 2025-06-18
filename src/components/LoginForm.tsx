"use client";

import React from "react";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";

// Validaciones avanzadas para password
const passwordRegex = {
  upper: /[A-Z]/,
  lower: /[a-z]/,
  special: /[^A-Za-z0-9]/,
  noConsecutiveNumbers: !/(?:\d)(?=\d)/,
  noConsecutiveLetters:
    /^(?!.*(ab|bc|cd|de|ef|fg|gh|hi|ij|jk|kl|lm|mn|no|op|pq|qr|rs|st|tu|uv|vw|wx|xy|yz))/i,
};

const formSchema = z.object({
  email: z.string().email("Correo electrónico inválido"),
  password: z
    .string()
    .min(8, { message: "La contraseña debe tener al menos 8 caracteres" })
    .refine((val) => passwordRegex.upper.test(val), {
      message: "Debe contener al menos una letra mayúscula",
    })
    .refine((val) => passwordRegex.lower.test(val), {
      message: "Debe contener al menos una letra minúscula",
    })
    .refine((val) => passwordRegex.special.test(val), {
      message: "Debe contener al menos un carácter especial",
    })
    .refine((val) => !/(?:\d)(?=\d)/.test(val), {
      message: "No se permiten números consecutivos",
    })
    .refine((val) => passwordRegex.noConsecutiveLetters.test(val), {
      message: "No se permiten letras consecutivas (como 'abc')",
    }),
});

function LoginForm() {
  const [successMessage, setSuccessMessage] = React.useState("");

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    setSuccessMessage("✅ Inicio de sesión exitoso");
  }

  React.useEffect(() => {
    if (successMessage) {
      const timeout = setTimeout(() => {
        setSuccessMessage("");
      }, 3000);
      return () => clearTimeout(timeout);
    }
  }, [successMessage]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md">
        <h2 className="text-2xl font-semibold text-center mb-6">
          Iniciar sesión
        </h2>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Email */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Correo electrónico</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="tucorreo@ejemplo.com"
                      className="bg-gray-200"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Password */}
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contraseña</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Tu contraseña segura"
                      className="bg-gray-200"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="w-full bg-gray-700 hover:bg-gray-800 text-white"
            >
              Iniciar sesión
            </Button>

            {successMessage && (
              <p className="text-green-600 text-sm font-medium text-center">
                {successMessage}
              </p>
            )}
          </form>
        </Form>
      </div>
    </div>
  );
}

export default LoginForm;
