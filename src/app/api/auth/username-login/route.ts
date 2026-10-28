
import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";

export const runtime = "nodejs";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export async function POST(request: NextRequest) {
  try {
    if (!supabaseUrl || !anonKey || !serviceRoleKey) {
      console.error("Missing Supabase server environment variables.");

      return NextResponse.json(
        { success: false, message: "Authentication is not configured." },
        { status: 500 }
      );
    }

    const body = await request.json();
    const usernameOrEmail =
      typeof body.usernameOrEmail === "string"
        ? body.usernameOrEmail.trim()
        : "";
    const password =
      typeof body.password === "string" ? body.password : "";
    const adminOnly = body.adminOnly === true;

    if (!usernameOrEmail || !password) {
      return NextResponse.json(
        { success: false, message: "Enter your username and password." },
        { status: 400 }
      );
    }

    // Server-only client for looking up the account despite users-table RLS.
    const adminClient = createClient(supabaseUrl, serviceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });

    let email = usernameOrEmail;

    if (!usernameOrEmail.includes("@")) {
      const { data: account, error: lookupError } = await adminClient
        .from("users")
        .select("email")
        .eq("username", usernameOrEmail)
        .maybeSingle();

      if (lookupError) {
        console.error("Username lookup failed:", lookupError.message);
      }

      if (lookupError || !account?.email) {
        return NextResponse.json(
          { success: false, message: "Invalid username or password." },
          { status: 401 }
        );
      }

      email = account.email;
    }

    // Use the user's normal Supabase Auth session and cookies.
    const cookieStore = await cookies();

    const authClient = createServerClient(supabaseUrl, anonKey, {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options);
          });
        },
      },
    });

    const { data: authData, error: authError } =
      await authClient.auth.signInWithPassword({
        email,
        password,
      });

    if (authError || !authData.user) {
      return NextResponse.json(
        { success: false, message: "Invalid username or password." },
        { status: 401 }
      );
    }

    // Read the authoritative role and status using the server-only client.
    const { data: profile, error: profileError } = await adminClient
      .from("users")
      .select("id, username, full_name, email, role, status")
      .eq("id", authData.user.id)
      .maybeSingle();

    if (profileError || !profile) {
      await authClient.auth.signOut();

      return NextResponse.json(
        { success: false, message: "Your user profile could not be verified." },
        { status: 403 }
      );
    }

    if (profile.status !== "active") {
      await authClient.auth.signOut();

      return NextResponse.json(
        { success: false, message: "Your account is not active." },
        { status: 403 }
      );
    }

    if (adminOnly && profile.role !== "admin") {
      await authClient.auth.signOut();

      return NextResponse.json(
        { success: false, message: "You do not have admin access." },
        { status: 403 }
      );
    }

    return NextResponse.json({
      success: true,
      user: profile,
      role: profile.role,
    });
  } catch (error: unknown) {
    console.error("Username login error:", error);

    return NextResponse.json(
      { success: false, message: "An unexpected login error occurred." },
      { status: 500 }
    );
  }
}
