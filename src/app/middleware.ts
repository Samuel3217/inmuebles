import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const secret = new TextEncoder().encode(
  process.env.JWT_SECRET || "your_secret_key"
);

export async function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value;

  console.log("Token obtenido de la cookie:", token);

  if (!token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  try {
    const { payload } = await jwtVerify(token, secret);
    console.log("Payload decodificado:", payload);

    if (payload.role === "ADMIN") {
      return NextResponse.next();
    }

    return NextResponse.redirect(new URL("/unauthorized", req.url));
  } catch (err) {
    console.error("Error verificando token:", err);
    return NextResponse.redirect(new URL("/login", req.url));
  }
}

export const config = {
  matcher: ["/Dashboard/:path*"],
};
    // Aplica el middleware solo a las rutas bajo /Dashboard
