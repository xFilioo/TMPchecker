"use client"

import { useLanguage } from "@/lib/i18n/language-context"

export function LanguageMetadata({
  textKey,
}: { textKey: keyof typeof import("@/lib/i18n/translations").translations.en }) {
  const { t } = useLanguage()
  return <>{t(textKey)}</>
}
