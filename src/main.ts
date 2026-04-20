import { mount } from 'svelte'
import Button from './lib/Button.svelte'

function injectButton(container: Element) {
  if (container.querySelector('.sd-button')) return;

  const target = document.createElement('div');

  target.classList.add('seven-d-wrapper');

  container.prepend(target);

  mount(Button, {
    target: target,
    props: {
      onClick: () => console.log('7D: Menu toggle')
    }
  });
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