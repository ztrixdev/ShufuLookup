var currentView = "dict"

export function goToDict() {
  currentView = "dict"
  setView()
}

export function goToSettings() {
  currentView = "settings"
  setView()
}

export function setView() {
  const body = document.getElementById("mainbody")
  const dictbtn = document.getElementById("dictbtn")
  const settingsbtn = document.getElementById("settingsbtn")

  if (currentView === "dict") {
    body.innerHTML = dictHTML
    dictbtn.classList.add("is-active")
    settingsbtn.classList.remove("is-active")
  }

  if (currentView === "settings") {
    body.innerHTML = settingsHTML
    dictbtn.classList.remove("is-active")
    settingsbtn.classList.add("is-active")
  }
}

const settingsHTML = `` // todo

const dictHTML = `
<div class="container" style="padding-top: 2% padding-bottom: 4%">
  <div class="field has-addons">
    <div class="control is-expanded">
      <input class="input" type="text" id="charinput" placeholder="Search...">
    </div>
    <div class="control">
      <button class="button is-info is-dark" id="searchBtn">
        Search
      </button>
    </div>
  </div>

  <div class="card" id="resultcard">
  </div>
</div>
`

