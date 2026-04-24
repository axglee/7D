import { getEmotesFromCache } from "./emotes";

export const emoteState = $state({
    list: getEmotesFromCache(),
    isLoading: false
});