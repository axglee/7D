import { type CompactEmote } from "./emotes";

export const emoteState = $state<{ list: CompactEmote[], isLoading: boolean }>({
  list: [],
  isLoading: false
});