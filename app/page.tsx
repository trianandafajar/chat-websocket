import { HomePage } from "@/components/landing/home-page";

export const metadata = {
  title: "Chat App - A lighter way to chat",
  description:
    "A simple chat app for talking with friends and small groups. Fast, tidy, and easy to use.",
  openGraph: {
    title: "Chat App - A lighter way to chat",
    description:
      "A simple chat app for talking with friends and small groups. Fast, tidy, and easy to use.",
    type: "website",
    images: [{ url: "/logo.svg" }],
  },
};

export default function Page() {
  return <HomePage />;
}
