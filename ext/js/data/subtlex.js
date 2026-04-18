import { fetchFile } from "./fetcher.js"
import { db } from "./db.js"

export class SUBTLEX {
 constructor(parser) {
    if (!parser) {
      throw new Error("SUBTLEX: parser is required. Use parseSUBTLEXfile function from Go as a parser.")
    }

    this.parser = parser

    this.link =
      "js/extra/raw/SBTLX-CH-WF" 

    this.cache = null
  }

  async dl() {
    const res = await fetchFile(chrome.runtime.getURL(this.link))
    return await res.text()
  }

  async parse(raw) {
    const parsed = this.parser(raw)
    const json = JSON.parse(parsed)
    return json
  }

  async store(parsed) {
    await db.subtlex.clear()
    await db.subtlex.bulkPut(parsed)

    this.cache = {
      byWord: new Map()
    }
    
    for (const row of parsed) {
      this.cache.byWord.set(row.word, row)
    }

    return this.cache
  }

  async load() {
    // 1. trying to access in-memory cache
    if (this.cache) return this.cache

    // 2. trying to access IndexedDB cache
    const count = await db.subtlex.count()

    if (count > 0) {
      const data = await db.subtlex.toArray()
      this.cache = {
        byWord: new Map()
      }
      
      for (const row of data) {
        this.cache.byWord.set(row.word, row)
      }

      return this.cache
    }

    // 3. nothing stored locally, so we're downloadin 
    const raw = await this.dl()
    const parsed = await this.parse(raw)

    await this.store(parsed)

    return parsed
  }
}

var subtlexInstance = null
var subtlexPromise = null

export function getSUBTLEX() {
  if (subtlexInstance) return Promise.resolve(subtlexInstance)

  if (!subtlexPromise) {
    subtlexPromise = initSUBTLEX()
  }

  return subtlexPromise
}

async function initSUBTLEX() {
  const go = new Go()

  const result = await WebAssembly.instantiateStreaming(
    fetch("../../shufulookup.wasm"),
    go.importObject
  )

  go.run(result.instance)

  const subtlex = new SUBTLEX(parseSUBTLEXfile)
  await subtlex.load()

  subtlexInstance = subtlex
  return subtlex
}


