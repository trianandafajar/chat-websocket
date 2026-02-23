import { auth } from "@/app/auth";
import LoginPage from "./LoginPage";
import { redirect } from 'next/navigation';

export default async function Page() {
  const session = await auth();

  if(session) {
    console.log('test');
    
    redirect('/messages');
  } 

  return <LoginPage />;
}
