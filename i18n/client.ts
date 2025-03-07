import { createI18nClient } from 'next-intl/client';

export const { useMessages, useFormatter, useLocale, useTimeZone, useNow, useTranslations } = createI18nClient();
