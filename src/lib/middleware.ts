// middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { createServerClient } from '@supabase/ssr'


export async function middleware(req: NextRequest) {



  const path = req.nextUrl.pathname
  

  // Skip middleware for API routes and static files
  if (path.startsWith('/_next') || path.startsWith('/api') || path.includes('.')) {
    return NextResponse.next()
  }

  // Create Supabase client
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get: (name) => req.cookies.get(name)?.value,
        set: () => {},
        remove: () => {},
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()

  // =========================
  // ADMIN ROUTES
  // =========================
  if (path.startsWith('/admin')) {

  if (path === '/admin/login') {
    return NextResponse.next();
  }

  const adminSession = req.cookies.get('admin_session');

  if (!adminSession) {
    return NextResponse.redirect(
      new URL('/admin/login', req.url)
    );
  }

  try {
    const session = JSON.parse(adminSession.value);

    if (
      !session.user ||
      session.user.role !== 'admin'
    ) {
      return NextResponse.redirect(
        new URL('/admin/login', req.url)
      );
    }

    const sessionAge =
      Date.now() - session.timestamp;

    const maxAge =
      24 * 60 * 60 * 1000;

    if (sessionAge > maxAge) {
      return NextResponse.redirect(
        new URL('/admin/login', req.url)
      );
    }

    return NextResponse.next();
  } catch {
    return NextResponse.redirect(
      new URL('/admin/login', req.url)
    );
  }
}

  // =========================
  // MEMBERS PANEL
  // =========================
  if (path.startsWith('/members-panel')) {
    if (!user) {
      return NextResponse.redirect(new URL('/login', req.url))
    }
    return NextResponse.next()
  }

  // =========================
  // LOGIN PAGE
  // =========================
  if (path === '/login') {
    if (user) {
      const { data: profile } = await supabase
        .from('users')
        .select('role')
        .eq('id', user.id)
        .single()

      if (profile?.role === 'admin') {
        return NextResponse.redirect(new URL('/admin/dashboard', req.url))
      }
      return NextResponse.redirect(new URL('/members-panel', req.url))
    }
    return NextResponse.next()
  }

  // =========================
  // ROOT - Redirect to appropriate page
  // =========================
  if (path === '/') {
    if (user) {
      const { data: profile } = await supabase
        .from('users')
        .select('role')
        .eq('id', user.id)
        .single()

      if (profile?.role === 'admin') {
        return NextResponse.redirect(new URL('/admin/dashboard', req.url))
      }
      return NextResponse.redirect(new URL('/members-panel', req.url))
    }
    return NextResponse.redirect(new URL('/login', req.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
  
}