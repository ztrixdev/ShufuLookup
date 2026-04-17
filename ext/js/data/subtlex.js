import { fetchFile } from "./fetcher.js"
import { db } from "./db.js"

export class SUBTLEX {
 constructor(parser) {
    if (!parser) {
      throw new Error("SUBTLEX: parser is required. Use parseSUBTLEXfile function from Go as a parser.")
    }

    this.parser = parser

    this.link =
      "js/extra/SBTLX-CH-WF" 

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

    this.cache = parsed
  }

  async load() {
    // 1. trying to access in-memory cache
    if (this.cache) return this.cache

    // 2. trying to access IndexedDB cache
    const count = await db.subtlex.count()

    if (count > 0) {
      const data = await db.subtlex.toArray()
      this.cache = data
      return data
    }

    // 3. nothing stored locally, so we're downloadin 
    const raw = await this.dl()
    const parsed = await this.parse(raw)

    await this.store(parsed)

    return parsed
  }
}
