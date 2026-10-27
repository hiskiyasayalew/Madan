import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import AdminDashboard from './adminDashBoard';

export const metadata = {
  title: 'Admin Panel | Management System',
  description: 'Control users, events, donations, and inventory.',
};

export default async function AdminPage() {
  const supabase = await createClient();
  
  // Securely retrieve verified server user record
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    redirect('/admin/login');
  }

  // Double-verify admin authorization role
  const { data: profile } = await supabase
    .from('users')
    .select('role')
    .eq('id', user.id)
    .single();

  if (!profile || profile.role !== 'admin') {
    redirect('/admin/login');
  }

  return (
    <main className="min-h-screen bg-zinc-950">
      <AdminDashboard />
    </main>
  );
}