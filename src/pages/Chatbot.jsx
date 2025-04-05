import { useEffect, useState, useCallback } from 'react';
import Typing from '../components/Typing.jsx';
import Gemini from '../components/Gemini.jsx';
import Header from '../components/Header.jsx';
import Mediawiki from '../components/mediawiki.jsx';

function Chatbot() {  
    // (string) keyword to use for searching wikipedia API, request for message amount 
    const [searchKeyword, setSearchKeyword] = useState({request: "", keyword: ""});

    // (string) extract containing text returned from searched Wikipedia article, missing for error confirmation
    const [articleText, setArticleText] = useState({missing: true, extract: ""});

    // @text (string) generated typing test data
    const [paragraph, setParagraph] = useState({
        text: null
    });

    // (int) time limit of typing test in milliseconds (default is 30000)
    const [typingTime, setTypingTime] = useState(30000);

    // State for storing user input from text box
    const [userInput, setUserInput] = useState('');

    // State for storing gemini response
    const [botResponse, setBotResponse] = useState('');

    // @wpm (int) words per minute
    // @accuracy (int) percent of letters typed right
    // @missedLetters (dictionary) letters user made most errors on
    // @slowLetters (dictionary) letters user took the longest time on
    const [results, setResults] = useState({
        wpm: null,
        accuracy: null,
        // structure for missedLetters and slowLetters:
        // missedLetters {
        //   A: 2
        //   B: 3
        //   ...
        // }
        missedLetters: null,
        slowLetters: null
    });

    // Function to sanitize text (convert to lowercase and remove special symbols)
    const sanitizeText = (text) => {
        return text.toLowerCase().replace(/[.,'"!?]/g, '');
    };

    // updateParagraph(text)
    // @text (string) generated typing test data
    const updateParagraph = useCallback((text) => {
        setParagraph({
            ...paragraph,
            text: sanitizeText(text)
        })
    });

    // updateResults(wpm, accuracy, missedLetters, slowLetters)
    // @wpm (int) words per minute
    // @accuracy (int) percent of letters typed right
    // @missedLetters (dictionary) letters user made most errors on
    // @slowLetters (dictionary) letters user took the longest time on
    const updateResults = useCallback((wpm, accuracy, missedLetters, slowLetters) => {
        setResults({
            ...results,
            wpm: wpm,
            accuracy: accuracy,
            missedLetters: missedLetters,
            slowLetters: slowLetters
        })
    });
    
    return (
       <>
            <Header notLandingPage={true}/>
            <div className="bg-gray-200 flex h-screen justify-center pt-14">
                <Typing paragraph={paragraph} updateParagraph={updateParagraph} results={results} updateResults={updateResults} typingTime={typingTime} setTypingTime={setTypingTime}/>
                <Gemini paragraph={paragraph} setParagraph={setParagraph} 
                botResponse={botResponse} setBotResponse={setBotResponse} 
                userInput={userInput} setUserInput={setUserInput} 
                updateParagraph={updateParagraph} results={results}/>
                <Mediawiki searchKeyword={searchKeyword} setSearchKeyword={setSearchKeyword} articleText={articleText} setArticleText={setArticleText}/>
            </div>
       </> 
    );
}

export default Chatbot;