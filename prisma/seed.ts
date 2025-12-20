import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";

async function main() {
  const users = [
    { email: "alice@gmail.com", name: "Alice", password: "password" },
    { email: "bob@gmail.com", name: "Bob", password: "password" },
    { email: "carol@gmail.com", name: "Carol", password: "password" },
    { email: "dave@gmail.com", name: "Dave", password: "password" },
    { email: "user@gmail.com", name: "Eve", password: "password" },
  ];

  for (const u of users) {
    const hash = await bcrypt.hash(u.password, 10);

    await prisma.user.upsert({
      where: { email: u.email },
      update: {
        name: u.name,
        password: hash,
      },
      create: {
        email: u.email,
        name: u.name,
        password: hash,
      },
    });

    console.log("✔ Seeded:", u.email);
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
