import { STRAVA_CLIENT_ID, STRAVA_CLIENT_SECRET } from '../config/strava';

interface TokenInfo {
  access_token: string;
  refresh_token: string;
  expires_at: number;
}

export async function refreshToken(refreshToken: string): Promise<TokenInfo | null> {
  try {
    const response = await fetch('https://www.strava.com/oauth/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        client_id: STRAVA_CLIENT_ID,
        client_secret: STRAVA_CLIENT_SECRET,
        refresh_token: refreshToken,
        grant_type: 'refresh_token',
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to refresh token');
    }

    return await response.json();
  } catch (error) {
    console.error('Error refreshing token:', error);
    return null;
  }
}