import type { Bounds } from '../types'

export async function fetchRoadNetwork(bounds: Bounds) {
  const query = `
    [out:json][timeout:25];
    (
      way["highway"](${bounds.minLat},${bounds.minLng},${bounds.maxLat},${bounds.maxLng});
    );
    out body;
    >;
    out skel qt;
  `

  const response = await fetch('https://overpass-api.de/api/interpreter', {
    method: 'POST',
    body: `data=${encodeURIComponent(query)}`,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  })

  if (!response.ok) {
    throw new Error('Failed to fetch road network')
  }

  const data = await response.json()
  return processRoadNetwork(data)
}

function processRoadNetwork(data: any) {
  const nodes = new Map()
  const ways = []

  data.elements.forEach((element: any) => {
    if (element.type === 'node') {
      nodes.set(element.id, [element.lat, element.lon])
    }
  })

  data.elements.forEach((element: any) => {
    if (element.type === 'way' && element.nodes && element.tags?.highway) {
      const coordinates = element.nodes.map((nodeId: number) => nodes.get(nodeId)).filter(Boolean)

      if (coordinates.length > 1) {
        ways.push({ coordinates, highway: element.tags.highway })
      }
    }
  })

  return ways
}
