package cedict

type CEDICTEntry struct {
	Traditional string `json:"trad"`
	Simplified  string `json:"simple"`
	Pinyin      string `json:"pinyin"`
	Definition  string `json:"def"`
}
