"use client";
import { useQuery } from "@tanstack/react-query";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getUsers } from "../actions";
import RowActions from "./RowActions";

function Users() {
  const usersQuery = useQuery({
    queryKey: ["users"],
    queryFn: getUsers,
  });


  return(
        <Table>
          <TableCaption>Fin de usuarios</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Email</TableHead>
              <TableHead className="w-[100px]">Nombre</TableHead>
              <TableHead className="w-[100px]">Contraseña</TableHead>
              <TableHead className="w-[100px]">Estado</TableHead>
              <TableHead className="w-[100px]">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {usersQuery.data?.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.password}</TableCell>
                <TableCell>{user.isActive ? "Activo" : "Inactivo"}</TableCell>
                <TableCell>
                  <RowActions user={user} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
  )
}

export default Users;
