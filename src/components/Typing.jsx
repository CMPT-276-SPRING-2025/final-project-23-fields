import { useEffect } from 'react'

export default function Typing({ paragraph, results, updateParagraph, updateResults, typingTime, setTypingTime }) {
  const correctKeyClasses = ['correct', 'text-white'];
  const wrongKeyClasses = ['wrong', 'text-red-500'];

  const sampleText = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.";
  window.timer = null;
  window.testStart = null;

  const analytics = {
    correctLetters: 0,
    totalLetters: 0,
    missedLetters: {},
    slowLetters: {},
    averageTime: 0,
  }

  // Helper function to sanitize text
  function sanitizeParagraph(paragraph) {
    return paragraph.replace(/[^\w\s]/gi, '').toLowerCase();
  }

  // Initiate test on paragraph update
  useEffect(() => {
    if (!paragraph.text) return
    document.getElementById("typingtestcontainer").style.display = 'block';

    document.getElementById("typingtest").addEventListener('keyup', keyPress);

    console.log(paragraph);
    populateWords(paragraph);
    window.timer = null;
  }, [paragraph]);

  function getResults() {

  }

  function endTest() {
    clearInterval(window.timer);
    document.getElementById("typingtestcontainer").style.display = 'none';

    document.getElementById("typingtest").removeEventListener('keyup', keyPress);
  }

  const keyPress = (event) => {
    const key = event.key;
    const isSpace = key == ' ';
    const isBackspace = key == 'Backspace';
    if (key.length == 1 && !(key >= 'A' && key <= 'Z') && !(key >= 'a' && key <= 'z') && !isSpace) return;
    if (key.length > 1 && !isBackspace) return;
    const currentWord = document.querySelector('.word.current');
    const currentLetter = document.querySelector('.letter.current');
    if (!currentWord) return;
    const expectedKey = currentLetter ? currentLetter.innerHTML : ' ';
    const isFirstLetter = currentLetter == currentWord.firstChild;

    if (!window.timer && !isBackspace && !isSpace) {
      window.gameStart = (new Date()).getTime();
      window.timer = setInterval(()=> {
        const deltaTime = ((new Date()).getTime() - window.gameStart);
        const remainingTime = Math.round((typingTime - deltaTime) / 1000);
        if (!document.getElementById('typingtimer')) {
          clearInterval(window.timer);
          return;
        }
        document.getElementById('typingtimer').innerHTML = `${remainingTime}`;

        if (remainingTime <= 0) {
          endTest();
        }
      }, 1000)
    }
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
      if (currentWord.nextSibling) {
        removeClass(currentWord, 'current');
        addClass(currentWord.nextSibling, 'current');
        if (currentLetter) {
          removeClass(currentLetter, 'current');
        }
        addClass(currentWord.nextSibling.firstChild, 'current');
      }   
      
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

    const typingTest = document.getElementById('typingtest');
    const typingRect = typingTest.getBoundingClientRect();
    if (currentWord.getBoundingClientRect().top > typingRect.top + (typingRect.height / 2)) {     
      let iWord = document.getElementById('words').firstChild;
      while (iWord.getBoundingClientRect().top < typingRect.top + (typingRect.height / 4)) {
        iWord = iWord.nextSibling;
      }
      iWord = iWord.previousSibling;
      while (iWord.previousSibling != null) {
        iWord = iWord.previousSibling;
        iWord.nextSibling.remove();
      }
      iWord.remove();
      console.log(currentWord.getBoundingClientRect().top + " : bigger!")
    }

    // Move cursor
    const nextLetter = document.querySelector('.letter.current');
    const nextWord = document.querySelector('.word.current');
    const cursor = document.getElementById('cursor');
    cursor.style.top = `${(nextLetter || nextWord).getBoundingClientRect().top}px`;
    cursor.style.left = `${(nextLetter || nextWord).getBoundingClientRect()[nextLetter ? 'left' : 'right']}px`;
  };

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

    const wordArray = sanitizeParagraph(paragraph.text).split(" ");
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
      <button onClick={()=>updateParagraph(sampleText)}>Test Button</button>
      <div id="typingtestcontainer" className="hidden">
        <div id="typingtestheader">
          <div id="typingtimer">{typingTime / 1000}</div>
        </div>
        <div id="typingtest" tabIndex="0" className="group relative leading-relaxed h-24 overflow-hidden bg-red-300 focus:bg-blue-300">
          <div id="words" className="blur-sm group-focus:blur-none"></div>
          <div id="cursor" className="blur-sm group-focus:blur-none fixed w-0.5 h-6 bg-black"></div>
          <div id="focus-error" className="absolute pt-8 text-center inset-0 select-none group-focus:hidden">Click here to resume</div>
        </div>
        <div id="resultscontainer" className="hidden">
          <div id="wpm">

          </div>
        </div>
      </div>
    </>
  )
}