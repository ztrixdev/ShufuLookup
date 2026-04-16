import { CEDICT } from "../data/cedict.js"

export var dictReady = false

export function initWasm() {
  const go = new Go()

  WebAssembly.instantiateStreaming(fetch("../shufulookup.wasm"), go.importObject)
    .then((result) => {
      go.run(result.instance)

      const dict = new CEDICT(parseCEDICTfile)
      dict.load().then(() => { dictReady = true })
    })
}
