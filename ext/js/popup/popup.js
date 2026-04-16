import { initWasm, dictReady } from "./wasm.js"
import { setView, goToDict, goToSettings } from "./view.js"
import { search } from "./search.js"

document.addEventListener("DOMContentLoaded", () => {
  setView()

  document.getElementById("searchBtn").addEventListener("click", search)
  document.getElementById("dictbtn").addEventListener("click", goToDict)
 // document.getElementById("settingsbtn").addEventListener("click", goToSettings)
 // uncomment when settings r ready
})

initWasm()
