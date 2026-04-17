package cedict

import (
	"strings"
	"unicode"
)

var vowelDiacritics = map[rune][]rune{
	'a': {'ā', 'á', 'ǎ', 'à'},
	'e': {'ē', 'é', 'ě', 'è'},
	'i': {'ī', 'í', 'ǐ', 'ì'},
	'o': {'ō', 'ó', 'ǒ', 'ò'},
	'u': {'ū', 'ú', 'ǔ', 'ù'},
	'ü': {'ǖ', 'ǘ', 'ǚ', 'ǜ'},
	'v': {'ǖ', 'ǘ', 'ǚ', 'ǜ'},
}

func ConvertPinyin(input string) string {
	words := strings.Split(input, " ")

	for i, word := range words {
		words[i] = convertSyllable(word)
	}

	return strings.Join(words, " ")
}

func convertSyllable(s string) string {
	if len(s) == 0 {
		return s
	}

	// find tone number (last char)
	last := s[len(s)-1]
	if last < '1' || last > '4' {
		return s[0 : len(s)-1] // no tone
	}

	tone := int(last - '0')
	base := s[:len(s)-1]

	runes := []rune(base)

	// find which vowel to mark
	idx := findToneVowel(runes)
	if idx == -1 {
		return s
	}

	v := unicode.ToLower(runes[idx])
	if marks, ok := vowelDiacritics[v]; ok {
		runes[idx] = marks[tone-1]
	}

	return string(runes)
}

func findToneVowel(runes []rune) int {
	// "a" and "e" are dominating
	for i, r := range runes {
		if r == 'a' || r == 'e' {
			return i
		}
	}

	// if there's an "ou", o should have a diacritic sign
	for i := 0; i < len(runes)-1; i++ {
		if runes[i] == 'o' && runes[i+1] == 'u' {
			return i
		}
	}

	// fallback to the last vowel
	for i := len(runes) - 1; i >= 0; i-- {
		if strings.ContainsRune("aeiouüv", runes[i]) {
			return i
		}
	}

	return -1
}
