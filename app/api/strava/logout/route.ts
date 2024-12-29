import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function POST() {
  const cookieStore = await cookies()

  // Clear Strava tokens
  cookieStore.delete('strava_access_token')
  cookieStore.delete('strava_refresh_token')

  return NextResponse.json({ success: true })
}
