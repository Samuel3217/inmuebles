"use client";
import {useQuery } from "@tanstack/react-query";
import {getUsers } from "./actions";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import RowActions from "./RowActions";

function Users() {
  const data = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      return await getUsers();
    },
  });

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
              <TableCell>
                        <RowActions user={users}/>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
}

export default Users;
