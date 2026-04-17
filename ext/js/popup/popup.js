import { initWasm, dictReady } from "./wasm.js"
import { setView, goToDict, goToSettings } from "./view.js"
import { search } from "./search.js"
import { Settings } from "../data/settings.js"

document.addEventListener("DOMContentLoaded", async () => {
  setView()
  // if settings weren't previously set, set them to default
  chrome.storage.local.get(["cedict"], async (res) => {
    if (!res.cedict) {
      await new Settings().setDefault()
    }
  })
  document.getElementById("searchBtn").addEventListener("click", search)
  document.getElementById("dictbtn").addEventListener("click", goToDict)
 // document.getElementById("settingsbtn").addEventListener("click", goToSettings)
 // uncomment when settings r ready
})

initWasm()
