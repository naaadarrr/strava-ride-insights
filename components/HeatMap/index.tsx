import { useMemo } from 'react'
import { CityRoadsMap } from '../CityRoadsMap'
import { StravaActivity } from '@/types/strava'

interface HeatMapProps {
  activities?: StravaActivity[]
}

export function HeatMap({ activities }: HeatMapProps) {
  const polylines = useMemo(
    () =>
      activities
        ?.filter(a => a.sport_type === 'Ride' && a?.map?.summary_polyline)
        .map(activity => activity.map.summary_polyline) ?? [],
    [JSON.stringify(activities)]
  )

  if (!activities?.length) return null
  if (!polylines.length || !activities[0]?.start_latlng) return null

  return (
    <div className="aspect-[16/9] rounded-lg overflow-hidden">
      <CityRoadsMap summaryPolylines={polylines} startLatlng={activities[0].start_latlng} />
    </div>
  )
}
