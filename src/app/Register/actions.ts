"use server";

import db from "@/db";

export async function registerUser(formData: FormData) {
  const existingUser = await db.user.findFirst({
    where: { email: String(formData.get("email")) },
  });

  if (existingUser) return;

  const newUser = await db.user.create({
    data: {
      name: String(formData.get("name")),
      email: String(formData.get("email")),
      password: String(formData.get("password")),
    },
  });

  return newUser;
}
