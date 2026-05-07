import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";
import sharp from "sharp";
import { readFile } from "node:fs/promises";
import path from "node:path";

const AVATAR_MAX = 256;
const JPEG_QUALITY = 85;

async function compressedDataUrl(absPath: string): Promise<string> {
  const input = await readFile(absPath);
  const out = await sharp(input)
    .resize(AVATAR_MAX, AVATAR_MAX, { fit: "cover", position: "centre" })
    .jpeg({ quality: JPEG_QUALITY, mozjpeg: true })
    .toBuffer();
  return `data:image/jpeg;base64,${out.toString("base64")}`;
}

async function main() {
  const publicDir = path.resolve(process.cwd(), "public");

  // Compress 3 referenced avatars
  const [avatar1, avatar2, avatar3] = await Promise.all([
    compressedDataUrl(path.join(publicDir, "avatar1.jpg")),
    compressedDataUrl(path.join(publicDir, "avatar2.jpg")),
    compressedDataUrl(path.join(publicDir, "avatar3.jpg")),
  ]);

  console.log(`✔ Compressed avatars (~${Math.round(avatar1.length / 1024)}KB, ${Math.round(avatar2.length / 1024)}KB, ${Math.round(avatar3.length / 1024)}KB)`);

  const users: Array<{
    email: string;
    name: string;
    password: string;
    picture?: string;
    bio?: string;
  }> = [
    // 3 users with avatars
    { email: "alice@gmail.com", name: "Alice", password: "password", picture: avatar1, bio: "Designer & coffee enthusiast ☕" },
    { email: "bob@gmail.com", name: "Bob", password: "password", picture: avatar2, bio: "Backend dev. Loves dogs." },
    { email: "carol@gmail.com", name: "Carol", password: "password", picture: avatar3, bio: "Photographer + traveler 📷" },

    // The rest — initials only
    { email: "dave@gmail.com", name: "Dave", password: "password" },
    { email: "user@gmail.com", name: "Eve", password: "password", bio: "Hi, I'm Eve 👋" },
    { email: "frank@gmail.com", name: "Frank", password: "password" },
    { email: "grace@gmail.com", name: "Grace", password: "password" },
    { email: "henry@gmail.com", name: "Henry", password: "password" },
    { email: "iris@gmail.com", name: "Iris", password: "password" },
    { email: "jack@gmail.com", name: "Jack", password: "password" },
    { email: "kate@gmail.com", name: "Kate", password: "password" },
    { email: "leo@gmail.com", name: "Leo", password: "password" },
    { email: "mia@gmail.com", name: "Mia", password: "password" },
    { email: "noah@gmail.com", name: "Noah", password: "password" },
    { email: "olivia@gmail.com", name: "Olivia", password: "password" },
    { email: "peter@gmail.com", name: "Peter", password: "password" },
    { email: "quinn@gmail.com", name: "Quinn", password: "password" },
    { email: "rachel@gmail.com", name: "Rachel", password: "password" },
    { email: "sam@gmail.com", name: "Sam", password: "password" },
    { email: "tina@gmail.com", name: "Tina", password: "password" },
    { email: "uma@gmail.com", name: "Uma", password: "password" },
    { email: "victor@gmail.com", name: "Victor", password: "password" },
  ];

  for (const u of users) {
    const hash = await bcrypt.hash(u.password, 10);

    await prisma.user.upsert({
      where: { email: u.email },
      update: {
        name: u.name,
        password: hash,
        ...(u.picture !== undefined ? { picture: u.picture } : {}),
        ...(u.bio !== undefined ? { bio: u.bio } : {}),
      },
      create: {
        email: u.email,
        name: u.name,
        password: hash,
        ...(u.picture !== undefined ? { picture: u.picture } : {}),
        ...(u.bio !== undefined ? { bio: u.bio } : {}),
      },
    });

    const tag = u.picture ? "📷" : "  ";
    console.log(`${tag} Seeded: ${u.email}`);
  }

  console.log(`\n✔ Done — ${users.length} users seeded.`);
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
