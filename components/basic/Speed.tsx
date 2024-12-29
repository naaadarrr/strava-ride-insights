import React from 'react'
import { useTranslations } from 'next-intl'

interface SpeedProps {
  value: number // speed in meters per second
  showUnit?: boolean
  className?: string
}

export const Speed: React.FC<SpeedProps> = ({ value, showUnit = true, className }) => {
  const t = useTranslations('unit')

  const formatSpeed = (mps: number) => {
    // Convert to km/h
    const kmh = mps * 3.6
    return kmh.toFixed(1)
  }

  return (
    <span className={className}>
      {formatSpeed(value)}
      {showUnit && <span className="ml-1">{t('kmh')}</span>}
    </span>
  )
}
