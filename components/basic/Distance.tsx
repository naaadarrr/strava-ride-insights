import React from 'react'
import { useTranslations } from 'next-intl'

interface DistanceProps {
  value: number // distance in meters
  showUnit?: boolean
  className?: string
}

export const Distance: React.FC<DistanceProps> = ({ value, showUnit = true, className }) => {
  const t = useTranslations('unit')

  const formatDistance = (meters: number) => {
    if (meters >= 1000) {
      return `${(meters / 1000).toFixed(1)}`
    }
    return `${Math.round(meters)}`
  }

  const getUnit = (meters: number) => {
    return meters >= 1000 ? t('kilometer') : t('meter')
  }

  return (
    <span className={className}>
      {formatDistance(value)}
      {showUnit && <span className="ml-1">{getUnit(value)}</span>}
    </span>
  )
}
