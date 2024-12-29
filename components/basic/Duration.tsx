import React from 'react'
import { useTranslations } from 'next-intl'

interface DurationProps {
  value: number // duration in seconds
  showUnit?: boolean
  className?: string
}

export const Duration: React.FC<DurationProps> = ({ value, showUnit = true, className }) => {
  const t = useTranslations('unit')

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)

    if (hours > 0) {
      return `${hours} ${t('hour')} ${minutes} ${t('minute')}`
    }
    return `${minutes} ${t('minute')}`
  }

  return (
    <span className={className}>
      {formatDuration(value)}
      {showUnit && <span className="ml-1">{}</span>}
    </span>
  )
}
