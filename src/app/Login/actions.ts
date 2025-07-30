// src/app/login/actions.ts
"use server";

import prisma from "@/db";
import bcrypt from "bcrypt";

export async function loginUser(email: string, password: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user || !user.password) {
      return { success: false, message: "Correo no encontrado" };
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return { success: false, message: "Contraseña incorrecta" };
    }

    return {
      success: true,
      message: "Inicio de sesión exitoso",
      user, // Ojo: podrías querer ocultar la contraseña aquí
    };
  } catch (error) {
    console.error("Error en loginUser:", error);
    return {
      success: false,
      message: "Error en el servidor al intentar iniciar sesión",
    };
  }
}
