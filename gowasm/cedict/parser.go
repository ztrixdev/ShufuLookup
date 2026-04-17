package cedict

import (
	"bufio"
	"encoding/json"
	"errors"
	"fmt"
	"regexp"
	"slices"
	"strings"
)

func parseLine(id int, line string) (*CEDICTEntry, error) {
	var new CEDICTEntry
	new.Id = id

	list := strings.Fields(line)
	listlen := len(list)
	if listlen < 4 {
		return nil, errors.New("CC-CEDICT entries consist of a minimum of 4 space-divided parts.")
	}

	new.Traditional = list[0]
	new.Simplified = list[1]
	if list[2][0] != '[' {
		return nil, errors.New("CC-CEDICT entries have pinyin information like [ni3 hao3]")
	}

	// pinyin is enclosed within squared brackets
	// E.g: [Zhong1 guo2] for 中國
	pinyinStop := 2
	pinyin := ""
	for idx := 2; idx < listlen; idx++ {
		token := list[idx]
		cleaned := strings.Trim(token, "[]")
		pinyin += " " + cleaned
		if strings.Contains(token, "]") {
			pinyinStop = idx
			break
		}
	}

	new.Pinyin = ConvertPinyin(strings.TrimSpace(pinyin))

	// definitions start with a / and end with a /
	// E.g /hello (loanword)/ for 哈囉
	definitions := ""
	for idx := pinyinStop + 1; idx < listlen; idx++ {
		if list[idx][0] == '/' {
			definitions += list[idx][1:]
		} else if list[idx][len(list[idx])-1] == '/' {
			definitions += " " + list[idx][0:len(list[idx])-1]
			break
		} else {
			definitions += " " + list[idx]
		}
	}

	defarr := strings.Split(strings.TrimSpace(definitions), "/")
	if defarr[len(defarr)-1] == "" { // trims a dead element that sometimes occurs after splitting
		defarr = defarr[0 : len(defarr)-1]
	}

	// removes classifiers from definitions and puts them into new.Classifiers
	re := regexp.MustCompile(`\[[^\]]*\]`)
	var classifiers []string
	var cleanedDefs []string
	for _, def := range defarr {
		if strings.HasPrefix(def, "CL:") {
			clean := re.ReplaceAllString(def[3:], "")
			cls := strings.SplitSeq(clean, ",")
			for w := range cls {
				w = strings.TrimSpace(w)
				if w != "" {
					classifiers = append(classifiers, w)
				}
			}
		} else {
			cleanedDefs = append(cleanedDefs, def)
		}
	}

	new.Classifiers = classifiers
	defarr = cleanedDefs
	new.Definitions = slices.Concat(new.Definitions, defarr)

	return &new, nil
}

func ParseDict(raw string) []CEDICTEntry {
	reader := strings.NewReader(raw)
	scanner := bufio.NewScanner(reader)

	slice := []CEDICTEntry{}

	entryId := 0
	// parsing line by line
	for scanner.Scan() {
		line := scanner.Text()
		if len(line) == 0 {
			continue // ignoring empty lines
		}

		if line[0] == '#' {
			continue // ignoring comments
		}

		parsed, err := parseLine(entryId, line)
		if err == nil { // ignoring the line if parsing failed
			slice = append(slice, *parsed)
			entryId++
		}
	}

	if err := scanner.Err(); err != nil {
		fmt.Println("Error reading string:", err)
	}

	return slice
}

func ExportDict(dict []CEDICTEntry) string {
	data, _ := json.Marshal(dict)
	return string(data)
}
