import { createSharedPathnamesNavigation } from 'next-intl/navigation';

export const locales = ['en', 'ps'] as const;
export const localePrefix = 'always'; // 'as-needed' | 'always' | 'never'

export const { Link, redirect, usePathname, useRouter } = createSharedPathnamesNavigation({ locales, localePrefix });

export function generateStaticParams() {
  return locales.map(locale => ({ locale }));
}
