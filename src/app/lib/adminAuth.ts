import { supabase } from '@/lib/supabaseClient';

// Sign in as admin using native Supabase Auth

export async function signInAsAdmin(
  usernameOrEmail: string,
  password: string
) {
  try {
    const response = await fetch("/api/auth/username-login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        usernameOrEmail,
        password,
        adminOnly: true,
      }),
    });

    const result = await response.json();

    return {
      success: response.ok && result.success === true,
      error: result.message,
      user: result.user,
      role: result.role,
    };
  } catch (error: unknown) {
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "An unexpected login error occurred.",
    };
  }
}
