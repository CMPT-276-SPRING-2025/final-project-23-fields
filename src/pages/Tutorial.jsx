import Header from '../components/Header.jsx'

function Tutorial() {
    return(
        <>
                <Header notLandingPage={true}/>
                <section>
                    <div className="pt-20 flex flex-col bg-gray-700 items-center justify-center h-screen">
                        <div className="border-2">
                            <img className="w-337.5 h-162.5 object-contain"src="https://placehold.co/1350x650" alt="placeholder image"></img>
                        </div >
                        <div className="mt-10 grid grid-cols-[200px_200px] grid-rows-[75px] bg-amber-900 gap-x-14">
                            <div className="bg-pink-300 flex items-center justify-center">
                                <div className="text-3xl">
                                Back
                                </div>
                            </div>
                            <div className="bg-blue-300 flex items-center justify-center">
                                <div className="text-3xl">
                                Next
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
        </>

    );
}

export default Tutorial