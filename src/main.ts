import { mount } from 'svelte'
import Button from './lib/Button.svelte'
import { emoteState } from './lib/state.svelte';
import { getBlobUrl } from './lib/blobCache';
import { refreshEmotes, type CompactEmote } from './lib/emotes';
import { getEmotesFromCache } from './lib/emotes';

async function preloadEmotes(emotes: CompactEmote[]) {
  await Promise.all(emotes.map(e => getBlobUrl(e.url).catch(() => {})));
}

chrome.storage.sync.get('nickname', (result) => {
  const nickname = result.nickname as string;
  if (!nickname) return;
  const cached = getEmotesFromCache(nickname);
  if (cached.length) {
    emoteState.list = cached;
    preloadEmotes(cached);
  } else {
    refreshEmotes(nickname).then(data => {
      emoteState.list = data;
      preloadEmotes(data);
    });
  }
});

document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'visible') {
    chrome.storage.sync.get('nickname', (result) => {
      const nickname = result.nickname as string;
      if (!nickname) return;
      const cached = getEmotesFromCache(nickname);
      if (!cached.length) {
        refreshEmotes(nickname).then(data => {
          emoteState.list = data;
          preloadEmotes(data);
        });
      } else {
        emoteState.list = cached;
      }
    });
  }
});

chrome.storage.onChanged.addListener((changes, area) => {
  if (area === 'sync' && changes.nickname) {
    const nickname = changes.nickname.newValue as string;
    if (!nickname) return;
    refreshEmotes(nickname).then(data => {
      emoteState.list = data;
      preloadEmotes(data);
    });
  }
});

function injectButton(container: Element) {
  if (container.querySelector('.sd-button')) return;
  const target = document.createElement('div');
  target.classList.add('seven-d-wrapper');
  container.prepend(target);
  mount(Button, { target: target });
}

const observer = new MutationObserver(() => { 
  const chatArea = document.querySelector('[class^="channelTextArea_"]');
  if (chatArea) {
    const buttonsContainer = chatArea.querySelector('[class^="buttons_"]');

    if (buttonsContainer) {
      injectButton(buttonsContainer);
    }
  }
});

observer.observe(document.body, { childList: true, subtree: true })