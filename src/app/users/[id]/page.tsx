"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getUserById, updateUser } from "../actions";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useMutation, useQuery } from "@tanstack/react-query";

export default function EditUserPage() {
  const { id } = useParams();
  const router = useRouter();

  const [name, setName] = useState("");

  const { data, isLoading } = useQuery({
    queryKey: ["user", id],
    queryFn: () => getUserById(Number(id)),
    enabled: !!id,
  });

  const updateMutation = useMutation({
    mutationFn: (formData: FormData) => updateUser(Number(id), formData),
    onSuccess: () => {
      alert("Usuario actualizado");
      router.push("/users");
    },
    onError: () => {
      alert("Error al actualizar el usuario");
    },
  });

  useEffect(() => {
    if (data) {
      setName(data.name ?? "");
    }
  }, [data]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const form = new FormData();
    form.append("name", name);
    updateMutation.mutate(form);
  };

  if (isLoading) return <p className="p-4">Cargando...</p>;

  return (
    <div className="max-w-md mx-auto p-6">
      <h2 className="text-xl font-bold mb-4">Editar Usuario</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          type="text"
          placeholder="Nombre"
          value={name}
          onChange={(e) => setName(e.target.value)}
          name="name"
        />
        <Button type="submit" disabled={updateMutation.isPending}>
          {updateMutation.isPending ? "Actualizando..." : "Actualizar"}
        </Button>
      </form>
    </div>
  );
}
