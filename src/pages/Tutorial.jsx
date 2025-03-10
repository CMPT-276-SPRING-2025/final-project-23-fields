import Header from '../components/Header.jsx'

function Tutorial() {
    return(
        <>
            <div className="flex flex-col h-screen bg-amber-200">
                <Header notLandingPage={true}/>
                <div className="flex-1 mt-12 bg-gray-700 text-center items-center justify-center">
                    <div className=" border-2">
                        <img src="https://placehold.co/600x600" alt="placeholder image"></img>
                    </div>
                </div>
            </div>
        </>

    );
}

export default Tutorial