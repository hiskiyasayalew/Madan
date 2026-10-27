// lib/login.ts
import { supabase } from './supabaseClient'

export const loginUser = async (username: string, password:  string) => {
  try {
    // 1. Call the database function to get email and status
    const { data: userData, error: rpcError } = await supabase
      .rpc('get_user_data_by_username', { u_name: username });

    if (rpcError) {
      console.error("RPC Error:", rpcError);
      throw new Error("Database lookup failed.");
    }

    // Check if user exists at all
    if (!userData || userData.length === 0) {
      throw new Error("Invalid username or password.");
    }

    const { res_email, res_status } = userData[0];

    // 2. Check if the account is still pending
    if (res_status === "pending") {
      throw new Error("Your account is still pending admin approval. Please check your email for updates.");
    }

    // 3. If they are 'active', perform the actual Auth login
    const { data, error: authError } = await supabase.auth.signInWithPassword({
      email: res_email,
      password: password,
    });

    if (authError) {
      // If Supabase Auth fails (wrong password), throw error
      throw new Error("Invalid username or password.");
    }

    // Return success only if we reached this point
    return { success: true, user: data.user };

  } catch (error: any) {
    return { 
      success: false, 
      message: error.message || "An unexpected error occurred." 
    };
  }
}