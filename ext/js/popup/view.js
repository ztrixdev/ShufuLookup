var currentView = "dict"

export function setView() {
  const body = document.getElementById("mainbody")

  if (currentView === "dict") {
    body.innerHTML = dictHTML
  }

  if (currentView === "settings") {
    body.innerHTML = settingsHTML
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
      <button class="button is-warning" id="searchBtn">
        Search
      </button>
    </div>
  </div>

  <div class="card" id="resultcard">
  </div>
</div>
</div>
`

