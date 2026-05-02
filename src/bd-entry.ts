import { mount, unmount } from 'svelte'
import Popout from './lib/Popout.svelte'
import Button from './lib/Button.svelte'
import { emoteState } from './lib/state.svelte'
import { getEmotesFromCache, refreshEmotes } from './lib/emotes'
import { getBlobUrl } from './lib/blobCache'
import { storage } from './lib/storage'

declare const BdApi: any

function loadEmotes() {
  storage.get('nickname', (nickname) => {
    if (!nickname) return
    const cached = getEmotesFromCache(nickname)
    if (cached.length) {
      emoteState.list = cached
      warmupImages(cached)
    } else {
      refreshEmotes(nickname).then(data => {
        emoteState.list = data
        warmupImages(data)
      })
    }
  })
}

const warmupTimers: ReturnType<typeof setTimeout>[] = []

function warmupImages(emotes: any[]) {
  if (typeof BdApi === 'undefined') return

  warmupTimers.forEach(t => clearTimeout(t))
  warmupTimers.length = 0

  emotes.forEach((e, i) => {
    const t = setTimeout(() => {
      const img = new Image()
      img.src = e.url
    }, i * 50)
    warmupTimers.push(t)
  })
}

function injectButton(container: Element) {
  if (container.querySelector('.seven-de-wrapper')) return
  const target = document.createElement('div')
  target.classList.add('seven-de-wrapper')
  container.prepend(target)
  mount(Button, { target })
}

const observer = new MutationObserver(() => {
  const chatArea = document.querySelector('[class^="channelTextArea_"]')
  if (chatArea) {
    const buttonsContainer = chatArea.querySelector('[class^="buttons_"]')
    if (buttonsContainer) injectButton(buttonsContainer)
  }
})

class SevenDEPlugin {
  start() {
    loadEmotes()
    observer.observe(document.body, { childList: true, subtree: true })
  }

  stop() {
    observer.disconnect()
    document.querySelectorAll('.seven-de-wrapper').forEach(el => el.remove())
    emoteState.list = []
    warmupTimers.forEach(t => clearTimeout(t))
    warmupTimers.length = 0
  }

  getSettingsPanel() {
    const panel = document.createElement('div')
    panel.style.cssText = 'padding: 24px; display: flex; flex-direction: column; gap: 16px;'

    const title = document.createElement('h2')
    title.textContent = '7DE'
    title.style.cssText = 'margin: 0; font-size: 24px; font-weight: 900; letter-spacing: 2px; background: linear-gradient(to right, #ff8a00, #ffc107, #ffffff, #ffc107, #ff8a00); background-size: 200% auto; -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; text-align: center;'

    const current = document.createElement('p')
    current.style.cssText = 'margin: 0; font-size: 12px; color: #927b6c; text-align: center; text-transform: uppercase; letter-spacing: 0.5px;'

    const error = document.createElement('p')
    error.style.cssText = 'margin: 0; padding: 8px; background: rgba(220,38,38,0.1); border-left: 3px solid #dc2626; color: #fca5a5; font-size: 12px; display: none;'

    const row = document.createElement('div')
    row.style.cssText = 'display: flex; gap: 8px; align-items: center;'

    const input = document.createElement('input')
    input.placeholder = 'Twitch nickname'
    input.style.cssText = 'padding: 10px 14px; background: #050402; border: 1px solid #453015; border-radius: 4px; color: #ffedd5; font-size: 14px; outline: none; flex: 1;'

    const updateCurrent = (nick: string) => {
        current.innerHTML = 'Current nickname: <span style="color: #fbbf24; font-weight: bold;">' + (nick || '-') + '</span>'
    }

    storage.get('nickname', (val) => {
        if (val) { input.value = val; updateCurrent(val) }
        else updateCurrent('')
    })

    const btn = document.createElement('button')
    btn.textContent = 'Save'
    btn.style.cssText = 'padding: 10px 20px; background: linear-gradient(135deg, #f59e0b, #d97706); border: none; border-radius: 4px; color: #fff; font-size: 14px; font-weight: 700; cursor: pointer; text-transform: uppercase; letter-spacing: 0.5px;'

    btn.onclick = async () => {
        const nick = input.value.trim()
        if (!nick) return
        const res = await fetch('https://api.ivr.fi/v2/twitch/user?login=' + nick)
        const data = await res.json()
        if (!Array.isArray(data) || data.length === 0) {
        error.textContent = 'Twitch user not found'
        error.style.display = 'block'
        return
        }
        error.style.display = 'none'
        storage.set('nickname', nick)
        updateCurrent(nick)
        refreshEmotes(nick).then(d => { emoteState.list = d; warmupImages(d) })
    }

    row.append(input, btn)
    panel.append(title, current, row, error)
    return panel
    }
}

// @ts-ignore
module.exports = SevenDEPlugin