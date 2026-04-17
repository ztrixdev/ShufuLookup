import { CEDICT } from "../data/cedict.js"
import { getWordSets } from "../data/cedict.js"
import {SUBTLEX} from "../data/subtlex.js"

export var dictReady = false
export var { simples, trads } = {simples: new Set(), trads: new Set()}

export function initWasm() {
  const go = new Go()

  WebAssembly.instantiateStreaming(fetch("../shufulookup.wasm"), go.importObject)
    .then((result) => {
      go.run(result.instance)

      const dict = new CEDICT(parseCEDICTfile)
      const subtlex = new SUBTLEX(parseSUBTLEXfile)
      subtlex.load()
      return dict.load()
    })
    .then(() => {
      dictReady = true
      return getWordSets()
    })
    .then(({ simples: s, trads: t }) => {
      simples = s
      trads = t
    })
}