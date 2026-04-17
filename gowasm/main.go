//go:build js && wasm

package main

import (
	"shufulookup/cedict"
	subtlexch "shufulookup/subtlex-ch"
	"syscall/js"
)

func parseCEDICTfile(this js.Value, args []js.Value) interface{} {
	raw := args[0].String()
	entries := cedict.ParseDict(raw)
	jsonStr := cedict.ExportDict(entries)

	return js.ValueOf(jsonStr)
}

func parseSUBTLEXfile(this js.Value, args []js.Value) interface{} {
	raw := args[0].String()
	rankMap := subtlexch.GetRankMap(raw)
	jsonStr := subtlexch.ExportRankMap(rankMap)

	return js.ValueOf(jsonStr)
}

func main() {
	js.Global().Set("parseCEDICTfile", js.FuncOf(parseCEDICTfile))
	js.Global().Set("parseSUBTLEXfile", js.FuncOf(parseSUBTLEXfile))

	select {}
}
