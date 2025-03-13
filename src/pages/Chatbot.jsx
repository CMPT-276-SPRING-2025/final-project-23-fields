import { useState, useCallback } from 'react'
import Typing from '../components/Typing.jsx'

function Chatbot() {
    // @text (string) generated typing test data
    const [paragraph, setParagraph] = useState({
        text: null
    });
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
    
    // updateParagraph(text)
    // @text (string) generated typing test data
    const updateParagraph = useCallback((text)=>{
        setParagraph({
            ...paragraph,
            text: text
        })
    });
    
    // updateResults(wpm, accuracy, missedLetters, slowLetters)
    // @wpm (int) words per minute
    // @accuracy (int) percent of letters typed right
    // @missedLetters (dictionary) letters user made most errors on
    // @slowLetters (dictionary) letters user took the longest time on
    const updateResults = useCallback((wpm, accuracy, missedLetters, slowLetters)=>{
        setResults({
            ...results,
            text: wpm,
            accuracy: accuracy,
            missedLetters: missedLetters,
            slowLetters: slowLetters
        })
    });

    return(
        <>
            <h1>This is the chatbot page</h1>
            <Typing paragraph={paragraph} results={results} updateParagraph={updateParagraph} updateResults={updateResults} />
        </>
    );
}

export default Chatbot