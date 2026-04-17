import { Settings } from "../data/settings.js"
import { search } from "./search.js"

export function showEngSearchResults(results, prefWriting) {
    const resultcard = document.getElementById("resultcard")
    resultcard.innerHTML = ""

    const resultbox = document.createElement("div")
    resultbox.className = "engsearch-results-box"

    const resdiv = document.createElement("div")
    resdiv.className = "engsearch-results-list"

    for (const res of results) {
        const item = document.createElement("div")
        item.className = "engsearch-result-item"

        const main = document.createElement("div")
        main.className = "engsearch-result-main"

        const charsSpan = document.createElement("span")
        charsSpan.className = "engsearch-chars"

        const a = document.createElement("a")
        a.href = "#"

        const chars = prefWriting === "simplified"
                ? `${res.simple} (${res.trad})`
                : `${res.trad} (${res.simple})`

        a.textContent = chars

        a.addEventListener("click", (e) => {
            e.preventDefault()
            document.getElementById("charinput").value = res.simple
            search()
        })

        charsSpan.appendChild(a)

        const pinyin = document.createElement("span")
        pinyin.className = "engsearch-pinyin"
        pinyin.textContent = res.pinyin

        main.appendChild(charsSpan)
        main.appendChild(pinyin)

        const def = document.createElement("div")
        def.className = "engsearch-result-def has-text-white"
        def.textContent = res.defs.join(" ")

        item.appendChild(main)
        item.appendChild(def)

        resdiv.appendChild(item)
    }

    resultbox.appendChild(resdiv)
    resultcard.appendChild(resultbox)
}

export function showSingularWordResults(data) {
    const resultcard = document.getElementById("resultcard")

    resultcard.innerHTML = ""
    const content = document.createElement("div")
    content.className = "card-content"
    content.style = "margin-left: 4%;"
    
    const chars = document.createElement("h2")
    chars.className = "title is-3"
    if (data.simple === data.trad) {
        chars.textContent = data.simple
    } else {
        new Settings().getPrefWriting().then(pref => {
            if (pref === "simplified") {
                chars.textContent = `${data.simple} (${data.trad})`
            } else {
                chars.textContent = `${data.trad} (${data.simple})`
            }
        })
    }
    const pinyin = document.createElement("h4")
    pinyin.className = "subtitle is-6"
    pinyin.textContent = data.pinyin

    const ol = document.createElement("ol")
    ol.type = "i"

    for (const def of data.defs) {
        const li = document.createElement("li")
        li.className = "has-text-white"
        li.textContent = def
        ol.appendChild(li)
    }

    const cl = document.createElement("h4")
    cl.className = "subtitle is-6"
    renderCL(data.cl, cl)

    content.appendChild(chars)
    content.appendChild(pinyin)
    content.appendChild(cl)
    content.appendChild(ol)

    resultcard.appendChild(content)
}

function renderCL(clList, container) {
    container.innerHTML = "";

    if (!clList || clList.length === 0) return;

    const label = document.createElement("span");
    label.textContent = "CL: ";
    container.appendChild(label);

    clList.forEach((cl, i) => {
        const a = document.createElement("a");
        a.href = "#";
        a.textContent = cl;

        a.addEventListener("click", (e) => {
            e.preventDefault();
            document.getElementById("charinput").value = cl;
            search();
        });

        container.appendChild(a);

        if (i < clList.length - 1) {
            container.appendChild(document.createTextNode(", "));
        }
    });
}
