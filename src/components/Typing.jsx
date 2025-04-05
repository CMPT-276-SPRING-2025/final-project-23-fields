import { useEffect } from 'react'

let keyUp = false;
let timer = null;
let startTime = null;
let lastKeyStroke = null;

export default function Typing({ paragraph, results, updateParagraph, updateResults, typingTime, setTypingTime }) {
  const correctKeyClasses = ['correct', 'text-white'];
  const wrongKeyClasses = ['wrong', 'text-red-500'];

  const sampleText = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.";

  /////////////////////////////// Analytics ///////////////////////////////
  /***********************************************************************/

  const analytics = {
    correctLetters: 0,
    totalLetters: 0,
    missedLetters: {},
    slowLetters: {},
    averageTime: 0,
  }

  function setAnalytics(correct, total, missed, slow, avg) {
    analytics.correctLetters = correct;
    analytics.totalLetters = total;
    analytics.missedLetters = missed;
    analytics.slowLetters = slow;
    analytics.averageTime = avg;
  }

  // Helper function to sanitize text
  function sanitizeParagraph(paragraph) {
    return paragraph.replace(/[^\w\s]/gi, '').toLowerCase();
  }

  function clearEffects() {
    clearInterval(timer);
    document.getElementById("typingtimer").innerHTML = "0";
    timer = null;
  }

  // Initiate test on paragraph update
  useEffect(() => {
    if (!paragraph.text) return
    clearEffects();
    document.getElementById("typingtestcontainer").style.display = 'block';
    document.getElementById("resultscontainer").style.display = 'none';

    if (!keyUp) {
      document.getElementById("typingtest").addEventListener('keyup', keyPress);
      keyUp = true;
    }
    setAnalytics(0,0,{},{},0);

    console.log(paragraph);
    populateWords(paragraph);
  }, [paragraph]);

  function getResults() {
    console.log(analytics);
    const totalTime = (new Date()).getTime() - startTime;
    let wpm, accuracy;
    const wpmElement = document.getElementById('wpm');
    const accuracyElement = document.getElementById('accuracy');
    const timerElement = document.getElementById('elapsedTime');

    wpm = Math.round((analytics.correctLetters / 5) / (totalTime / 60000));
    accuracy = Math.round((analytics.correctLetters / analytics.totalLetters) * 100);

    wpmElement.innerHTML = `${wpm}`;
    accuracyElement.innerHTML = `${accuracy}%`;
    timerElement.innerHTML = `${Math.round(totalTime / 1000)} seconds`;

    updateResults(wpm, accuracy, analytics.missedLetters, analytics.slowLetters);
  }
  
  function endTest() {
    getResults();
    clearEffects();
    document.getElementById("typingtestcontainer").style.display = 'none';
    document.getElementById("resultscontainer").style.display = 'block';
    document.getElementById("typingtest").removeEventListener('keyup', keyPress);
    keyUp = false;
  }

  const keyPress = (event) => {
    const key = event.key;
    const isSpace = key == ' ';
    const isBackspace = key == 'Backspace';
    // Return if unexpected key is pressed (not A-Z or space/backspace)
    if (key.length == 1 && !(key >= 'A' && key <= 'Z') && !(key >= 'a' && key <= 'z') && !isSpace) return;
    if (key.length > 1 && !isBackspace) return;
    const currentWord = document.querySelector('.word.current');
    const currentLetter = document.querySelector('.letter.current');
    // Return if paragraph does not exist
    if (!currentWord) return;
    const expectedKey = currentLetter ? currentLetter.innerHTML : ' ';
    const isFirstLetter = currentLetter == currentWord.firstChild;
    const currentTime = (new Date()).getTime();

    if (!timer && !isBackspace) {
      startTime = (new Date()).getTime();
      lastKeyStroke = startTime;
      timer = setInterval(()=> {
        const deltaTime = Math.round(((new Date()).getTime() - startTime) / 1000);
        if (!document.getElementById('typingtimer')) {
          clearInterval(timer);
          return;
        }
        document.getElementById('typingtimer').innerHTML = `${deltaTime}`;
      }, 1000);
    }
    
    // Increment characters typed count
    analytics.totalLetters++;
    
    const lapsedTime = currentTime - lastKeyStroke;
    lastKeyStroke = currentTime;
    
    // Condition: Valid key is pressed
    if (!isBackspace && !isSpace) {
      // Condition: Not at the end of the word
      if (currentLetter) {
        addClass(currentLetter, key === expectedKey ? correctKeyClasses: wrongKeyClasses);
        // Analytics
        if (key == expectedKey)
          analytics.correctLetters++;
        else
          analytics.missedLetters[expectedKey] = analytics.missedLetters[expectedKey] ? analytics.missedLetters[expectedKey] + 1 : 1;
        if (analytics.totalLetters > 10 && lapsedTime > analytics.averageTime * 1.25 )
          analytics.slowLetters[expectedKey] = analytics.slowLetters[expectedKey] ? analytics.slowLetters[expectedKey] + 1 : 1;

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
      // Condition: Space key is not expected
      if (expectedKey != ' ') {
        const invalidatedLetters = [...document.querySelectorAll('.word.current .letter:not(correct)')];
        invalidatedLetters.forEach(l => {
          addClass(l, wrongKeyClasses);
          analytics.missedLetters[l.innerHTML] = analytics.missedLetters[l.innerHTML] ? analytics.missedLetters[l.innerHTML] + 1 : 1;
          analytics.totalLetters++;
        });
      // Condition: Space key is expected and next word exists
      } else if (currentWord.nextSibling) {
        analytics.correctLetters++;
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
    analytics.averageTime = ((analytics.totalLetters-1) * analytics.averageTime + lapsedTime) / analytics.totalLetters;
    if (!currentWord.nextSibling && !currentLetter.nextSibling) {
      endTest();
    }

    // Autoscroll words
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
      {/*
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
      </div>
      <div id="resultscontainer" className="hidden">
        <h1>Results</h1>
        <div>
          <span>WPM</span>
          <span id="wpm">0</span>
        </div>
        <div>
          <span>ACC</span>
          <span id="accuracy">0%</span>
        </div>
        <div>
          <span id="elapsedTime">0 Seconds</span>
        </div>
        </div>
        */}
        <div className="flex flex-[2_1_0] flex-col bg-zinc-800 justify-center items-center overflow-auto sm:min-w-[50%] md:min-w-[55%] lg:min-w-0">
              <div className="bg-gray-700 lg:w-[50vw] h-[40vh] w-full  items-center justify-center flex rounded-md shadow-md">
                <div id="typingtestcontainer" className="hidden">
                  <div id="typingtestheader">
                    <div id="typingtimer" className="text-center">{typingTime / 1000}</div>
                  </div>
                  <div id="typingtest" tabIndex="0" className="group relative leading-relaxed h-[25rem] overflow-hidden rounded-md">
                    <div id="words" className="p-5 text-zinc-400 font-inter blur-sm group-focus:blur-none"></div>
                    <div id="cursor" className="absolute blur-sm group-focus:blur-none fixed w-0.5 h-6 bg-blue-600"></div>
                    <div id="focus-error" className="text-white font-inter absolute justify-center flex text-center items-center inset-0 select-none group-focus:hidden">Click here to resume</div>
                  </div>
                </div>
                <div id="resultscontainer" className="hidden text-center">
                  <h1 className="font-jost text-blue-600 font-bold text-3xl">Results</h1>
                  <div className="inline-flex gap-2 m-6">
                    <div>
                      <span className="m-2 font-jost text-white text-4xl font-bold">WPM</span>
                      <span id="wpm" className="font-jost text-white text-4xl font-bold">0</span>
                    </div>
                    <div>
                      <span className="m-2 font-jost text-white text-4xl font-bold">ACC</span>
                      <span id="accuracy" className="font-jost text-white text-4xl font-bold">0%</span>
                    </div>
                  </div>
                  <div>
                    <span id="elapsedTime" className="font-jost text-zinc-600 text-2xl">0 Seconds</span>
                  </div>
                </div>
              </div>
        </div>
    </>
  )
}