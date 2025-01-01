import type { Bounds } from '../types'

const CACHE_EXPIRY_DAYS = 7
const DB_NAME = 'road_network_cache'
const STORE_NAME = 'road_data'

interface CacheItem {
  data: any
  timestamp: number
}

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1)
    
    request.onerror = () => reject(request.error)
    request.onsuccess = () => resolve(request.result)
    
    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME)
      }
    }
  })
}

async function getCachedData(key: string): Promise<CacheItem | null> {
  const db = await openDB()
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, 'readonly')
    const store = transaction.objectStore(STORE_NAME)
    const request = store.get(key)
    
    request.onerror = () => reject(request.error)
    request.onsuccess = () => resolve(request.result)
  })
}

async function setCachedData(key: string, value: CacheItem): Promise<void> {
  const db = await openDB()
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, 'readwrite')
    const store = transaction.objectStore(STORE_NAME)
    const request = store.put(value, key)
    
    request.onerror = () => reject(request.error)
    request.onsuccess = () => resolve()
  })
}

function normalizeBounds(bounds: Bounds): Bounds {
  // 保留小数点后2位，大约精确到1公里级别
  const precision = 2
  return {
    minLat: Number(bounds.minLat.toFixed(precision)),
    maxLat: Number(bounds.maxLat.toFixed(precision)),
    minLng: Number(bounds.minLng.toFixed(precision)),
    maxLng: Number(bounds.maxLng.toFixed(precision))
  }
}

export async function fetchRoadNetwork(bounds: Bounds) {
  // 规范化边界值以提高缓存命中率
  const normalizedBounds = normalizeBounds(bounds)
  const cacheKey = JSON.stringify(normalizedBounds)
  
  try {
    // Try to get data from cache
    const cachedData = await getCachedData(cacheKey)
    if (cachedData) {
      const now = Date.now()
      const expiryTime = CACHE_EXPIRY_DAYS * 24 * 60 * 60 * 1000 // 7 days in milliseconds
      
      if (now - cachedData.timestamp < expiryTime) {
        return processRoadNetwork(cachedData.data)
      }
    }
  } catch (error) {
    console.warn('Failed to read from cache:', error)
  }

  const query = `
    [out:json][timeout:25];
    (
      way["highway"](${normalizedBounds.minLat},${normalizedBounds.minLng},${normalizedBounds.maxLat},${normalizedBounds.maxLng});
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
  
  // Save to cache
  try {
    const cacheItem: CacheItem = {
      data,
      timestamp: Date.now()
    }
    await setCachedData(cacheKey, cacheItem)
  } catch (error) {
    console.warn('Failed to write to cache:', error)
  }
  
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
