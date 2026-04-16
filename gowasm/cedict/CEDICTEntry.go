package cedict

type CEDICTEntry struct {
	Id          int      `json:"id"`
	Traditional string   `json:"trad"`
	Simplified  string   `json:"simple"`
	Pinyin      string   `json:"pinyin"`
	Definitions []string `json:"defs"`
	Classifiers []string `json:"cl"`
}
