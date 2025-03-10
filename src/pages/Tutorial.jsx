import Header from '../components/Header.jsx'

function Tutorial() {
    return(
        <>
            
                <Header notLandingPage={true}/>
                <section>
                    <div className="flex bg-gray-700 items-center justify-center h-screen">
                        <div className=" border-2">
                            <img src="https://placehold.co/600x600" alt="placeholder image"></img>
                        </div>
                    </div>
                </section>
                
          
        </>

    );
}

export default Tutorial