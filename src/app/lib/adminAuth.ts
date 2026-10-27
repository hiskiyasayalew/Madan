import { supabase } from '@/lib/supabaseClient';

// Sign in as admin using native Supabase Auth
export async function signInAsAdmin(usernameOrEmail: string, password: string) {
  try {
    let email = usernameOrEmail.trim();

    // If input is a username, retrieve matching email first
    if (!email.includes('@')) {
      const { data: userData, error: findError } = await supabase
        .from('users')
        .select('email')
        .eq('username', email)
        .maybeSingle();

      if (findError || !userData?.email) {
        return { success: false, error: 'User not found' };
      }
      email = userData.email;
    }

    // Secure login request with native Supabase password verification
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      return { success: false, error: authError.message };
    }

    const authUser = authData.user;
    if (!authUser) {
      return { success: false, error: 'Authentication failed' };
    }

    // Fetch corresponding role metadata from the public profile schema
    const { data: profile, error: profileError } = await supabase
      .from('users')
      .select('*')
      .eq('id', authUser.id)
      .single();

    if (profileError || !profile) {
      return { success: false, error: 'Profile lookups failed' };
    }

    if (profile.role !== 'admin') {
      await supabase.auth.signOut();
      return { success: false, error: 'You do not have admin access' };
    }

    return {
      success: true,
      user: profile,
      role: profile.role
    };
  } catch (error) {
    console.error('Sign-in error:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}