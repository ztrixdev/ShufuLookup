import { CEDICT } from "./cedict.js";

const go = new Go();

WebAssembly.instantiateStreaming(fetch("shufulookup.wasm"), go.importObject)
  .then((result) => {
    go.run(result.instance)
    
    const dict = new CEDICT(parseCEDICTfile)
    dict.load().then((result) => {
      // todo: use the dictionary
    }
    )

  })