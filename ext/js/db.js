import Dexie from "./extra/dexie.mjs";

export const db = new Dexie("cedictDB");

db.version(1).stores({
  dict: "++id, trad, simple, pinyin"
});