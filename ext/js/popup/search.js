import { getCEDICT } from "../data/cedict.js";
import { db } from "../data/db.js"
import { Settings } from "../data/settings.js";
import { getSUBTLEX } from "../data/subtlex.js";
import {getWOTD} from "../data/wotd.js"
import { showEngSearchResults, showSingularWordResults } from "./renderer.js"

export async function searchBind() {
  const val = document.getElementById("charinput").value
  await search(val)
}

export async function search(val) {
  if (val.length == 0) {
    const wotd = await getWOTD()
    search(wotd)
    chrome.storage.local.set({
      lastQuery: ""
    })
    return
  }

  const cedict = await getCEDICT()
  const subtlex = await getSUBTLEX()
  const prefWriting = await new Settings().getPrefWriting()

  const isEnglish = /^[a-zA-Z0-9\s.,'’-]+$/.test(val)
  if (isEnglish) {
    var results = await searchEnglish(val, subtlex)  
  } else {
    var segmented = segmentMandarin(val, cedict)
    results = searchMandarin(segmented, cedict)
  }
  
  if (results.length == 1) {
    showSingularWordResults(results[0])
    chrome.storage.local.set({
      lastQuery: val
    })
  } else if (results.length > 1) {
    showEngSearchResults(results, prefWriting)
    chrome.storage.local.set({
      lastQuery: val
    })
  } else {
    const wotd = await getWOTD()
    search(wotd)
    const el = document.getElementById("notfound")
    el.classList.add("show")
    setTimeout(() => {
      el.classList.remove("show")
    }, 2000)
    chrome.storage.local.set({
      lastQuery: ""
    })
  }
}

function segmentMandarin(prompt, cedict) {
  prompt = prompt.trim().replace(/[\p{P}\s]/gu, "") // getting rid of punctuation, spaces, etc

  const result = []
  var i = 0

  while (i < prompt.length) {
    var found = false

    // finding the longest substring RTL
    for (var j = prompt.length; j > i; j--) {
      const word = prompt.substring(i, j)
      if (cedict.cache.bySimple.get(word) || cedict.cache.byTrad.get(word)) {
        result.push(word)
        i = j
        found = true
        break
      }
    }

    // falling back to single char
    if (!found) {
      result.push(prompt[i])
      i++
    }
  }

  return result
}

function searchMandarin(segmentedPrompt, cedict) {
  var results = []

  for (const word of segmentedPrompt) {
    // searching simplified first
    var s = cedict.cache.bySimple.get(word)
    if (!s) { // if none found, search traditional
      s = cedict.cache.byTrad.get(word)
    }

    if (s) {
      results.push(s)
    }
  }
  
  return results
}

async function searchEnglish(val, subtlex) {
  const term = val.trim().toLowerCase()

  const exactMatches = []
  const containsMatches = []

  const entries = await db.dict.toArray()

  for (const entry of entries) {
    for (const def of entry.defs) {
      const d = def.toLowerCase().trim()

      if (d === term) {
        exactMatches.push(entry)
        break
      }

      if (d.includes(term)) {
        containsMatches.push(entry)
        break
      }
    }
  }

  function sortEntries(query, subtlex, a, b) {
    function getMatchScore(entry, query) {
      const q = query.toLowerCase()
      let best = 3
      for (const def of entry.defs) {
      const d = def.toLowerCase()

      if (d === q) return 0

      if (d.includes(q)) {
        const tokens = d.split(/[^a-z]+/i)

        if (tokens.includes(q)) return 0
        if (d.startsWith(q)) best = Math.min(best, 1)
        else best = Math.min(best, 2)
      }
      }
      return best
    }

    const scoreA = getMatchScore(a, query)
    const scoreB = getMatchScore(b, query)

    if (scoreA !== scoreB) return scoreA - scoreB

    const getRank = (str) => {
      return subtlex.cache.byWord.get(str) ?? Infinity
    }

    const rankA = getRank(a.simple)
    const rankB = getRank(b.simple)

    if (rankA !== rankB) return rankA - rankB

    const pinyinCompare = a.pinyin.localeCompare(b.pinyin)
    if (pinyinCompare !== 0) return pinyinCompare

    return a.simple.length - b.simple.length
  }

  exactMatches.sort((a, b) => sortEntries(val, subtlex, a, b))
  containsMatches.sort((a,b) => sortEntries(val, subtlex, a, b))

  return [...exactMatches, ...containsMatches]
}
