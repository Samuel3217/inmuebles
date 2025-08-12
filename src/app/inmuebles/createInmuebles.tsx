"use client"

import { crearInmueble } from "./actions";

export default function InmueblesForm() {
  return (
    <div className="max-w-xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Agregar Inmueble</h1>
      <form action={crearInmueble} className="space-y-4">
        <input
          name="titulo"
          placeholder="Título"
          required
          className="w-full border p-2 rounded"
        />
        <textarea
          name="descripcion"
          placeholder="Descripción"
          className="w-full border p-2 rounded"
        />
        <input
          name="precio"
          type="number"
          step="0.01"
          placeholder="Precio"
          required
          className="w-full border p-2 rounded"
        />
        <input
          name="ubicacion"
          placeholder="Ubicación"
          required
          className="w-full border p-2 rounded"
        />
        <input
          name="imagenUrl"
          placeholder="URL de imagen"
          className="w-full border p-2 rounded"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Guardar
        </button>
      </form>
    </div>
  );
}
