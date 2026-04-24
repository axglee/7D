import { getEmotesFromCache } from "./emotes";

export const emoteState = $state({
  list: getEmotesFromCache('jesusavgn'),
  isLoading: false
});