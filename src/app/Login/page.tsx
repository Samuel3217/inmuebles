"use client";

import React, { useState } from "react";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Eye, EyeClosed,  } from "lucide-react";
import { loginUser } from "./actions"; // Server action
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

function LoginForm() {
    const passwordValidations = [
      {
        message: "Al menos 8 caracteres",
        check: (val: string) => val.length >= 8,
      },
      {
        message: "Al menos una letra mayúscula",
        check: (val: string) => /[A-Z]/.test(val),
      },
      {
        message: "Al menos una letra minúscula",
        check: (val: string) => /[a-z]/.test(val),
      },
      {
        message: "Al menos un carácter especial",
        check: (val: string) => /[^a-zA-Z0-9]/.test(val),
      },
      {
        message: "Sin números consecutivos (ej. 123)",
        check: (val: string) => {
          const digits = val.replace(/\D/g, "");
          for (let i = 0; i < digits.length - 2; i++) {
            const n1 = parseInt(digits[i]);
            const n2 = parseInt(digits[i + 1]);
            const n3 = parseInt(digits[i + 2]);
            if (n2 === n1 + 1 && n3 === n2 + 1) {
              return false; // hay tres consecutivos
            }
          }
          return true;
        },
      },
      {
        message: "Sin letras consecutivas (ej. abc)",
        check: (val: string) => {
          const letters = val.toLowerCase().replace(/[^a-z]/g, "");
          for (let i = 0; i < letters.length - 2; i++) {
            const c1 = letters.charCodeAt(i);
            const c2 = letters.charCodeAt(i + 1);
            const c3 = letters.charCodeAt(i + 2);
            if (c2 === c1 + 1 && c3 === c2 + 1) {
              return false; // hay tres consecutivas
            }
          }
          return true;
        },
      },
    ];


  const [showPassword, setShowPassword] = useState(false);

  const formSchema = z.object({
    email: z.string().email("Debe ser un correo electrónico válido"),
    password: z
      .string()
      .min(8, "Contraseña debe tener al menos 8 caracteres")
      .refine((val) => /[A-Z]/.test(val), {
        message: "Contraseña debe contener al menos una letra mayúscula",
      })
      .refine((val) => /[a-z]/.test(val), {
        message: "Contraseña debe contener al menos una letra minúscula",
      })
      .refine((val) => /[^a-zA-Z0-9]/.test(val), {
        message: "Contraseña debe contener al menos un carácter especial",
      })
      .refine(
        (val: string) => {
          const digits = val.replace(/\D/g, "");
          for (let i = 0; i < digits.length - 2; i++) {
            const n1 = parseInt(digits[i]);
            const n2 = parseInt(digits[i + 1]);
            const n3 = parseInt(digits[i + 2]);
            if (n2 === n1 + 1 && n3 === n2 + 1) {
              return false; // hay tres consecutivos
            }
          }
          return true;
        },
        {
          message: "Contraseña no debe contener números consecutivos",
        }
      )
      .refine(
        (val: string) => {
          const letters = val.toLowerCase().replace(/[^a-z]/g, "");
          for (let i = 0; i < letters.length - 2; i++) {
            const c1 = letters.charCodeAt(i);
            const c2 = letters.charCodeAt(i + 1);
            const c3 = letters.charCodeAt(i + 2);
            if (c2 === c1 + 1 && c3 === c2 + 1) {
              return false; // hay tres consecutivas
            }
          }
          return true;
        },
        {
          message: "Contraseña no debe contener letras consecutivas (ej: abc)",
        }
      ),
  });

   const form = useForm<z.infer<typeof formSchema>>({
     resolver: zodResolver(formSchema),
     defaultValues: {
       email: "",
       password: "",
     },
   });

const loginMutation = useMutation({
  mutationFn: async (formData: FormData) => {
    return await loginUser(formData);
  },
    onSuccess: () => {
        console.log("Login exitoso");
    },
});


function onSubmit(values: z.infer<typeof formSchema>) {

    console.log("Procesando login con:", values);
  const formData = new FormData();

  formData.append("email", values.email);
  formData.append("password", values.password);

  loginUser(formData)

  loginMutation.mutate(formData);
}

function handleShowPassword() {
  setShowPassword((val) => !val);
}


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
                          onClick={handleShowPassword}
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
                    <ul className="text-xs list-disc ml-5">
                      {passwordValidations.map((v, i) => (
                        <li
                          key={i}
                          className={
                            v.check(field.value)
                              ? "text-green-500"
                              : "text-red-500"
                          }
                        >
                          {v.message}
                        </li>
                      ))}
                    </ul>
                  </FormItem>
                )}
              />
            </form>
          </Form>
        </CardContent>
        <CardFooter>
          <Button type="submit" form="login-form" className="w-full">
            Ingresar
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}

export default LoginForm;
