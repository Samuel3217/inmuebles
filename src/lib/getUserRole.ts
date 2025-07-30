// src/lib/getUserRole.ts
import prisma from "@/db";

export async function getUserRole(userId: number) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { role: true },
  });

  if (!user){
    throw new Error("Usuario no encontrado");
  }
console.log("Rol accedido: " + user.role)
  return user.role;
}
