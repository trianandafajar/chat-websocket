import NextAuth, { type NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),

  session: {
    strategy: "jwt",
  },

  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),

    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },

      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) return null;

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user || !user.password) return null;

        const valid = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!valid) return null;

        // NOTE: image sengaja tidak di-return supaya tidak masuk JWT cookie.
        // Foto profil di-fetch lewat /api/profile untuk hindari HTTP 431.
        return {
          id: user.id,
          email: user.email,
          name: user.name,
        };
      },
    }),
  ],

  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "google") {
        await prisma.user.upsert({
          where: { email: user.email! },
          update: {
            name: user.name,
            picture: user.image,
            authProvider: "google",
            providerId: account.providerAccountId,
          },
          create: {
            email: user.email!,
            name: user.name,
            picture: user.image ?? "https://via.placeholder.com/150",
            authProvider: "google",
            providerId: account.providerAccountId,
          },
        });
      }

      return true;
    },

    async jwt({ token, user, trigger, session }) {
      // SAAT LOGIN
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
      }

      // SAAT useSession().update({ name }) DIPANGGIL DARI CLIENT
      if (trigger === "update" && session) {
        if (session.name !== undefined) token.name = session.name;
      }

      // PENTING: picture tidak boleh masuk JWT — base64 avatar bisa
      // membuat cookie > 8KB dan trigger HTTP 431. Foto di-fetch dari /api/profile.
      // Hapus jika pernah ke-set (misal dari Google provider atau session lama).
      if ("picture" in token) {
        delete token.picture;
      }

      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.email = token.email as string;
        session.user.name = token.name as string;
        // image sengaja tidak di-set dari token; consumer harus fetch /api/profile.
      }

      return session;
    },
  },

  pages: {
    signIn: "/",
  },

  secret: process.env.NEXTAUTH_SECRET,
};

export default NextAuth(authOptions);
