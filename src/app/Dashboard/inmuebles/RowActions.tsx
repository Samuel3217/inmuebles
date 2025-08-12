"use client";

import React, { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { Inmueble } from "@prisma/client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MoreHorizontal } from "lucide-react";

import {
  updateInmueble as updateInmuebleAction,
  deleteInmueble as deleteInmuebleAction,
} from "@/app/inmuebles/actions"; // ajusta ruta si hace falta

type UpdateVariables = {
  id: number;
  formData: FormData;
};

export default function RowActions({ inmueble }: { inmueble: Inmueble }) {
  const queryClient = useQueryClient();
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  // Mutación para actualizar: TData = Inmueble, TError = unknown, TVariables = {id, formData}
  const updateMutation = useMutation<Inmueble, unknown, UpdateVariables>({
    mutationFn: async ({ id, formData }) => {
      // IMPORTANTE: si updateInmuebleAction viene de un "server action" puede que TS lo infera como `void`.
      // Aquí forzamos el tipo para que coincida con lo que realmente retorna (Promise<Inmueble>).
      return await (
        updateInmuebleAction as unknown as (
          id: number,
          formData: FormData
        ) => Promise<Inmueble>
      )(id, formData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["inmuebles"] });
      setEditOpen(false);
    },
    onError: (err) => {
      console.error("Error actualizando inmueble:", err);
    },
  });

  // Mutación para eliminar: TData = void, TVariables = number (id)
  const deleteMutation = useMutation<void, unknown, number>({
    mutationFn: async (id: number) => {
      return await (
        deleteInmuebleAction as unknown as (id: number) => Promise<void>
      )(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["inmuebles"] });
      setDeleteOpen(false);
    },
    onError: (err) => {
      console.error("Error eliminando inmueble:", err);
    },
  });

  function handleEditSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    updateMutation.mutate({ id: inmueble.id, formData });
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" aria-label="Acciones">
            <MoreHorizontal />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Acciones</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => setEditOpen(true)}>
            Editar
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setDeleteOpen(true)}>
            Eliminar
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Dialog Editar */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Inmueble</DialogTitle>
            <DialogDescription>
              Modifica los datos y guarda los cambios.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleEditSubmit} className="space-y-4">
            <Input
              id={`titulo-${inmueble.id}`}
              name="titulo"
              defaultValue={inmueble.titulo ?? ""}
              required
            />
            <Input
              id={`descripcion-${inmueble.id}`}
              name="descripcion"
              defaultValue={inmueble.descripcion ?? ""}
            />
            <Input
              id={`precio-${inmueble.id}`}
              name="precio"
              type="number"
              step="0.01"
              defaultValue={String(inmueble.precio ?? "")}
              required
            />
            <Input
              id={`ubicacion-${inmueble.id}`}
              name="ubicacion"
              defaultValue={inmueble.ubicacion ?? ""}
              required
            />

            <DialogFooter>
              <Button type="submit">
                Guardar
              </Button>
              <Button variant="outline" onClick={() => setEditOpen(false)}>
                Cancelar
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Dialog Eliminar */}
      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Eliminar Inmueble</DialogTitle>
          </DialogHeader>

          <div className="px-2 pb-4">
            ¿Seguro que quieres eliminarlo?
          </div>

          <DialogFooter>
            <Button
              variant="destructive"
              onClick={() => deleteMutation.mutate(inmueble.id)}
            >
              Eliminar
            </Button>
            <Button variant="outline" onClick={() => setDeleteOpen(false)}>
              Cancelar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
