package subtlexch

import (
	"bufio"
	"encoding/json"
	"fmt"
	"strings"
)

func GetRankMap(raw string) []SUBTLEXEntry {
	reader := strings.NewReader(raw)
	scanner := bufio.NewScanner(reader)

	slice := []SUBTLEXEntry{}
	lineN := 0
	// parsing line by line
	for scanner.Scan() {
		var new SUBTLEXEntry
		line := scanner.Text()
		if len(line) == 0 {
			continue // ignoring empty lines
		}

		fields := strings.Fields(line)
		if len(fields) == 0 {
			continue
		}

		new.Rank = lineN
		new.Word = fields[0]
		slice = append(slice, new)
		lineN++
	}

	if err := scanner.Err(); err != nil {
		fmt.Println("Error reading string:", err)
	}

	return slice
}

func ExportRankMap(entries []SUBTLEXEntry) string {
	data, _ := json.Marshal(entries)
	return string(data)
}
