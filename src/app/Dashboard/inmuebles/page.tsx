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
import { getInmuebles } from "@/app/inmuebles/actions";
import RowActions from "./RowActions";
import { Button } from "@/components/ui/button";
import Link from "next/link";

function Inmuebles() {
  const inmueblesQuery = useQuery({
    queryKey: ["inmuebles"],
    queryFn: getInmuebles,
  });

  return (
    <>
      <div className="flex flex-col justify-center items-center gap-5 py-5">
        <Button className="items-center justify-center">
          <Link href={"/CrearInmueble"}>Crear Inmueble</Link>
        </Button>
        <Table>
          <TableCaption>Fin de la lista de inmuebles</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[150px]">Título</TableHead>
              <TableHead className="w-[250px]">Descripción</TableHead>
              <TableHead className="w-[100px]">Precio</TableHead>
              <TableHead className="w-[150px]">Ubicación</TableHead>
              <TableHead className="w-[100px]">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {inmueblesQuery.data?.map((inmueble) => (
              <TableRow key={inmueble.id}>
                <TableCell>{inmueble.titulo}</TableCell>
                <TableCell>{inmueble.descripcion}</TableCell>
                <TableCell>
                  {inmueble.precio.toLocaleString("es-MX", {
                    style: "currency",
                    currency: "MXN",
                  })}
                </TableCell>
                <TableCell>{inmueble.ubicacion}</TableCell>
                <TableCell>
                  <RowActions inmueble={inmueble} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </>
  );
}

export default Inmuebles;
