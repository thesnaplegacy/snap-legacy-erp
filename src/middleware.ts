import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

const IS_DEMO = process.env.NEXT_PUBLIC_DEMO_MODE !== 'false';

export async function middleware(request: NextRequest) {
  // In demo mode, use lightweight demo_session cookie auth to bypass Supabase SSR
  if (IS_DEMO) {
    const hasSession = request.cookies.get('demo_session')?.value === 'true';
    const isLoginPage = request.nextUrl.pathname === '/login';
    const isAuthCallback = request.nextUrl.pathname === '/auth/callback';

    // Support service.thesnaplegacy.com subdomain routing
    const host = request.headers.get('host') || '';
    const isServiceSubdomain = host.startsWith('service.') || host.includes('service.thesnaplegacy');

    // If authenticated in demo mode and visiting /login, redirect to dashboard or service
    if (hasSession && isLoginPage) {
      const url = request.nextUrl.clone();
      url.pathname = isServiceSubdomain ? '/service' : '/';
      return NextResponse.redirect(url);
    }

    // If unauthenticated in demo mode and visiting protected routes, redirect to /login
    if (!hasSession && !isLoginPage && !isAuthCallback) {
      const url = request.nextUrl.clone();
      url.pathname = '/login';
      return NextResponse.redirect(url);
    }

    // Subdomain rewrite: service.thesnaplegacy.com/* -> /service/*
    if (isServiceSubdomain && !request.nextUrl.pathname.startsWith('/service') && !request.nextUrl.pathname.startsWith('/login') && !request.nextUrl.pathname.startsWith('/auth')) {
      const url = request.nextUrl.clone();
      url.pathname = `/service${request.nextUrl.pathname === '/' ? '' : request.nextUrl.pathname}`;
      return NextResponse.rewrite(url);
    }

    return NextResponse.next({ request });
  }

  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // Refresh session — IMPORTANT: use getUser() not getSession() for security
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Auth guard: redirect unauthenticated users to login
  const isLoginPage = request.nextUrl.pathname === '/login';
  const isAuthCallback = request.nextUrl.pathname === '/auth/callback';

  if (!user && !isLoginPage && !isAuthCallback) {
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    return NextResponse.redirect(url);
  }

  // Redirect authenticated users away from login page
  if (user && isLoginPage) {
    const url = request.nextUrl.clone();
    url.pathname = '/';
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
