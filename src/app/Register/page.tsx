"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Eye, EyeClosed } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { registerUser } from "./actions";
import { useRouter } from "next/navigation";
import { Checkbox } from "@/components/ui/checkbox";
import Terminos from "@/components/ui/terminos";
import Privacidad from "@/components/ui/privacidad";

const formSchema = z
  .object({
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
      .refine((val) => !/(?:\d)(?=\d)/.test(val), {
        message: "Contraseña no debe contener números consecutivos",
      })
      .refine(
        (val) => {
          const lower = val.toLowerCase();
          for (let i = 0; i < lower.length - 1; i++) {
            const curr = lower.charCodeAt(i);
            const next = lower.charCodeAt(i + 1);
            if (
              /[a-z]/.test(lower[i]) &&
              /[a-z]/.test(lower[i + 1]) &&
              next === curr + 1
            ) {
              return false;
            }
          }
          return true;
        },
        {
          message: "Contraseña no debe contener letras consecutivas (ej: abc)",
        }
      ),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Las contraseñas deben coincidir",
  });

function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const mutation = useMutation({
    mutationFn: async (formData: FormData) => {
      const result = await registerUser(formData);
      return result;
    },
    onSuccess: () => {
      form.reset();
      setIsOpen(true);
    },
    onError: (error: Error) => {
      console.error("Error al registrar usuario:", error.message);
    },
  });

  const [termsAccepted, setTermsAccepted] = useState(false);


  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    const formData = new FormData();
    formData.append("email", values.email);
    formData.append("password", values.password);

    mutation.mutate(formData);

    router.push("/");
  }

  function handleShowPassword() {
    setShowPassword((val) => !val);
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="bg-white p-8 rounded-xl shadow-md w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl text-center mb-6">
            Registrarse
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              id="register-form"
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
                        className="bg-gray-200"
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
                          className="bg-gray-200"
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
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirmar contraseña</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={showPassword ? "text" : "password"}
                          className="bg-gray-200"
                          {...field}
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
                    <FormMessage />
                  </FormItem>
                )}
              />
            </form>
          </Form>
          <div className="flex  items-center gap-3 justify-center py-3 mt-5">
            <Checkbox
              id="terms"
              checked={termsAccepted}
              onCheckedChange={(checked) => setTermsAccepted(!!checked)}
              className="bg-gray-600 cursor-pointer"
            />

            <div className="flex-col">
              <Dialog>
                <DialogTrigger className="text-gray-700 hover:text-black transition-all duration-300 cursor-pointer">
                  Aceptar terminos y condiciones
                </DialogTrigger>
                <DialogContent className="max-w-4xl h-[80vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle className="text-center text-2xl">
                      Terminos y condiciones
                    </DialogTitle>
                    <DialogDescription asChild>
                      <Terminos />
                    </DialogDescription>
                  </DialogHeader>
                </DialogContent>
              </Dialog>
              <h1>Y el</h1>
              <Dialog>
                <DialogTrigger className="text-gray-700 hover:text-black transition-all duration-300 cursor-pointer">
                  Aviso de privacidad
                </DialogTrigger>
                <DialogContent className="max-w-4xl h-[80vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle className="text-center text-2xl">
                      Estimado usuario
                    </DialogTitle>
                    <DialogDescription asChild>
                      <Privacidad />
                    </DialogDescription>
                  </DialogHeader>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button
            type="submit"
            form="register-form"
            className={`w-full text-white transition-all duration-300 ${
              termsAccepted
                ? "bg-gray-700 hover:bg-gray-800 cursor-pointer"
                : "bg-gray-400 opacity-50 cursor-not-allowed"
            }`}
            disabled={!termsAccepted || mutation.isPending}
          >
            {mutation.isPending ? "Registrando..." : "Registrarse"}
          </Button>
        </CardFooter>
        <RegisterDialog isOpen={isOpen} setIsOpen={setIsOpen} />
      </Card>
    </div>
  );
}

function RegisterDialog({
  isOpen,
  setIsOpen,
}: {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  return (
    <Dialog onOpenChange={setIsOpen} open={isOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Registro exitoso</DialogTitle>
          <DialogDescription>
            Tu cuenta ha sido creada exitosamente. Ahora puedes iniciar sesión
            con tu correo y contraseña.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button>Cerrar</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default Register;
