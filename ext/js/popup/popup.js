import { setView } from "./view.js"
import { search, searchBind } from "./search.js"
import { Settings } from "../data/settings.js"
import { getWOTD } from "../data/wotd.js"

document.addEventListener("DOMContentLoaded", async () => {
  setView()
  const sets = new Settings()
  // if settings weren't previously set, set them to default
  chrome.storage.local.get(["prefWriting"], async (res) => {
    if (!res.prefWriting) {
      await sets.setDefault()
    } else {
      const toggle = document.getElementById("writingToggle")
      toggle.checked = res.prefWriting === "traditional"
      toggle.addEventListener("change", (e) => {
        sets.switchPrefWriting()
      })
    }
  })
  const lastqres = await chrome.storage.local.get("lastQuery")
  const wotd = await getWOTD()
  if (lastqres.lastQuery && lastqres.lastQuery != wotd) {
    document.getElementById("charinput").value = lastqres.lastQuery
    await search(lastqres.lastQuery)
  } else {
    await search(wotd)
  }
  
  document.getElementById("searchBtn").addEventListener("click", searchBind)

  //document.getElementById("dictbtn").addEventListener("click", goToDict)
 // document.getElementById("settingsbtn").addEventListener("click", goToSettings)
 // uncomment when menu is ready
})

