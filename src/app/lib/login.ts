import { supabase } from '../../lib/supabaseClient';

export async function loginUser(usernameOrEmail: string, password: string) {
  try {
    let email = usernameOrEmail.trim();

    // Map username to email if it does not contain the '@' symbol
    if (!email.includes('@')) {
      const { data: userData, error: findError } = await supabase
        .from('users')
        .select('email')
        .eq('username', email)
        .maybeSingle();

      if (findError || !userData?.email) {
        return { success: false, message: 'The username specified was not found.' };
      }
      email = userData.email;
    }

    // Authenticate with Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      return { success: false, message: authError.message };
    }

    const authUser = authData.user;
    if (!authUser) {
      return { success: false, message: 'Authentication initialization failed.' };
    }

    // Verify matching user profile exists in public schema
    const { data: profile, error: profileError } = await supabase
      .from('users')
      .select('role')
      .eq('id', authUser.id)
      .single();

    if (profileError || !profile) {
      await supabase.auth.signOut();
      return { success: false, message: 'Profile record not found.' };
    }

    return {
      success: true,
      user: profile,
      role: profile.role,
    };
  } catch (error: any) {
    return { success: false, message: error.message || 'An unexpected server error occurred.' };
  }
}