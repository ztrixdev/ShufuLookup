import { search } from "./search.js"

export function updateResult(data) {
    // displaying chars
    const chars = document.getElementById("chars")

    if (data.simple === data.trad) {
        chars.textContent = data.simple
    } else {
        chars.textContent = data.simple + " (" + data.trad + ")"
    }

    const definitionList = document.getElementById("deflist")
    definitionList.innerHTML = ""

    for (var i = 0; i < data.defs.length; i++) {
        const li = document.createElement("li")
        li.textContent = data.defs[i]
        definitionList.appendChild(li)
    }

    // pinyin and classifiers
    document.getElementById("pinyin").textContent = data.pinyin
    renderCL(data.cl)
}

function renderCL(clList) {
    const clhtml = document.getElementById("cl")
    // clear the list before doing anything
    clhtml.innerHTML = ""

    if (!clList || clList.length === 0) {
        return
    }
    
    clhtml.textContent = "CL: "
    for (var i = 0; i < clList.length; i++) {
        const cl = clList[i]

        const a = document.createElement("a")
            a.href = "#"
            a.textContent = cl

            a.addEventListener("click", function (e) {
            e.preventDefault()

            document.getElementById("charinput").value = cl
            search()
        })

        clhtml.appendChild(a)

        // add comma between items
        if (i < clList.length - 1) {
            clhtml.appendChild(document.createTextNode(", "))
        }
    }
}
