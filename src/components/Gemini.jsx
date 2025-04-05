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


export default function Gemini({ paragraph, setParagraph, botResponse, setBotResponse, userInput, setUserInput, updateParagraph}) {
    const [history, setHistory] = useState([]);

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
        } else {
            setBotResponse(response.slice(5).trim());
            setParagraph({ text: null });
        }

        setHistory((prevHistory) => [
            ...prevHistory,
            { user: userInput, bot: response.slice(5).trim() }
        ]);
        
        console.log(history);

        setUserInput('');
    };

    const rowOutput = (message, index, sender) => {
        if (sender === 'user') {
            if (index != 0) {
                return (
                    <>
                        <div className="flex justify-end">
                            <div className="flex flex-row p-1 rounded-md max-w-[90%] mt-[0.5vw] mr-[0.5vw] ml-[0.5vw]">
                                <div className="bg-neutral-900 mr-[0.5vw] rounded-md p-2 font-inter">
                                    {message}
                                </div>
                                <div className="min-w-[1.5rem] max-h-[1.5rem] rounded-[50%] text-center bg-neutral-900 text-blue-600 font-bold">
                                    Y
                                </div>     
                            </div>
                        </div>
                    </>
                )
            }
        }
        else {
            return (
                <>
                    <div className="flex justify-start">
                        <div className="flex flex-row p-2 rounded-md max-w-[90%] mt-[0.5vw] mr-[0.5vw] ml-[0.5vw] ">
                            <div className="min-w-[1.5rem] max-h-[1.5rem] rounded-[50%] text-center text-blue-600 font-jost font-bold bg-neutral-900">
                                R
                            </div>
                            <div className="bg-neutral-900 ml-[0.5vw] rounded-md p-2 font-inter">
                                {message}
                            </div>
                        </div>
                    </div>
                </>
            )
        }     
     
    }
    
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
            <div className="flex flex-[1_1_0] bg-zinc-800 w-full h-full overflow-auto justify-center items-center min-w-[50%] md:min-w-[45%] lg:min-w-0">
                <div className="flex flex-col bg-gray-700 shadow-md items-center justify-around rounded-md w-[30vw] h-[92vh] min-w-11/12 lg:min-w-3/5 text-white">
                    {/* Chat Output */}
                    <div className="flex flex-col items-center">
                        <div id="message" className="bg-gray-700 h-[80vh] w-[29vw] overflow-scroll overflow-x-hidden min-w-18/12 md:min-w-14/10 lg:min-w-0">
                                {
                                    history.map((message,index) =>(
                                        <div key={index}>
                                            {/* User Response*/}
                                            {rowOutput(message.user, index, 'user')}
                                            {/* Bot Response  */}
                                            {rowOutput(message.bot, index, 'bot')}
                                        </div>
                                        //<div key={index} className={`flex ${message.user ? 'justify-end' : 'justify-start'}`}>
                                          //  <div className="flex flex-row p-1 rounded-md max-w-[90%] mt-[0.5vw] mr-[0.5vw] bg-amber-400">
                                            //    {index !== 0 && <div className="bg-amber-400 rounded-md mb-2">User: {message.user}</div>}
                                              //  <div className="bg-amber-100 rounded-md">Bot: {message.bot}</div>
                                           // </div>
                                       // </div> 
                                    ))
                                }
                                <div className="mb-1"></div>
                        </div>
                    </div>
                    {/* Input */}
                    <div className="bg-green-500 flex h-[10vh] w-[29vw] rounded-md min-w-19/20 md:min-w-79/80 lg:min-w-0 text-white">
                        <form onSubmit={handleSubmit} className="bg-neutral-900 min-w-10/12 rounded-l-md">
                            <input className="h-full w-full p-2"
                                type="text"
                                placeholder="Ask RoTypeAI"
                                value={userInput}
                                onChange={(e) => setUserInput(e.target.value)}>
                            </input>
                        </form>
                        <button id="send"
                        className="bg-neutral-900 min-w-2/12 rounded-r-md cursor-pointer"
                        onClick={handleSubmit}>Send
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}
