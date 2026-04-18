# ShufuLookup
A browser extensions designed to make dictionary lookups easy and fast.

Switching between tabs to find a character's meaning or how a word would sound in Chinese quickly becomes a burden.
ShufuLookup allows you to never switch tabs to look up a Chinese word again. All you need to do is select words you're interested in, right-click and press a button in the context menu. A real Chinese-English dictionary-powered popup will then show up, giving you all the information you need.
 
## Features:
1. **One word search**<br>  <img width="40%" height="40%" alt="Screenshot 2026-04-18 at 3 11 27 PM" src="https://github.com/user-attachments/assets/beca3db3-c71b-49e2-bcdc-274e504b9d6b" />
2. **Multi-word search**<br> <img width="40%" height="40%" alt="Screenshot 2026-04-18 at 3 13 03 PM" src="https://github.com/user-attachments/assets/9a069a2f-a9ce-4966-a46b-41ba2b6b27e0" />
3. **English search**<br> <img width="40%" height="40%" alt="Screenshot 2026-04-18 at 3 15 46 PM" src="https://github.com/user-attachments/assets/cdbd06c1-4b00-4a06-b32a-c84a9e6dd849" />
4. **Select to search**<br>
5. **Both Traditional and Simplified characters**

## Live showcase (click for a YouTube video)
[![Showcase](https://img.youtube.com/vi/-nZkAW_xExw/0.jpg)](https://www.youtube.com/watch?v=-nZkAW_xExw)

## Browser support:
Currently, there are no stores you can download ShufuLookup from, we're working on it at the moment.  
You can, however, download ShufuLookup's extension archive from Releases and load it unpacked in your Chromium-based browser.  
Any Chrome-based browser, be it Edge, Chrome, Opera, Brave, etc. will work.  

## Materials Used
 - <a href="https://cc-cedict.org/wiki/">CC-CEDICT</a> - a downloadable public-domain Chinese-English dictionary
 - <a href="https://www.ugent.be/pp/experimentele-psychologie/en/research/documents/subtlexch">SUBTLEX-CH</a> - Chinese word frequency statistics collection
 - <a href="https://github.com/elkmovie/hsk30/">HSK Wordlists</a>

## Further Development
It is planned to add flashcards support (creating flashcard sets and exporting to Anki/Quizlet)
 <hr>

## Tech stack
This project uses regular HTML/CSS + Bulma for UI and JavaScript for the extension's logic. Parsing CC-CEDICT and SUBTLEX is done with Go-written parsers compiled to WebAssembly, hence the `gowasm/` source folder. 
## Contributing
Contributions are welcome. Whether it's fixing bugs, optimizing, or adding new features, feel free to get involved.
Make sure to raise an Issue to discuss a concern before submitting a PR.
