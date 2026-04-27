import { type CompactEmote } from './emotes';

export async function searchGlobalEmotes(query: string = '', page: number = 1): Promise<CompactEmote[]> {
  const res = await fetch('https://api.7tv.app/v4/gql', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      query: `query GetTopV4($query: String!, $page: Int!) {
        emotes {
          search(query: $query, page: $page, perPage: 50, sort: { sortBy: "TOP_ALL_TIME", order: DESCENDING }) {
            items {
              id
              defaultName
              images { url scale }
            }
          }
        }
      }`,
      variables: { query, page }
    })
  });

  const data = await res.json();
  const items = data?.data?.emotes?.search?.items || [];

  return items.map((e: any) => ({
    id: e.id,
    name: e.defaultName,
    url: e.images.find((img: any) => img.url.includes('1x.avif'))?.url ?? e.images[0]?.url
  }));
}