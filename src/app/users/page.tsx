"use client";
import { useMutation, useQuery } from "@tanstack/react-query";
import { deleteUser, getUsers } from "./actions";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button, buttonVariants } from "@/components/ui/button";
import Link from "next/link";

function Users() {
  const data = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      return await getUsers();
    },
  });

  const deleteMutation = useMutation({
    mutationKey:["deleteUser"],
    mutationFn: async (userId: number) => {
        return await deleteUser(userId);
    },
    onSuccess: () => {
        console.log("Desactivando")
        data.refetch()
    },
    onError: (error)=>{
        console.error(error)
    }
  })

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Usuarios</TableHead>
            <TableHead className="w-[100px]">Nombre</TableHead>
            <TableHead className="w-[100px]">Contraseña</TableHead>
            <TableHead className="w-[100px]">Estado</TableHead>
            <TableHead className="w-[100px]">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.data?.map((users) => (
            <TableRow key={users.id}>
                <TableCell>{users.email}</TableCell>
                <TableCell>{users.name}</TableCell>
                <TableCell>{users.password}</TableCell>
                <TableCell>{users.isActive ? "Activo" : "Inactivo"}</TableCell>
                <TableCell><Button onClick={()=>{
                    deleteMutation.mutate(users.id)
                }} >...</Button></TableCell>
                <TableCell><Link className={buttonVariants({variant:"link"})} href={`/users/${users.id}`}>Actualizar</Link></TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
}

export default Users;
