import { CEDICT } from "./cedict.js";
import { db } from "./db.js";

var dictReady = false

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("searchBtn").addEventListener("click", search);
});
  
const go = new Go();

WebAssembly.instantiateStreaming(fetch("shufulookup.wasm"), go.importObject)
  .then((result) => {
    go.run(result.instance)
    
    const dict = new CEDICT(parseCEDICTfile)
    dict.load().then( () => {dictReady = true} )
  })


async function search() {
  if (!dictReady) {
    return
  }

  const val = document.getElementById("charinput").value
  var results = await db.dict.where("trad").equals(val).toArray() 
  if (results.length == 0) {
    results = await db.dict.where("simple").equals(val).toArray() 
  } 
  updateResult(results[0])
}

function updateResult(data) {
  if (data.simple == data.trad) {
    document.getElementById("chars").textContent = data.simple
  } else {
    document.getElementById("chars").textContent = data.simple + " (" + data.trad + ")"
  }

  document.getElementById("pinyin").textContent = data.pinyin

  const ul = document.getElementById("deflist")
  while (ul.firstChild) {
    ul.removeChild(ul.firstChild)
  }
  for (const def of data.defs) {
    const li = document.createElement("li")
    li.className = "list-group-item"
    li.textContent = def;

    ul.appendChild(li);
  }
}
