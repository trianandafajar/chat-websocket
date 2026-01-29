import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import ChatApp from "./ChatApp";
import { authOptions } from "@/lib";
import { headers } from "next/headers";

export default async function MessagesPage() {
  headers();
  const session = await getServerSession(authOptions);
  if (!session) redirect("/");

  return <ChatApp />;
}
