import { useEffect } from 'react'

export default function Typing({ paragraph, results, updateParagraph, updateResults }) {
  let wordArray;
  const correctKeyClasses = ['correct', 'text-white'];
  const wrongKeyClasses = ['wrong', 'text-red-500'];

  // On paragraph update
  useEffect(() => {
    console.log(paragraph);
    populateWords(paragraph)
  }, [paragraph]);

  useEffect(() => {
    const keyPress = (event) => {
      const key = event.key;
      const currentWord = document.querySelector('.word.current');
      const currentLetter = document.querySelector('.letter.current');
      const expectedKey = currentLetter ? currentLetter.innerHTML : ' ';
      const isSpace = key == ' ';
      const isBackspace = key.length != 1;

      console.log(key + " : " + expectedKey)
      // Condition: Valid key is pressed
      if (!isBackspace && !isSpace) {
        // Condition: Not at the end of the word
        if (currentLetter) {
          addClass(currentLetter, key === expectedKey ? correctKeyClasses: wrongKeyClasses);
          removeClass(currentLetter, 'current');
          if (currentLetter.nextSibling) addClass(currentLetter.nextSibling, 'current');
        // Condition: At the end of the word
        } else {
          const letterSpan = document.createElement("span");
          addClass(letterSpan, wrongKeyClasses.concat(["letter"]))
          letterSpan.innerHTML = key;
          currentWord.appendChild(letterSpan);
        }
      // Condition: Space key is pressed
      } else if (isSpace) {
        // Condition: Space key is expected
        if (expectedKey != ' ') {
          const invalidatedLetters = [...document.querySelectorAll('.word.current .letter:not(correct)')];
          invalidatedLetters.forEach(l => {
            addClass(l, wrongKeyClasses);
          });
        }
        // Move onto next word
        removeClass(currentWord, 'current');
        addClass(currentWord.nextSibling, 'current');
        if (currentLetter) {
          removeClass(currentLetter, 'current');
        }
        addClass(currentWord.nextSibling.firstChild, 'current');
      }
    };

    document.getElementById("typingtest").addEventListener('keyup', keyPress);

    return () => {
      document.getElementById("typingtest").removeEventListener('keyup', keyPress);
    };
  }, []);

  function addClass(element, name) {
    if (Array.isArray(name)) {
      element.classList.add(...name);
    } else {
      element.classList.add(name);
    }
  }

  function removeClass(element, name) {
    if (Array.isArray(name)) {
      element.classList.remove(...name);
    } else {
      element.classList.remove(name);
    }
  }

  function formatWord(word) {
    const newWord = document.createElement("div");
    const letters = word.toLowerCase().split('');

    newWord.className = "word inline-block m-0.5 select-none";

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
    addClass(document.querySelector('.letter'), 'current');
  }

  return (
    <>
      <h1>This is a Typing Test</h1>
      <button onClick={()=>updateParagraph("Lorem ipsum dolor sit amet consectetur adipiscing elit")}>Text</button>
      <div id="typingtest" tabIndex="0" className="bg-red-300 focus:bg-blue-300">
        <div id="header">
          <div id="timer"></div>
        </div>
        <div id="words"></div>
        <div id="cursor"></div>
      </div>
    </>
  )
}