import { i18n } from 'i18next';
import dayjs from 'dayjs';

let i18nInstance: i18n | null = null;

export function initFormatters(i18n: i18n) {
  i18nInstance = i18n;
}

const METERS_TO_MILES = 0.000621371;
const METERS_TO_FEET = 3.28084;
const MPS_TO_MPH = 2.23694;

function getLanguage(): string {
  if (!i18nInstance) {
    console.warn('Formatters not initialized with i18n instance, falling back to "en"');
    return 'en';
  }
  return i18nInstance.language || 'en';
}

function translate(key: string, options?: any): string {
  if (!i18nInstance) {
    console.warn('Formatters not initialized with i18n instance');
    return options?.defaultValue || key;
  }
  return i18nInstance.t(key, options);
}

export function formatDistance(meters: number, format: 'long' | 'short' = 'long'): string {
  const currentLang = getLanguage();
  
  if (currentLang === 'en') {
    const miles = meters * METERS_TO_MILES;
    return translate(`formats.distance.${format}`, {
      value: miles.toFixed(1),
      defaultValue: `${miles.toFixed(1)} mi`
    });
  } else {
    const km = meters / 1000;
    return translate(`formats.distance.${format}`, {
      value: km.toFixed(1),
      defaultValue: `${km.toFixed(1)} km`
    });
  }
}

export function formatElevation(meters: number, format: 'long' | 'short' = 'long'): string {
  const currentLang = getLanguage();
  
  if (currentLang === 'en') {
    const feet = meters * METERS_TO_FEET;
    return translate(`formats.elevation.${format}`, {
      value: Math.round(feet),
      defaultValue: `${Math.round(feet)} ft`
    });
  } else {
    return translate(`formats.elevation.${format}`, {
      value: Math.round(meters),
      defaultValue: `${Math.round(meters)} m`
    });
  }
}

export function formatDuration(seconds: number, format: 'long' | 'short' = 'long'): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  return translate(`formats.duration.${format}`, {
    hours,
    minutes,
    defaultValue: `${hours}h ${minutes}m`
  });
}

export function formatSpeed(mps: number, format: 'long' | 'short' = 'long'): string {
  const currentLang = getLanguage();
  
  if (currentLang === 'en') {
    const mph = mps * MPS_TO_MPH;
    return translate(`formats.speed.${format}`, {
      value: mph.toFixed(1),
      defaultValue: `${mph.toFixed(1)} mph`
    });
  } else {
    const kph = mps * 3.6;
    return translate(`formats.speed.${format}`, {
      value: kph.toFixed(1),
      defaultValue: `${kph.toFixed(1)} km/h`
    });
  }
}

export function formatDate(dateStr: string, format: 'full' | 'long' | 'short' = 'long'): string {
  const date = dayjs(dateStr);
  const formatStr = translate(`formats.date.${format}`, {
    defaultValue: format === 'full' ? 'YYYY-MM-DD dddd' :
                 format === 'long' ? 'YYYY-MM-DD' :
                 'YYYY/MM/DD'
  });
  return date.format(formatStr);
}