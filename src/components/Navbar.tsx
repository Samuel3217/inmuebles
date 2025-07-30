// src/components/Navbar.tsx
"use client"

import Link from "next/link";
import { buttonVariants } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
// import { getUserRole } from "@/lib/getUserRole";
// import { useEffect, useState } from "react";



function Navbar() {

//     const [role, setRole] = useState("CLIENT");

//  useEffect(() => {
//     async function getUserRoleLocal() {
//         if (userId) {
//           setRole(await getUserRole(userId));
//         }
//     }
//     getUserRoleLocal()
//  }, []);

  return (
    <nav className="w-full h-[7vh] bg-gray-100 flex flex-row justify-between items-center px-4">
      <DropdownMenu>
        <DropdownMenuTrigger>Iniciar Sesión</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>¿Qué desea hacer?</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <Link
              href="/Register"
              className={buttonVariants({ variant: "ghost" })}
            >
              Registrarse
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Link
              href="/Login"
              className={buttonVariants({ variant: "ghost" })}
            >
              Iniciar sesión
            </Link>
          </DropdownMenuItem>

          {/* {role === "ADMIN" && ( */}
            <DropdownMenuItem>
              <Link
                href="/users"
                className={buttonVariants({ variant: "ghost" })}
              >
                Usuarios
              </Link>
            </DropdownMenuItem>
          {/* )} */}
        </DropdownMenuContent>
      </DropdownMenu>
    </nav>
  );
}

export default Navbar;
