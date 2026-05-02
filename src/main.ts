import { mount } from 'svelte'
import Button from './lib/Button.svelte'
import { emoteState } from './lib/state.svelte';
import { getBlobUrl } from './lib/blobCache';
import { refreshEmotes, type CompactEmote } from './lib/emotes';
import { getEmotesFromCache } from './lib/emotes';
import { storage } from './lib/storage';

async function preloadEmotes(emotes: CompactEmote[]) {
  await Promise.all(emotes.map(e => getBlobUrl(e.url).catch(() => {})));
}

storage.get('nickname', (nickname) => {
  if (!nickname) return
  const cached = getEmotesFromCache(nickname)
  if (cached.length) {
    emoteState.list = cached
    preloadEmotes(cached)
  } else {
    refreshEmotes(nickname).then(data => {
      emoteState.list = data
      preloadEmotes(data)
    })
  }
})

document.addEventListener('visibilitychange', () => {
  if (document.visibilityState !== 'visible') return
  storage.get('nickname', (nickname) => {
    if (!nickname) return
    const cached = getEmotesFromCache(nickname)
    if (!cached.length) {
      refreshEmotes(nickname).then(data => { emoteState.list = data })
    } else {
      emoteState.list = cached
    }
  })
})

storage.onChange((key, newValue) => {
  if (key === 'nickname' && newValue) {
    refreshEmotes(newValue).then(data => {
      emoteState.list = data
      preloadEmotes(data)
    })
  }
})

function injectButton(container: Element) {
  if (container.querySelector('.sde-button')) return;
  const target = document.createElement('div');
  target.classList.add('seven-de-wrapper');
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