import Dexie from "../extra/dexie.mjs"

export const db = new Dexie("ShufuLookupDB")

db.version(1).stores({
  dict: "++id, trad, simple, pinyin, defs, cl",
  subtlex: "++rank, word" // stores "word" in SIMPLIFIED CHINESE (!)
})
