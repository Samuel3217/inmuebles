import { Button } from "@/components/ui/button";
import Link from "next/link";


function page() {
  return (
    <div className="flex flex-col gap-5 items-center justify-center h-screen">
      <h1 className="text-6xl font-bold py-5">¿Buscas un hogar?</h1>
      <Button
        size="lg"
        className="bg-white border-4 text-2xl hover:bg-gray-300 transition-all duration-300 text-yellow-600"
      >
        <Link href="/inmuebles">Ver Inmuebles</Link>
      </Button>
      <div className="border-2 border-gray-300 rounded-lg p-4">
        <img src="images/nice.jpg" alt="Departamentos" />
      </div>
    </div>
  );
}

export default page
