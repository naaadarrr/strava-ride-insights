// Load Strava API application credentials from environment variables
export const STRAVA_CLIENT_ID = import.meta.env.VITE_STRAVA_CLIENT_ID || '';
export const STRAVA_CLIENT_SECRET = import.meta.env.VITE_STRAVA_CLIENT_SECRET || '';

// Get redirect URI based on environment
export const STRAVA_REDIRECT_URI = import.meta.env.DEV 
  ? 'http://localhost:5173'  // Development environment
  : 'https://bike.hy-life.me';  // Production environment