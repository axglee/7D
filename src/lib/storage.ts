declare const BdApi: any
const isBD = typeof BdApi !== 'undefined'

export const storage = {
  get: (key: string, cb: (val: any) => void) => {
    if (isBD) cb(BdApi.Data.load('7DE', key))
    else chrome.storage.sync.get(key, (r) => cb(r[key]))
  },
  set: (key: string, value: any) => {
    if (isBD) BdApi.Data.save('7DE', key, value)
    else chrome.storage.sync.set({ [key]: value })
  },
  onChange: (cb: (key: string, newValue: any) => void) => {
    if (isBD) return
    chrome.storage.onChanged.addListener((changes, area) => {
      if (area === 'sync') {
        Object.entries(changes).forEach(([key, val]) => cb(key, (val as any).newValue))
      }
    })
  }
}