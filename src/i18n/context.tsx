import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react'
import {
  languages,
  defaultLanguage,
  translations,
  getLanguageInfo,
  detectBrowserLanguage,
  type LanguageCode,
} from './config'
import {
  formatDate,
  formatNumber,
  formatCurrency,
  formatRelativeTime,
  formatOdds,
} from './formatters'

type I18nContextType = {
  language: LanguageCode
  setLanguage: (lang: LanguageCode) => void
  t: (key: string, params?: Record<string, string>) => string
  formatDate: (date: Date | string, options?: Intl.DateTimeFormatOptions) => string
  formatNumber: (num: number, options?: Intl.NumberFormatOptions) => string
  formatCurrency: (amount: number, currency?: string) => string
  formatRelativeTime: (minutes: number) => string
  formatOdds: (odds: number) => string
  explain: (key: string) => string
  showBanner: boolean
  dismissBanner: () => void
  neverAskAgain: () => void
  detectedLanguage: LanguageCode | null
  isRTL: boolean
  languages: typeof languages
}

const I18nContext = createContext<I18nContextType | null>(null)

const STORAGE_KEY = 'predictx-language'
const BANNER_KEY = 'predictx-language-banner'

function getNestedValue(obj: any, path: string): any {
  return path.split('.').reduce((acc, key) => acc?.[key], obj)
}

function interpolate(str: string, params?: Record<string, string>): string {
  if (!params) return str
  return str.replace(/\{(\w+)\}/g, (_, key) => params[key] ?? '')
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<LanguageCode>(() => {
    if (typeof window === 'undefined') return defaultLanguage
    const saved = localStorage.getItem(STORAGE_KEY) as LanguageCode | null
    return saved && translations[saved] ? saved : defaultLanguage
  })
  const [detectedLanguage, setDetectedLanguage] = useState<LanguageCode | null>(null)
  const [showBanner, setShowBanner] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    const bannerDismissed = localStorage.getItem(BANNER_KEY)
    if (!saved && bannerDismissed !== 'never') {
      const detected = detectBrowserLanguage()
      if (detected && detected !== defaultLanguage) {
        setDetectedLanguage(detected)
        setShowBanner(true)
      }
    }
  }, [])

  useEffect(() => {
    const info = getLanguageInfo(language)
    document.documentElement.lang = language
    document.documentElement.dir = info.rtl ? 'rtl' : 'ltr'
  }, [language])

  const setLanguage = useCallback((lang: LanguageCode) => {
    setLanguageState(lang)
    localStorage.setItem(STORAGE_KEY, lang)
    setShowBanner(false)
  }, [])

  const dismissBanner = useCallback(() => setShowBanner(false), [])

  const neverAskAgain = useCallback(() => {
    localStorage.setItem(BANNER_KEY, 'never')
    setShowBanner(false)
  }, [])

  const t = useCallback(
    (key: string, params?: Record<string, string>) => {
      let value = getNestedValue(translations[language], key)
      if (value === undefined) {
        value = getNestedValue(translations[defaultLanguage], key)
      }
      if (value === undefined) return key
      return interpolate(value, params)
    },
    [language],
  )

  const explain = useCallback((key: string) => t(`glossary.${key}`), [t])

  const info = getLanguageInfo(language)

  const value: I18nContextType = {
    language,
    setLanguage,
    t,
    formatDate: (date, options) => formatDate(date, language, options),
    formatNumber: (num, options) => formatNumber(num, language, options),
    formatCurrency: (amount, currency) => formatCurrency(amount, language, currency),
    formatRelativeTime: (minutes) => formatRelativeTime(minutes, language),
    formatOdds: (odds) => formatOdds(odds, language),
    explain,
    showBanner,
    dismissBanner,
    neverAskAgain,
    detectedLanguage,
    isRTL: info.rtl,
    languages,
  }

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
}

export function useI18n() {
  const ctx = useContext(I18nContext)
  if (!ctx) throw new Error('useI18n must be used within I18nProvider')
  return ctx
}
