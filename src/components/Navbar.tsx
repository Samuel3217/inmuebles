"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { buttonVariants } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { jwtDecode } from "jwt-decode";

type DecodedToken = {
  id: string;
  rol: "ADMIN" | "CLIENT";
  exp: number;
};

function Navbar() {
  const [userRole, setUserRole] = useState<"ADMIN" | "CLIENT" | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

 useEffect(() => {
  if (typeof window === "undefined") return;

  try {
    const tokenRow = document.cookie
      .split("; ")
      .find((row) => row.startsWith("token="));
    const token = tokenRow?.split("=")[1];

    console.log("TOKEN:", token);

    if (token) {
      const decoded: DecodedToken = jwtDecode(token);
      const now = Date.now() / 1000;
      if (decoded.exp < now) return;

      setIsLoggedIn(true);
      setUserRole(decoded.rol);
    }
  } catch (err) {
    console.error("Token inválido o expirado:", err);
  }
}, []);


  function handleLogout() {
    document.cookie =
      "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
    window.location.href = "/login";
  }

  return (
    <nav className="w-full h-[7vh] bg-gray-100 flex flex-row justify-between items-center px-4">
      <DropdownMenu>
        <DropdownMenuTrigger>Menú</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>¿Qué desea hacer?</DropdownMenuLabel>
          <DropdownMenuSeparator />

          {!isLoggedIn && (
            <>
            <DropdownMenuItem>
                <Link
                  href="/"
                  className={buttonVariants({ variant: "ghost" })}
                  >Home</Link>
            </DropdownMenuItem>
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
            </>
          )}

          {isLoggedIn && userRole === "ADMIN" && (
            <DropdownMenuItem>
              <Link
                href="/users"
                className={buttonVariants({ variant: "ghost" })}
              >
                Usuarios
              </Link>
            </DropdownMenuItem>
          )}

          {isLoggedIn && (
            <DropdownMenuItem>
              <button
                onClick={handleLogout}
                className={buttonVariants({ variant: "ghost", className: "w-full text-left" })}
              >
                Cerrar sesión
              </button>
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </nav>
  );
}

export default Navbar;
