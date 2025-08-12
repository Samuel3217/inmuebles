"use server";

import prisma from "@/db";

// Crear inmueble
export async function crearInmueble(formData: FormData) {
  const titulo = formData.get("titulo") as string;
  const descripcion = formData.get("descripcion") as string;
  const precio = parseFloat(formData.get("precio") as string);
  const ubicacion = formData.get("ubicacion") as string;
  const imagenUrl = formData.get("imagenUrl") as string;

  if (!titulo || isNaN(precio) || !ubicacion) {
    throw new Error("Datos inválidos");
  }

  await prisma.inmueble.create({
    data: {
      titulo,
      descripcion,
      precio,
      ubicacion,
      imagenUrl,
    },
  });
}

// Mostrar inmuebles
export async function showinmuebles() {
  return await prisma.inmueble.findMany({
    orderBy: { id: "desc" },
  });
}

// Obtener inmuebles
export async function getInmuebles() {
  return await prisma.inmueble.findMany();
}

// Actualizar inmueble
export async function updateInmueble(id: number, formData: FormData) {
  const titulo = formData.get("titulo") as string;
  const descripcion = formData.get("descripcion") as string;
  const precio = parseFloat(formData.get("precio") as string);
  const ubicacion = formData.get("ubicacion") as string;
  const imagenUrl = formData.get("imagenUrl") as string;

  if (!titulo || isNaN(precio) || !ubicacion) {
    throw new Error("Datos inválidos");
  }

  return await prisma.inmueble.update({
    where: { id },
    data: {
      titulo,
      descripcion,
      precio,
      ubicacion,
      imagenUrl,
    },
  });
}

// Eliminar inmueble
export async function deleteInmueble(id: number) {
  return await prisma.inmueble.delete({
    where: { id },
  });
}


export async function tipoDeCambio(aMoneda: string) {
  const response = await fetch(
    `https://free.ratesdb.com/v1/rates?from=MXN&to=${aMoneda}`
  );

  const data = await response.json();

  return data;
}
