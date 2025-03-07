import createMiddleware from 'next-intl/middleware';
import { locales } from './i18n/navigation';

export default createMiddleware({
  // A list of all locales that are supported
  locales: locales,
  
  // If this locale is matched, pathnames work without a prefix (e.g. `/about`)
  defaultLocale: 'en',
  
  // This function is called when a request without a locale prefix is received
  localePrefix: 'always',
  
  // Domains can be used to configure different locales to be served from different domains
  // domains: [
  //   {
  //     domain: 'example.com',
  //     defaultLocale: 'en'
  //   },
  //   {
  //     domain: 'example.ps',
  //     defaultLocale: 'ps'
  //   }
  // ]
});

export const config = {
  // Match all pathnames except for
  // - files in the public folder (e.g. /favicon.ico)
  // - API routes
  // - /_next (Next.js internals)
  matcher: ['/((?!api|_next|.*\\..*).*)'],
};
