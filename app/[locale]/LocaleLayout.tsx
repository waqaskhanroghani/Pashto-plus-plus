import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from '@/i18n/server';

export default async function LocaleLayout({
  children,
  locale
}: {
  children: React.ReactNode;
  locale: string;
}) {
  const messages = await getMessages(locale);

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      {children}
    </NextIntlClientProvider>
  );
}
