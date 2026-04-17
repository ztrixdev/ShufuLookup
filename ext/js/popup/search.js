import { db } from "../data/db.js"
import { showEngSearchResults, showSingularWordResults } from "./viewmodel.js"
import { simples, trads } from "./wasm.js"

export async function search() {
  const val = document.getElementById("charinput").value

  const isEnglish = /^[a-zA-Z0-9\s.,'’-]+$/.test(val);
  if (isEnglish) {
    var results = await searchEnglish(val)  
  } else {
    var segmented = await segmentMandarin(val)
    results = await searchMandarin(segmented)
  }
  
  if (results.length > 0) {
    if (isEnglish) {
      showEngSearchResults(results, "simplified")
    } else {
      showSingularWordResults(results[0])
    }
  }
}

async function segmentMandarin(prompt) {
  prompt = prompt.trim().replace(/[\p{P}\s]/gu, "") // getting rid of punctuation, spaces, etc

  const result = []
  var i = 0

  while (i < prompt.length) {
    var found = false

    // finding the longest substring RTL
    for (var j = prompt.length; j > i; j--) {
      const word = prompt.substring(i, j)
      if (trads.has(word) || simples.has(word)) {
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

async function searchMandarin(segmentedPrompt) {
  var results = []

  for (const word of segmentedPrompt) {
    // searching simplified first
    var s = await db.dict.where("simple").equals(word).toArray()
    if (s.length == 0) { // if none found, search traditional
      s = await db.dict.where("trad").equals(word).toArray()
    }

    if (s.length != 0) {
      results.push(s[0])
    }
  }
  
  return results
}

async function searchEnglish(val) {
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

  function sortEntries(a, b) {
    const pinyinCompare = a.pinyin.localeCompare(b.pinyin)
    if (pinyinCompare !== 0) return pinyinCompare

    return a.simple.length - b.simple.length
  }

  exactMatches.sort(sortEntries)
  containsMatches.sort(sortEntries)

  return [...exactMatches, ...containsMatches]
}
