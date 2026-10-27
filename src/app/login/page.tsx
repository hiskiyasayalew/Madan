import Header from "../components/ui/Header";
import Login from "./Login"; 
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';

export default async function Page() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // Redirect to dashboard if session exists and is authorized
  if (user) {
    const { data: profile } = await supabase
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single();

    if (profile && ['user', 'sub-admin', 'admin'].includes(profile.role)) {
      redirect('/members-panel');
    }
  }

  return (
    <main className="min-h-screen w-full flex flex-col">
      <Header />
      <Login />
    </main>
  );
}