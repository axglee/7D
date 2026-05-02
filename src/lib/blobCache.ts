const cache = new Map<string, string>()
const isBD = typeof (globalThis as any).BdApi !== 'undefined'

export async function getBlobUrl(url: string): Promise<string> {
  if (cache.has(url)) return cache.get(url)!
  if (isBD) {
    cache.set(url, url)
    return url
  }
  const res = await fetch(url)
  const blob = await res.blob()
  const blobUrl = URL.createObjectURL(blob)
  cache.set(url, blobUrl)
  return blobUrl
}

export function getCachedUrl(url: string): string | null {
  return cache.get(url) ?? null
}