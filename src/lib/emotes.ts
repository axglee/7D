export interface CompactEmote {
    id: string;
    name: string;
    url: string;
}

const CACHE_KEY = (nickname: string) => `7d_emotes_cache_${nickname}`;

const CACHE_TTL = 24 * 60 * 60 * 1000;

export function getEmotesFromCache(nickname: string): CompactEmote[] {
  try {
    const cached = localStorage.getItem(CACHE_KEY(nickname));
    if (!cached) return [];
    const parsed = JSON.parse(cached);
    if (Array.isArray(parsed)) return [];
    if (parsed.nickname !== nickname) return [];
    if (Date.now() - parsed.timestamp > CACHE_TTL) return [];
    return parsed.emotes;
  } catch {
    return [];
  }
}

export async function refreshEmotes(nickname: string): Promise<CompactEmote[]> { 
    try {
        const ivrRes = await fetch(`https://api.ivr.fi/v2/twitch/user?login=${nickname}`);
        const ivrData = await ivrRes.json();
        const twitchId = ivrData[0]?.id;

        if (!twitchId) return [];

        const stvRes = await fetch(`https://7tv.io/v3/users/twitch/${twitchId}`);
        const stvData = await stvRes.json();
        const rawEmotes = stvData.emote_set?.emotes || [];

        const seen = new Set<string>();
        const compactEmotes: CompactEmote[] = rawEmotes
            .filter((e: any) => {
                if (seen.has(e.id)) return false;
                seen.add(e.id);
                return true;
            })
            .map((e: any) => {
                const isAnimated = e.data.animated;
                const ext = isAnimated ? 'gif' : 'png';
                return {
                    id: e.id,
                    name: e.name,
                    url: `https:${e.data.host.url}/1x.${ext}`
                };
            });

        localStorage.setItem(CACHE_KEY(nickname), JSON.stringify({
            timestamp: Date.now(),
            nickname,
            emotes: compactEmotes
        }));
        return compactEmotes;
    } catch (error) {
        console.error('Failed to fetch emotes:', error);
        return [];
    }
}