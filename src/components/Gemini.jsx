import { useEffect, useState, useCallback } from 'react';
import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = import.meta.env.VITE_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
    model: "gemini-2.0-flash",
    systemInstruction: "You are a chatbot that can respond to user questions, but can also create typing tests for the user. At the start of your response you must always put true or false. If true (NO UPPER CASE for true) you print the typing test after true with a one-line gap and no other responses, else print false (NO UPPERCASE for false) at the start of every response if replying normally. Do not add words with contractions.",
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

export default function Gemini({ paragraph, setParagraph, botResponse, setBotResponse, userInput, setUserInput}) {
    const [history, setHistory] = useState([]);

    const sanitizeText = (text) => {
        return text.toLowerCase().replace(/[.,'"!?]/g, ''); // Added return
    };

    const updateHistory = (userMessage, botMessage) => {
        setHistory((prevHistory) => [...prevHistory, { user: userMessage, bot: botMessage }]);
    };

    const updateParagraph = useCallback((text) => {
        setParagraph({ text: sanitizeText(text) }); // Ensures state is an object
    }, [setParagraph]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!userInput.trim()) return;

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
            setBotResponse(""); // Clear bot response since it's a typing test
            setParagraph({ text: typingTestText });
        } else {
            setBotResponse(response.slice(5).trim());
            setParagraph({ text: null });
        }

        setHistory([
            ...history,
            { user: userInput, bot: response.slice(5).trim() }
        ]);
        setUserInput('');
    };
    
    useEffect(() => {
        if (paragraph.text) {
            setBotResponse(""); // Clear bot response when a typing test starts
        }
    }, [paragraph]);

    useEffect(() => {
        const startConversation = async () => {
            const initialMessage = "Hello! Would you like to start a typing test or ask a question?";
            setBotResponse(initialMessage);
            setHistory([{ user: "Bot", bot: initialMessage }]); // Add bot message to history
        };

        startConversation(); // Call function when the component loads
    }, [setBotResponse, setHistory]);

    return (
        <div>
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
        </div>
    );
}
