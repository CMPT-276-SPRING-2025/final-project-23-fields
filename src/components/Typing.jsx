import { useEffect } from 'react'

export default function Typing({ paragraph, results, updateParagraph, updateResults }) {
  let wordArray;

  // On paragraph update
  useEffect(() => {
    console.log(paragraph);
    populateWords(paragraph)
  }, [paragraph]);

  useEffect(() => {
    const keyPress = (event) => {
      const key = event.key;
      const expectedKey = document.querySelector('.letter.current').innerHTML;

      console.log(key + " : " + expectedKey)
    };

    document.addEventListener('keyup', keyPress);

    return () => {
      document.removeEventListener('keyup', keyPress);
    };
  }, []);

  function addClass(element, name) {
    element.classList.add(name);
  }

  function removeClass(element, name) {
    element.classList.remove(name);
  }

  function formatWord(word) {
    const newWord = document.createElement("div");
    const letters = word.toLowerCase().split('');

    newWord.className = "word inline-block m-0.5";

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
    
    addClass(document.querySelector('.word'), 'current');
    addClass(document.querySelector('.letter'), 'current')
  }

  return (
    <>
      <h1>This is a Typing Test</h1>
      <button onClick={()=>updateParagraph("Lorem ipsum dolor sit amet consectetur adipiscing elit")}>Text</button>
      <div id="typingtest" className="bg-red-300">
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