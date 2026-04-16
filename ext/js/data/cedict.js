import { db } from "./db.js"

export class CEDICT {
  constructor(parser) {
    if (!parser) {
      throw new Error("CEDICT: parser is required. Use parseCEDICTfile function from Go as a parser.")
    }

    this.parser = parser

    this.link =
      "https://www.mdbg.net/chinese/export/cedict/cedict_1_0_ts_utf-8_mdbg.txt.gz" // change if the link changes

    this.cache = null
  }

  async dl() {
    const res = await fetch(this.link)
    if (!res.ok) {
      throw new Error(`Download failed: ${res.status}`)
    }
    if (!res.body) {
      throw new Error("CC-CEDICT is no longer availiable for download from that link.")
    }

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

    this.cache = parsed
  }

  async load() {
    // 1. trying to access in-memory cache
    if (this.cache) return this.cache

    // 2. trying to access IndexedDB cache
    const count = await db.dict.count()

    if (count > 0) {
      const data = await db.dict.toArray()
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