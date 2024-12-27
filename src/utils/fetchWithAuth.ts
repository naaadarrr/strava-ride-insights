import { refreshToken } from './auth';

export async function fetchWithAuth(url: string, options: RequestInit = {}) {
  let token = localStorage.getItem('strava_access_token');
  const expiresAt = localStorage.getItem('strava_token_expires_at');

  // 如果令牌即将过期（5分钟内），刷新它
  if (expiresAt && token) {
    const expiresTime = parseInt(expiresAt, 10) * 1000; // 转换为毫秒
    const fiveMinutes = 5 * 60 * 1000;
    
    if (Date.now() + fiveMinutes >= expiresTime) {
      const refreshTokenStr = localStorage.getItem('strava_refresh_token');
      if (refreshTokenStr) {
        const newToken = await refreshToken(refreshTokenStr);
        token = newToken.access_token;
      }
    }
  }

  if (!token) {
    throw new Error('No access token available');
  }

  const headers = new Headers(options.headers || {});
  headers.set('Authorization', `Bearer ${token}`);

  return fetch(url, {
    ...options,
    headers,
  });
}
