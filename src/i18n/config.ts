import en from './locales/en.json'
import ptBR from './locales/pt-BR.json'
import es from './locales/es.json'
import fr from './locales/fr.json'
import de from './locales/de.json'
import it from './locales/it.json'
import ptPT from './locales/pt-PT.json'
import ja from './locales/ja.json'
import ko from './locales/ko.json'
import zh from './locales/zh.json'
import ar from './locales/ar.json'

export type LanguageCode =
  | 'en'
  | 'pt-BR'
  | 'es'
  | 'fr'
  | 'de'
  | 'it'
  | 'pt-PT'
  | 'ja'
  | 'ko'
  | 'zh'
  | 'ar'

export type LanguageInfo = {
  code: LanguageCode
  flag: string
  name: string
  native: string
  intlLocale: string
  rtl: boolean
}

export const languages: LanguageInfo[] = [
  { code: 'en', flag: '🇺🇸', name: 'English', native: 'English', intlLocale: 'en-US', rtl: false },
  {
    code: 'pt-BR',
    flag: '🇧🇷',
    name: 'Portuguese',
    native: 'Português',
    intlLocale: 'pt-BR',
    rtl: false,
  },
  { code: 'es', flag: '🇪🇸', name: 'Spanish', native: 'Español', intlLocale: 'es-ES', rtl: false },
  { code: 'fr', flag: '🇫🇷', name: 'French', native: 'Français', intlLocale: 'fr-FR', rtl: false },
  { code: 'de', flag: '🇩🇪', name: 'German', native: 'Deutsch', intlLocale: 'de-DE', rtl: false },
  { code: 'it', flag: '🇮🇹', name: 'Italian', native: 'Italiano', intlLocale: 'it-IT', rtl: false },
  {
    code: 'pt-PT',
    flag: '🇵🇹',
    name: 'Portuguese (PT)',
    native: 'Português',
    intlLocale: 'pt-PT',
    rtl: false,
  },
  { code: 'ja', flag: '🇯🇵', name: 'Japanese', native: '日本語', intlLocale: 'ja-JP', rtl: false },
  { code: 'ko', flag: '🇰🇷', name: 'Korean', native: '한국어', intlLocale: 'ko-KR', rtl: false },
  { code: 'zh', flag: '🇨🇳', name: 'Chinese', native: '简体中文', intlLocale: 'zh-CN', rtl: false },
  { code: 'ar', flag: '🇸🇦', name: 'Arabic', native: 'العربية', intlLocale: 'ar-SA', rtl: true },
]

export const defaultLanguage: LanguageCode = 'en'

export const translations: Record<string, any> = {
  en,
  'pt-BR': ptBR,
  es,
  fr,
  de,
  it,
  'pt-PT': ptPT,
  ja,
  ko,
  zh,
  ar,
}

export function getLanguageInfo(code: LanguageCode): LanguageInfo {
  return languages.find((l) => l.code === code) ?? languages[0]
}

export function detectBrowserLanguage(): LanguageCode | null {
  if (typeof navigator === 'undefined') return null
  const browserLang = navigator.language.toLowerCase()
  for (const lang of languages) {
    if (
      browserLang === lang.intlLocale.toLowerCase() ||
      browserLang.startsWith(lang.code.toLowerCase())
    ) {
      return lang.code
    }
  }
  return null
}
