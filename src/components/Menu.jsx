import { Link } from 'react-router-dom'
import {useState} from 'react'

function Menu() {

    const [expanded, setExpanded] = useState(false);

    // Negates expanded
    const Expand = () => {
        setExpanded(!expanded)
    };

    return(
        <>
        {expanded && 
        <>
            <ul className="flex absolute right-30 space-x-5 top-0.5">
                <Link to="/Tutorial" className=" cursor-pointer">
                    <li className="cursor-pointer font-jost text-white">Tutorial</li>
                </Link>
                <Link to="/ChatBot" className=" cursor-pointer">
                    <li className="cursor-pointer font-jost text-white">ChatBot</li>
                </Link>
            </ul>
        </>}
        <button className="mr-15 cursor-pointer" onClick={Expand}>
            <img src={"./src/assets/icons/menu.svg"} alt="menu icon" className="mt-px"></img>
        </button>
        </>
    );
}

export default Menu