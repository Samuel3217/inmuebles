// actions.ts
"use server";

import db from "@/db";
import bcrypt from "bcrypt";

export async function registerUser(formData: FormData) {
  const email = String(formData.get("email"));
  const password = String(formData.get("password"));

  const existingUser = await db.user.findFirst({
    where: { email },
  });

  if (existingUser) return;

  const hashedPassword = await bcrypt.hash(password, 10); // 10 salt rounds

  const newUser = await db.user.create({
    data: {
      email,
      password: hashedPassword,
    },
  });

  return newUser;
}
