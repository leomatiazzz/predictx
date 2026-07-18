import { useI18n } from '@/i18n/context'

export function useMarketLabel() {
  const { t } = useI18n()

  return (label: string): string => {
    if (label.startsWith('over.')) {
      const value = label.split('.')[1]
      return `${t('markets.over')} ${value}`
    }
    if (label.startsWith('under.')) {
      const value = label.split('.')[1]
      return `${t('markets.under')} ${value}`
    }
    if (label === 'none') return t('markets.none')
    if (label === 'Draw') return t('markets.draw')
    return label
  }
}
