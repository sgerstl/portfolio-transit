// Vercel Edge Middleware: first-visit locale detection.
//
// Behavior:
//   - If pref-locale cookie is set → pass through. Trust the user's explicit URL.
//   - First visit (no cookie) + primary Accept-Language is German + URL is not
//     already /de/* → 302 to /de equivalent and set the cookie.
//   - Otherwise → pass through. EN visitors don't get a cookie set here;
//     subsequent visits will re-check Accept-Language (cheap, regex on a
//     header). The toggle in Header.astro is the path that sets pref-locale=en
//     explicitly.

export const config = {
  // Skip static assets, API, Vercel internals. The negative lookahead on `.`
  // excludes any path with an extension (favicon.svg, *.png, *.css, *.js, etc.).
  matcher: '/((?!_vercel|api|.*\\..*).*)',
};

export default function middleware(req: Request): Response | undefined {
  const url = new URL(req.url);

  // Cookie already set → user has expressed a preference (either via the
  // toggle or via a previous middleware-driven redirect). Respect the URL.
  const cookieHeader = req.headers.get('cookie') ?? '';
  if (/(?:^|;\s*)pref-locale=/.test(cookieHeader)) {
    return undefined;
  }

  // First visit. Inspect primary Accept-Language preference.
  const acceptLang = req.headers.get('accept-language') ?? '';
  const primaryLang = acceptLang.split(',')[0]?.trim().toLowerCase() ?? '';
  const prefersGerman = primaryLang.startsWith('de');

  const pathname = url.pathname;
  const onDePath = pathname === '/de' || pathname.startsWith('/de/');

  if (prefersGerman && !onDePath) {
    const dePath = pathname === '/' ? '/de/' : `/de${pathname}`;
    return new Response(null, {
      status: 302,
      headers: {
        'Location': `${url.origin}${dePath}${url.search}`,
        'Set-Cookie': 'pref-locale=de; Path=/; Max-Age=31536000; SameSite=Lax',
        'Cache-Control': 'no-store',
      },
    });
  }

  return undefined;
}
