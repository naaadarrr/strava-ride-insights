import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { exchangeToken } from '@/utils/strava'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get('code')
  const error = searchParams.get('error')
  const callbackUrl = decodeURIComponent(searchParams.get('state') || '/')

  if (error || !code) {
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_BASE_URL}/login?error=access_denied`)
  }

  try {
    const tokens = await exchangeToken(code)

    // Store tokens in cookies
    const cookieStore = await cookies()
    cookieStore.set('strava_access_token', tokens.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      expires: new Date(tokens.expires_at * 1000),
    })

    cookieStore.set('strava_refresh_token', tokens.refresh_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 365 * 24 * 60 * 60, // 1 year
    })

    return NextResponse.redirect(new URL(callbackUrl, process.env.NEXT_PUBLIC_BASE_URL))
  } catch (error) {
    console.error('Error exchanging token:', error)
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_BASE_URL}/login?error=token_exchange`)
  }
}
