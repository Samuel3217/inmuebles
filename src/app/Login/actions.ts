"use server";

import prisma from "@/db";
import bcrypt from "bcrypt";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";


const secretKey = "secret";
const key = new TextEncoder().encode(secretKey);

interface JwtPayload extends Record<string, unknown> {
  validate: { email: string };
  role: { role: string };
  expires: Date;
}


export async function encrypt(payload: JwtPayload) {
  return await new SignJWT(payload as JwtPayload) // jose requiere que sea Record<string, unknown>
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("10s")
    .sign(key);
}

export async function decrypt(input: string): Promise<JwtPayload> {
  const { payload } = await jwtVerify<JwtPayload>(input, key, {
    algorithms: ["HS256"],
  });
  return payload;
}


export async function loginUser(formData: FormData) {
  const email = String(formData.get("email"));
  const password = String(formData.get("password"));

  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user || !user.password) {
      return { success: false, message: "Correo no encontrado" };
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return { success: false, message: "Contraseña incorrecta" };
    }

    // Verify credentials && get the user

const validate = { email: String(formData.get("email")) };
const role = { role: String(formData.get("role")) };
    if (!validate.email || !role.role) {
      return { success: false, message: "Datos incompletos" };
    }
    const expires = new Date(Date.now() + 10 * 1000);
    const session = await encrypt({ validate, role, expires });

    // Save the session in a cookie
    (await cookies()).set("session", session, { expires, httpOnly: true });


  } catch (error) {
    console.error("Error en loginUser:", error);
    return {
      success: false,
      message: "Error en el servidor al intentar iniciar sesión",
    };
  }
}

export async function logout() {
  // Destroy the session
  (await cookies()).set("session", "", { expires: new Date(0) });
}

export async function updateSession(request: NextRequest) {
  const session = request.cookies.get("session")?.value;
  if (!session) return;

  // Refresh the session so it doesn't expire
  const parsed = await decrypt(session);
  parsed.expires = new Date(Date.now() + 10 * 1000);
  const res = NextResponse.next();
  res.cookies.set({
    name: "session",
    value: await encrypt(parsed),
    httpOnly: true,
    expires: parsed.expires,
  });
  return res;
}
