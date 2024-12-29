import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { getStravaAthlete, getStravaStats } from '@/utils/strava'

export async function GET() {
  const cookieStore = await cookies()
  const accessToken = cookieStore.get('strava_access_token')

  if (!accessToken) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    // 获取用户信息
    const athlete = await getStravaAthlete(accessToken.value)
    // 获取统计数据
    const stats = await getStravaStats(accessToken.value, athlete.id)
    return NextResponse.json(stats)
  } catch (error) {
    console.error('Error fetching stats:', error)
    return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 })
  }
}
