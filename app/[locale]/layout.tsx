import { generateStaticParams } from '@/i18n/navigation';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from '@/i18n/server';

export { generateStaticParams };

export default async function LocaleRootLayout({
  children,
  params: { locale }
}: Readonly<{
  children: React.ReactNode;
  params: { locale: string };
}>) {
  const messages = await getMessages(locale);
  
  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      {children}
    </NextIntlClientProvider>
  );
}
