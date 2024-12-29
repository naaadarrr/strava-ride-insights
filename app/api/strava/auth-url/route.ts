import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const callbackUrl = searchParams.get('callbackUrl') || '/'

  const STRAVA_CLIENT_ID = process.env.AUTH_STRAVA_ID
  const REDIRECT_URI = `${process.env.NEXT_PUBLIC_BASE_URL}/api/strava/callback`
  const scope = 'read,activity:read_all'

  const authUrl = `https://www.strava.com/oauth/authorize?client_id=${STRAVA_CLIENT_ID}&response_type=code&redirect_uri=${REDIRECT_URI}&approval_prompt=force&scope=${scope}&state=${encodeURIComponent(callbackUrl)}`

  return NextResponse.json({ url: authUrl })
}
