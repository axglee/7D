const cache = new Map<string, string>();

export async function getBlobUrl(url: string): Promise<string> {
  if (cache.has(url)) return cache.get(url)!;
  
  const res = await fetch(url);
  const blob = await res.blob();
  const blobUrl = URL.createObjectURL(blob);
  cache.set(url, blobUrl);
  return blobUrl;
}