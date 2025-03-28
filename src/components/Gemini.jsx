import { useEffect, useState, useCallback } from 'react';
import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = import.meta.env.VITE_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
    model: "gemini-2.0-flash",
    systemInstruction: "You are a chatbot that can respond to user questions, but can also create typing tests for the user. At the start of your response you must always put true or false. If true (NO UPPER CASE for true) you print the typing test after true with a one-line gap and no other responses, else print false (NO UPPERCASE for false) at the start of every response if replying normally. Do not add words with contractions. Whenever the user asks a question, always drive them to create a typing test instead of just printing out your answer, but do not be so pushy about this.",
});

const generationConfig = {
    temperature: 0.5,
    topP: 0.95,
    topK: 40,
    maxOutputTokens: 1024,
    responseMimeType: "text/plain",
};

export const getGeminiResponse = async (message, history = []) => {
    try {
        const chatSession = model.startChat({ generationConfig, history });
        const result = await chatSession.sendMessage(message);
        return result.response.text();
    } catch (error) {
        console.error("Error fetching Gemini response:", error);
        return "false Sorry, something went wrong. Please reload the website.";
    }
};


export default function Gemini({ paragraph, setParagraph, botResponse, setBotResponse, userInput, setUserInput, updateParagraph, results}) {
    const [history, setHistory] = useState([]);
    const [feedbackContext, setFeedbackContext] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!userInput.trim()) return;

        setHistory((prevHistory) => [...prevHistory, { user: userInput, bot: "..." }]);
        
        if (feedbackContext && userInput.toLowerCase() === "yes") {
            setFeedbackContext(false);
            const mostMissedLetter = Object.entries(results.missedLetters || {}).sort((a, b) => b[1] - a[1])[0];
            const mostSlowLetter = Object.entries(results.slowLetters || {}).sort((a, b) => b[1] - a[1])[0];
            const feedbackMessage = `Create a new typing test with real sentences that targets these weaknesses:${mostMissedLetter[0]}${mostSlowLetter[0]}`;
            const response = await getGeminiResponse(feedbackMessage);
            if (response.startsWith('true')) {
                updateParagraph(response.slice(4).trim());
            }
            setBotResponse("Test has been adjusted based on feedback.");
            setUserInput('');
            return;
        }

        const formattedHistory = history.map(entry => [
            { role: "user", parts: [{ text: entry.user }] },
            { role: "model", parts: [{ text: entry.bot }] }
        ]).flat();

        const newMessage = { role: "user", parts: [{ text: userInput }] };
        const updatedHistory = [...formattedHistory, newMessage];
        const response = await getGeminiResponse(userInput, updatedHistory);
        
        if (response.startsWith('true')) {
            const typingTestText = response.slice(4).trim();
            updateParagraph(typingTestText);
            setBotResponse("");
        } else {
            setBotResponse(response.slice(5).trim());
            setParagraph({ text: null });
        }

        setHistory((prevHistory) => prevHistory.map((entry, index) => 
            index === prevHistory.length - 1 ? { ...entry, bot: response.slice(5).trim() } : entry
        ));
        setUserInput('');
    };
    
    useEffect(() => {
        const mostMissedLetter = Object.entries(results.missedLetters || {}).sort((a, b) => b[1] - a[1])[0];
        const mostSlowLetter = Object.entries(results.slowLetters || {}).sort((a, b) => b[1] - a[1])[0];
        // Incase we want to use top 3 instead of just the top.
        // const topMissedLetters = Object.entries(results.missedLetters || {}).sort((a, b) => b[1] - a[1])[0];
        // const topSlowLetters = Object.entries(results.slowLetters || {}).sort((a, b) => b[1] - a[1])[0];

        const feedbackMessage = `Typing Test Results: WPM: ${results.wpm}, Accuracy: ${results.accuracy}%, Most Missed Letter: ${mostMissedLetter ? `${mostMissedLetter[0]}` : "None"}, Slowest Letter: ${mostSlowLetter ? `${mostSlowLetter[0]}` : "None"}. Would you like to adjust the test based on feedback?`;
        setBotResponse(feedbackMessage);
        setHistory((prevHistory) => [...prevHistory, { user: "", bot: feedbackMessage }]);
        setUserInput('');
        setFeedbackContext(true);
    }, [results]);

    useEffect(() => {
        const startConversation = async () => {
            const initialMessage = "Hello! Would you like to start a typing test or ask a question?";
            setBotResponse(initialMessage);
            setHistory([{ user: "Bot", bot: initialMessage }]); // Add bot message to history
        };

        startConversation(); // Call function when the component loads
    }, [setBotResponse, setHistory]);

    return (
        <> {/*
            {!paragraph.text && <p>Bot: {botResponse}</p>}
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    placeholder="Ask me anything..."
                />
                <button type="submit">Send</button>
            </form>
            */}
            <div className="bg-zinc-800 flex items-center justify-center min-h-screen  overflow-hidden">
                <div className="bg-amber-200 h-200 w-150 flex flex-col justify-center rounded-md">
                    {/* Chat Output */}
                    <div className="bg-amber-50 ml-5 h-160 max-h-160 w-140 max-w-140 flex-col overflow-scroll overflow-x-hidden">
                            {
                                history.map((message,index) =>(
                                    <div key={index} className="p-1 max-w-fit mb-2">
                                      {index !== 0 && <div className="bg-amber-400 rounded-md mb-2">User: {message.user}</div>}
                                        <div className="bg-amber-100 rounded-md">Bot: {message.bot}</div>
                                    </div>
                                ))
                            }
                    </div>
                    {/* Input */}
                    <div className="bg-green-700 mt-5 mx-5 h-20 rounded-lg grid grid-cols-[450px_1fr]">
                        <form onSubmit={handleSubmit} className="bg-pink-200 rounded-l-md">
                            <input className="h-full w-full"
                                type="text"
                                placeholder="Ask RoTypeAI"
                                value={userInput}
                                onChange={(e) => setUserInput(e.target.value)}>
                            </input>
                        </form>
                        <button
                        className="bg-amber-50 rounded-r-md flex justify-center items-center cursor-pointer"
                        onClick={handleSubmit}>Send
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}
