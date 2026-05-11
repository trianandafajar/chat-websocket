import { auth } from "@/app/auth";
import LoginPage from "./LoginPage";
import { redirect } from 'next/navigation';

export default async function Page() {
  const session = await auth();

  if(session) {
    redirect('/messages');
  } 

  return <LoginPage />;
}
