import Link from "next/link";
import { buttonVariants } from "./ui/button";

function Navbar() {
  return (
    <nav className="w-full h-[7vh] bg-gray-100 flex flex-row justify-between items-center px-4">
      <div>
        <Link href="/Register" className={buttonVariants({ variant: "ghost" })}>
          Registrarse
        </Link>
        <Link href="/Login" className={buttonVariants({ variant: "ghost" })}>
          Iniciar sesion
        </Link>
        <Link href="/users" className={buttonVariants({ variant: "ghost" })}>
          Usuarios
        </Link>
      </div>
    </nav>
  );
}

export default Navbar
