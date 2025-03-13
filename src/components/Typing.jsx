import { useEffect } from 'react'

export default function Typing({ paragraph, results, updateParagraph, updateResults }) {
  let wordArray;

  // On paragraph update
  useEffect(() => {
    console.log(paragraph);
    populateWords(paragraph)
  }, [paragraph]);

  function formatWord(word) {
    const newWord = document.createElement("div");
    const letters = word.split('');

    newWord.className = "word";

    for (const letter of letters) {
      const letterSpan = document.createElement("span");
      letterSpan.className = "letter";
      letterSpan.innerHTML = letter;
      newWord.appendChild(letterSpan);
    }
    return newWord;
  }

  function populateWords(paragraph) {
    if (paragraph.text == null) return;

    wordArray = paragraph.text.split(" ");
    const words = document.getElementById('words');

    words.innerHTML = "";

    for (const word of wordArray) {
      words.appendChild(formatWord(word));
    }
  }

  return (
    <>
      <h1>This is a Typing Test</h1>
      <button onClick={()=>updateParagraph("Lorem ipsum dolor sit amet consectetur adipiscing elit")}>Text</button>
      <div id="typingtest">
        <div id="header">
          <div id="timer"></div>

        </div>
        <div id="words">

        </div>
        <div id="cursor">

        </div>

      </div>
    </>
  )
}