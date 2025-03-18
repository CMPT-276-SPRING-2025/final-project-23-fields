import { useEffect, useState, useCallback } from 'react';
import Typing from '../components/Typing.jsx';
import { getGeminiResponse } from '../components/Gemini.jsx';

function Chatbot() {
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

    // useEffect to process bot response
    useEffect(() => {
        if (botResponse.startsWith('true')) {
            const typingTestText = botResponse.split('true')[1].trim();
            setParagraph({ text: typingTestText });
        } else if (botResponse.startsWith('false')) {
            setBotResponse(botResponse.split('false')[1].trim());
        }
    }, [botResponse]);

    // Handle form submission (send user input to the chatbot)
    const handleSubmit = async (e) => {
        e.preventDefault();
        const response = await getGeminiResponse(userInput);
        setBotResponse(response);
    };

    return (
        <div>
            <h1>This is the chatbot page</h1>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    placeholder="Ask me anything..."
                />
                <button type="submit">Send</button>
            </form>
            {paragraph.text ? (
                <p>e</p>//<Typing paragraph={paragraph} updateParagraph={updateParagraph} results={results} updateResults={updateResults}/>
            ) : (
                <p>Bot: {botResponse}</p>
            )}
            <Typing paragraph={paragraph} updateParagraph={updateParagraph} results={results} updateResults={updateResults} typingTime={typingTime} setTypingTime={setTypingTime}/>
        </div>
    );
}

export default Chatbot;