// 최소 캐시 서비스 워커 (stale-while-revalidate).
// 실패해도 앱 동작에 영향 없도록 same-origin GET 만 다룬다.
const CACHE = 'kkamukgi-v5'

self.addEventListener('install', () => self.skipWaiting())

self.addEventListener('activate', (e) =>
  e.waitUntil(
    (async () => {
      // 이전 버전 캐시 정리
      const keys = await caches.keys()
      await Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
      await self.clients.claim()
    })(),
  ),
)

self.addEventListener('fetch', (e) => {
  const req = e.request
  if (req.method !== 'GET') return
  if (new URL(req.url).origin !== self.location.origin) return

  if (req.mode === 'navigate') {
    e.respondWith(
      caches.open(CACHE).then(async (cache) => {
        try {
          const res = await fetch(req)
          if (res && res.status === 200) await cache.put(req, res.clone())
          return res
        } catch {
          return (await cache.match(req)) || cache.match('/deadline-drawer/')
        }
      }),
    )
    return
  }

  e.respondWith(
    caches.open(CACHE).then(async (cache) => {
      const cached = await cache.match(req)
      const network = fetch(req)
        .then((res) => {
          if (res && res.status === 200) cache.put(req, res.clone())
          return res
        })
        .catch(() => cached)
      return cached || network
    }),
  )
})
