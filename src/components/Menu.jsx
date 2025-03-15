import { Link } from 'react-router'
import {useState} from 'react'

function Menu() {

    const [expanded, setExpanded] = useState(false);

    const Expand = () => {
        setExpanded(!expanded)
    };

    return(
        <>
        {expanded && 
        <>
            <ul className="flex absolute right-30 space-x-5 top-0.5">
                <Link to="/Tutorial" className=" cursor-pointer">
                    <li className="cursor-pointer">Tutorial</li>
                </Link>
                <Link to="/ChatBot" className=" cursor-pointer">
                    <li className="cursor-pointer">ChatBot</li>
                </Link>
            </ul>
        </>}
        <button className="mr-15 cursor-pointer" onClick={Expand}>
            <img src="https://placehold.co/35x30" alt="placeholder image"></img>
        </button>
        </>
    );
}

export default Menu