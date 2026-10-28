import { supabase } from '../../lib/supabaseClient';


export async function loginUser(
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
        adminOnly: false,
      }),
    });

    const result = await response.json();

    return {
      success: response.ok && result.success === true,
      message: result.message,
      user: result.user,
      role: result.role,
    };
  } catch (error: unknown) {
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "An unexpected login error occurred.",
    };
  }
}
