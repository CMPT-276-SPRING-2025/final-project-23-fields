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
      const isBackspace = key == 'Backspace';
      const isFirstLetter = currentLetter == currentWord.firstChild;

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
          addClass(letterSpan, wrongKeyClasses.concat(["letter", "extraletter"]))
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
      // Condition: Backspace key pressed
      } else if(isBackspace) {
        // Condition: Ignore very first word of paragraph
        if (currentLetter && isFirstLetter && !currentWord.previousSibling) {
        // Condition: On first letter of the word
        } else if (currentLetter && isFirstLetter) {
          removeClass(currentWord, 'current');
          addClass(currentWord.previousSibling, 'current');
          removeClass(currentLetter, 'current');
          if (!currentWord.previousSibling.lastChild.classList.contains("extraletter")) {
            addClass(currentWord.previousSibling.lastChild, 'current');
            removeClass(currentWord.previousSibling.lastChild, correctKeyClasses.concat(wrongKeyClasses));
          }
        // Condition: In the middle of a word
        } else if (currentLetter && !isFirstLetter) {
          removeClass(currentLetter, 'current');
          addClass(currentLetter.previousSibling, 'current');
          removeClass(currentLetter.previousSibling, correctKeyClasses.concat(wrongKeyClasses));
          if (currentLetter.classList.contains("extraletter"))
            currentLetter.remove();
        } else if (!currentLetter) {
          if (currentWord.lastChild.classList.contains("extraletter")) {
            currentWord.lastChild.remove();
          } else {
            addClass(currentWord.lastChild, 'current');
            removeClass(currentWord.lastChild, correctKeyClasses.concat(wrongKeyClasses));
          }
        }
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
      <button onClick={()=>updateParagraph("Lorem ipsum dolor sit amet consectetur adipiscing elit")}>Test Button</button>
      <div id="typingtestheader">
        <div id="timer"></div>
      </div>
      <div id="typingtest" tabIndex="0" className="group relative leading-8 h-24 overflow-hidden bg-red-300 focus:bg-blue-300">
        <div id="words" className="blur-sm group-focus:blur-none"></div>
        <div id="cursor" className="hidden"></div>
        <div id="focus-error" className="absolute pt-8 text-center inset-0 select-none group-focus:hidden">Click here to resume</div>
      </div>
    </>
  )
}