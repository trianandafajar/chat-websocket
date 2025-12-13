"use server";

import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";

export async function registerAction(formData: FormData) {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const confirm = formData.get("confirm") as string;

  if (!name || !email || !password) {
    return { error: "All fields are required" };
  }

  if (password !== confirm) {
    return { error: "Passwords do not match" };
  }

  const exists = await prisma.user.findUnique({ where: { email } });
  if (exists) {
    return { error: "Email already registered" };
  }

  const hash = await bcrypt.hash(password, 12);

  await prisma.user.create({
    data: {
      name,
      email,
      password: hash,
      authProvider: "credentials",
    },
  });

  return { success: true };
}
