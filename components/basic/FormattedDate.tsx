import React from 'react'
import { useLocale } from 'next-intl'

interface FormattedDateProps {
  value: string | Date // ISO string or Date object
  className?: string
}

export const FormattedDate: React.FC<FormattedDateProps> = ({ value, className }) => {
  const locale = useLocale()

  const formatDate = (dateStr: string | Date) => {
    const date = typeof dateStr === 'string' ? new Date(dateStr) : dateStr

    if (locale === 'zh') {
      return date
        .toLocaleDateString('zh-CN', {
          year: 'numeric',
          month: 'numeric',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        })
        .replace(/\//g, '年')
        .replace(/\s/, '日 ')
    }

    return date.toLocaleDateString(locale, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  return <span className={className}>{formatDate(value)}</span>
}
