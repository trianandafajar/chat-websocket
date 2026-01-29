import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import ChatApp from "./ChatApp";

export default async function MessagesPage() {
  const session = await getServerSession();

  console.log("test", session);
  
  if (!session) redirect("/");

  return <ChatApp />;
}
