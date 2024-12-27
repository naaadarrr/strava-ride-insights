import { STRAVA_CLIENT_ID, STRAVA_CLIENT_SECRET } from '../config/strava';

export async function handleStravaCallback(code: string): Promise<boolean> {
  try {
    const response = await fetch('https://www.strava.com/oauth/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        client_id: STRAVA_CLIENT_ID,
        client_secret: STRAVA_CLIENT_SECRET,
        code,
        grant_type: 'authorization_code',
      }),
    });

    const data = await response.json();
    if (data.access_token) {
      localStorage.setItem('strava_access_token', data.access_token);
      return true;
    }
    return false;
  } catch (error) {
    console.error('Error authenticating with Strava:', error);
    return false;
  }
}