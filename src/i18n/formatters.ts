import { getLanguageInfo, type LanguageCode } from './config'

export function formatDate(
  date: Date | string,
  language: LanguageCode,
  options?: Intl.DateTimeFormatOptions,
): string {
  const { intlLocale } = getLanguageInfo(language)
  const d = typeof date === 'string' ? new Date(date) : date
  return new Intl.DateTimeFormat(intlLocale, {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    ...options,
  }).format(d)
}

export function formatNumber(
  num: number,
  language: LanguageCode,
  options?: Intl.NumberFormatOptions,
): string {
  const { intlLocale } = getLanguageInfo(language)
  return new Intl.NumberFormat(intlLocale, options).format(num)
}

export function formatCurrency(amount: number, language: LanguageCode, currency = 'USDC'): string {
  const formatted = formatNumber(Math.abs(amount), language, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
  const sign = amount < 0 ? '-' : ''
  return `${sign}${formatted} ${currency}`
}

export function formatRelativeTime(minutes: number, language: LanguageCode): string {
  const { intlLocale } = getLanguageInfo(language)
  const rtf = new Intl.RelativeTimeFormat(intlLocale, { numeric: 'auto' })
  if (minutes < 60) {
    return rtf.format(-minutes, 'minute')
  }
  const hours = Math.floor(minutes / 60)
  if (hours < 24) {
    return rtf.format(-hours, 'hour')
  }
  const days = Math.floor(hours / 24)
  return rtf.format(-days, 'day')
}

export function formatOdds(odds: number, language: LanguageCode): string {
  return formatNumber(odds, language, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}
