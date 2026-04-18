export class Settings {
    setDefault() {
        chrome.storage.local.set({
            cedict: "bundled",
            prefWriting: "simplified"
        })
    }

    switchPrefWriting() {
        chrome.storage.local.get(["prefWriting"], (result) => {
            if (result.prefWriting == "traditional") {
                chrome.storage.local.set({
                    prefWriting: "simplified"
                })
            } else {
                chrome.storage.local.set({
                    prefWriting: "traditional"
                })
            }
        })
    }

    getPrefWriting() {
        return new Promise((resolve) => {
            chrome.storage.local.get(["prefWriting"], (result) => {
            resolve(result.prefWriting)
            })
        })
    }


    // TODO
    async changeCEDICTSource(newSource) {}
    async getCEDICTSource() {}

}




