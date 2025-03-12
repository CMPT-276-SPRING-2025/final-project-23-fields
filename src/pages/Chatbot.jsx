import { useState, useCallback } from 'react'
import Typing from '../components/Typing.jsx'

function Chatbot() {
    const [paragraph, setParagraph] = useState({
        text: null
    });
    
    // updateParagraph(text)
    //   - [text]: generated typing test data
    const updateParagraph = useCallback((text)=>{
        setParagraph({
            ...paragraph,
            text: text
        })
    });

    return(
        <>
            <h1>This is the chatbot page</h1>
            <Typing paragraph={paragraph} updateParagraph={updateParagraph}/>
        </>
    );
}

export default Chatbot