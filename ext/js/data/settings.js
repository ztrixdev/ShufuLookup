export class Settings {
    async setDefault() {
        await chrome.storage.local.set({
            cedict: "bundled",
            prefWriting: "simplified"
        })
    }

    async switchPrefWriting() {
        chrome.storage.local.get(["prefWriting"], async (result) => {
            if (result == "traditional") {
                await chrome.storage.local.set({
                    prefWriting: "simplified"
                })
            } else {
                await chrome.storage.local.set({
                    prefWriting: "traditional"
                })
            }
        })
    }

    async getPrefWriting() {
        chrome.storage.local.get(["prefWriting"], (result) => {
            return result
        })
    }


    // TODO
    async changeCEDICTSource(newSource) {}
    async getCEDICTSource() {}

}




