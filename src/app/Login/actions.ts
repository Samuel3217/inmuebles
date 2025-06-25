// src/app/login/actions.ts
"use server";

import prisma from "@/db/index"; // Ajusta si usas otra ruta

export async function loginUser(email: string, password: string) {
  try {
    const user = await prisma.user.findUnique({ where: { email, password } });

    if (!user || !user.password) {
      return { success: false, message: "Correo no encontrado" };
    }



    return { success: true, message: "Inicio de sesión exitoso", user };
  } catch (error) {
    console.error("Error en loginUser:", error);
    return {
      success: false,
      message: "Error en el servidor al intentar iniciar sesión",
    };
  }
}
