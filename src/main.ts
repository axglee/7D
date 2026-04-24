import { mount } from 'svelte'
import Button from './lib/Button.svelte'
import { emoteState } from './lib/state.svelte';
import { getBlobUrl } from './lib/blobCache';
import { refreshEmotes, type CompactEmote } from './lib/emotes';

async function preloadEmotes(emotes: CompactEmote[]) {
  const BATCH_SIZE = 50;
  
  for (let i = 0; i < emotes.length; i += BATCH_SIZE) {
    const batch = emotes.slice(i, i + BATCH_SIZE);
    await Promise.all(batch.map(e => getBlobUrl(e.url).catch(() => {})));
  }
}

refreshEmotes('xqc').then(data => {
  emoteState.list = data;
  preloadEmotes(data);
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