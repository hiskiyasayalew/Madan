// lib/memberActions.ts
import { supabase } from './supabaseClient'

export const getMyProfile = async () => {
  try {
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) return { success: false };

    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', user.id)
      .maybeSingle();

    if (error) throw error;
    return { success: true, profile: data };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};

// --- NEW UPDATE FUNCTION ---
export const updateMyProfile = async (updates: any) => {
  try {
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) throw new Error("Not authenticated");

    // We only update the specific allowed fields
    const { data, error } = await supabase
      .from('users')
      .update(updates)
      .eq('id', user.id)
      .select()
      .single();

    if (error) throw error;
    return { success: true, profile: data };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) console.error("Error signing out:", error.message);
};