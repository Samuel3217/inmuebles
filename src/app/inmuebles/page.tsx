"use client";
import { useQuery } from "@tanstack/react-query";
import { tipoDeCambio } from "./actions";
import { useEffect, useState } from "react";
import { showinmuebles } from "./actions";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";


type Coins = "MXN" | "USD" | "CAD" | "AUD"

const monedas: Coins[] = ["MXN", "USD", "CAD", "AUD"];

export default function InmueblesPage() {

    const [coin, setCoin] = useState<Coins>("MXN");

  const cambio = useQuery({
    queryKey: ["elcambio"],
    queryFn: async () => {
      const uwu = await tipoDeCambio(coin);
      console.log(uwu);
      return uwu;
    },
  });

  const mostrar = useQuery({
    queryKey: ["mostrando"],
    queryFn: async () => {
        const show = await showinmuebles();
        console.log(show);
        return show;

    },
  });

  useEffect(() => {
    console.log(cambio.data);
    console.log(cambio.error)
    console.log(cambio.status)
  }, [cambio, cambio.status]);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Inmuebles</h1>
      <ul className="space-y-4">
        {mostrar.data &&
          mostrar.data.map((i) => (
            <li key={i.id} className="border p-4 rounded">
              <h2 className="text-xl font-semibold">{i.titulo}</h2>
              <p>{i.descripcion}</p>
              <p className="font-bold">
                ${cambio.data && i.precio * cambio.data.data.rates.USD}
                <Select onValueChange={(value) => setCoin(value as Coins)}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Cambiar moneda" />
                  </SelectTrigger>
                  <SelectContent>
                    {monedas.map((moneda) => (
                      <SelectItem key={moneda} value={moneda}>
                        {moneda}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </p>
              <p>{i.ubicacion}</p>
              {i.imagenUrl && <img src={i.imagenUrl} className="size-24" />}
            </li>
          ))}
      </ul>
    </div>
  );
}
