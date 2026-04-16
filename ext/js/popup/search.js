import { db } from "../data/db.js"
import { updateResult } from "./viewmodel.js"

export async function search() {
  const val = document.getElementById("charinput").value
  var results = await db.dict.where("trad").equals(val).toArray()
  if (results.length === 0) {
    results = await db.dict.where("simple").equals(val).toArray()
  }
  if (results.length > 0) {
    updateResult(results[0])
  }
}
