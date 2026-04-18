import { db } from "./db.js"
import { fetchFile } from "./fetcher.js"


export class CEDICT {
  constructor(parser) {
    if (!parser) {
      throw new Error("CEDICT: parser is required. Use parseCEDICTfile function from Go as a parser.")
    }

    this.parser = parser

    this.link =
      "js/extra/raw/cedict_1_0_ts_utf-8_mdbg.txt.gz" 

    this.cache = null
  }

  async dl() {
    const res = await fetchFile(chrome.runtime.getURL(this.link))
    const stream = res.body.pipeThrough(
      new DecompressionStream("gzip")
    )

    return await new Response(stream).text()
  }

  async parse(raw) {
    const parsed = this.parser(raw)
    const json = JSON.parse(parsed)
    return json
  }

  async store(parsed) {
    await db.dict.clear()
    await db.dict.bulkPut(parsed)

    this.cache = {
      bySimple: new Map(),
      byTrad: new Map()
    }

    for (const row of parsed) {
      this.cache.bySimple.set(row.simple, row)
      this.cache.byTrad.set(row.trad, row)
    }

    return this.cache
  }

  async load() {
    // 1. trying to access in-memory cache
    if (this.cache) return this.cache

    // 2. trying to access IndexedDB cache
    const count = await db.dict.count()

    if (count > 0) {
      const data = await db.dict.toArray()
      this.cache = {
        bySimple: new Map(),
        byTrad: new Map()
      }

      for (const row of data) {
        this.cache.bySimple.set(row.simple, row)
        this.cache.byTrad.set(row.trad, row)
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

var cedictInstance = null
var cedictPromise = null

export function getCEDICT() {
  if (cedictInstance) return Promise.resolve(cedictInstance)

  if (!cedictPromise) {
    cedictPromise = initCEDICT()
  }

  return cedictPromise
}

async function initCEDICT() {
  const go = new Go()

  const result = await WebAssembly.instantiateStreaming(
    fetch("../../shufulookup.wasm"),
    go.importObject
  )

  go.run(result.instance)

  const dict = new CEDICT(parseCEDICTfile)
  await dict.load()

  cedictInstance = dict
  return dict
}
