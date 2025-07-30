"use server";

import prisma from "@/db";

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

export async function showinmuebles() {
const inmuebles = await prisma.inmueble.findMany({
  orderBy: { id: "desc" },
}
);
return inmuebles;
}

export async function tipoDeCambio(aMoneda: string) {
  const response = await fetch(
    `https://free.ratesdb.com/v1/rates?from=MXN&to=${aMoneda}`
  );

  const data = await response.json();

  return data; 
}
