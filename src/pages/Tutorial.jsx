import Header from '../components/Header.jsx'
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
    ];


    const [image, setImage] = useState(0);

    const imageLast = () => {
        if (image === 0) {
            navigate('/');
        }
        else {
            setImage(image - 1);
        }
    };
    
    const imageNext = () => {
        if (image === Images.length - 1) {
            navigate('/Chatbot');
        }
        else {
            setImage(image + 1);
        }
    };

    return(
        <>
                <Header notLandingPage={true}/>
                <section>
                    <div className="pt-20 flex flex-col bg-zinc-800 items-center justify-center h-screen">
                        <div className="border-2">
                            <img className="w-337.5 h-162.5 object-contain"src={Images[image].url} alt={Images[image].alt}></img>
                        </div >
                        <div className="mt-10 grid grid-cols-[200px_200px] grid-rows-[75px] bg-amber-900 gap-x-14">
                            <button className="cursor-pointer" onClick={imageLast}>
                                <div className="bg-gray-700 flex items-center justify-center h-full text-3xl ">
                                    Back
                                </div>
                            </button>
                            <button className="cursor-pointer" onClick={imageNext}>
                                <div className="bg-blue-300 flex items-center justify-center h-full text-3xl">
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