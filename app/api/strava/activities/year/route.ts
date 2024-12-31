import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { getStravaActivities } from '@/utils/strava'

export async function GET(request: Request) {
  const cookieStore = await cookies()
  const accessToken = cookieStore.get('strava_access_token')

  if (!accessToken) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { searchParams } = new URL(request.url)
    const year = searchParams.get('year')

    if (!year) {
      return NextResponse.json({ error: 'Year parameter is required' }, { status: 400 })
    }

    const startOfYear = new Date(parseInt(year), 0, 1).getTime() / 1000
    const endOfYear = new Date(parseInt(year) + 1, 0, 1).getTime() / 1000

    let page = 1
    const per_page = 100
    let allActivities = []
    let hasMore = true

    while (hasMore) {
      const activities = await getStravaActivities(accessToken.value, {
        after: startOfYear,
        before: endOfYear,
        page,
        per_page,
      })

      if (activities.length === 0) {
        hasMore = false
      } else {
        allActivities = [...allActivities, ...activities]
        page++
      }
    }

    return NextResponse.json(allActivities)
  } catch (error) {
    console.error('Error fetching activities:', error)
    return NextResponse.json({ error: 'Failed to fetch activities' }, { status: 500 })
  }
}
