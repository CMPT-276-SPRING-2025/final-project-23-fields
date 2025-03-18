import Header from '../components/Header.jsx'
import Progress from '../components/Progress.jsx'
import {useState} from 'react'
import { useNavigate } from 'react-router';


function Tutorial() {

    let navigate = useNavigate();

    const Images = [
        {
            url: "https://placehold.co/1300x650",
            alt: "Image1"
        },
        {
            url: "https://placehold.co/1250x650",
            alt: "Image2"
        },
        {
            url: "https://placehold.co/1200x650",
            alt: "Image3"
        },
        {
            url: "https://placehold.co/1150x650",
            alt: "Image4"
        },
        {
            url: "https://placehold.co/1100x650",
            alt: "Image5"
        },
        {
            url: "https://placehold.co/1100x600",
            alt: "Image6"
        },
    ];

    // Creates an array from 1 through 5 based on size of Images
    const Prog = Array.apply(null, Array(Images.length)).map(function (j, i){ return (i+1).toString();});


    const [progCheck, setProgCheck] = useState(0);

    const [image, setImage] = useState(0);

    // Moves to the previous image
    const imageLast = () => {
        // If its the first image, goes to Home, else moves to previous
        if (image === 0) {
            navigate('/');
        }
        else {
            setImage(image - 1);
            setProgCheck(progCheck - 1);
        }
    };

    // Moves to the next image
    const imageNext = () => {
        // If its last image, goes to Chatbot, else moves to next
        if (image === Images.length - 1) {
            navigate('/Chatbot');
        }
        else {
            setImage(image + 1);
            setProgCheck(progCheck + 1);
        }
    };

    return(
        <>
                <Header notLandingPage={true}/>
                <section>
                    <div className="pt-20 flex flex-col bg-zinc-800 items-center justify-center h-screen">
                        <Progress Prog={Prog} progCheck={progCheck}/>
                        <div className="border-2">
                            <img className="w-337.5 h-162.5 object-contain"src={Images[image].url} alt={Images[image].alt}></img>
                        </div >
                        <div className="mt-10 grid grid-cols-[200px_200px] grid-rows-[75px] gap-x-14">
                            <button className="cursor-pointer" onClick={imageLast}>
                                <div className="bg-gray-700 shadow-md rounded-md text-white text-xl font-inter flex items-center justify-center h-full text-3xl ">
                                    Back
                                </div>
                            </button>
                            <button className="cursor-pointer" onClick={imageNext}>
                                <div className="bg-gray-700 shadow-md rounded-md text-white text-xl font-inter flex items-center justify-center h-full text-3xl">
                                    Next
                                </div>
                            </button>
                        </div>
                    </div>
                </section>
        </>
    
    );
}

export default Tutorial