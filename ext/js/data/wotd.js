import { fetchFile } from "./fetcher.js"

// WOTD generator
export async function getWOTD() {
  const res = await chrome.storage.local.get("wotd")
  const cached = res.wotd

  const now = Date.now()
  const DAY = 24 * 60 * 60 * 1000

  // use cached if 24hrs havent passed
  if (cached && (now - cached.timestamp) < DAY) {
    return cached.word
  }

  // otherwise generate new
  const wordsRes = await fetchFile(chrome.runtime.getURL("js/extra/HSK_wordlist.json"))
  const words = await wordsRes.json()

  const today = new Date().toISOString().slice(0, 10)

  let hash = 0
  for (let i = 0; i < today.length; i++) {
    hash = (hash * 31 + today.charCodeAt(i)) >>> 0
  }

  const word = words[hash % words.length]

  await chrome.storage.local.set({ // store 
    wotd: {
      word,
      timestamp: now
    }
  })

  return word
}
