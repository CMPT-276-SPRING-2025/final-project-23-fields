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
            <ul className="flex absolute right-10 space-x-5 -bottom-3">
                <Link to="/Tutorial" className=" cursor-pointer">
                    <li className="text-xl cursor-pointer hover:underline font-jost text-white">Tutorial</li>
                </Link>
                <Link to="/ChatBot" className=" cursor-pointer">
                    <li className="text-xl cursor-pointer hover:underline font-jost text-white">ChatBot</li>
                </Link>
            </ul>
        </>
    );
}

export default Menu