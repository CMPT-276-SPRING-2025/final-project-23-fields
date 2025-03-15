function Header(props) {
    
    const renderCheck = () => {
        if(props.notLandingPage) {
            return  <button className="mr-15 cursor-pointer">
                    <img src="https://placehold.co/35x30" alt="placeholder image"></img>
                    </button>
        }
        else {
            return null
        }
    };

    return(
        <header className="fixed top-0 left-0 right-0 h-15">
            <div className="flex justify-between items-center h-full bg-zinc-800 pt-2">
                <div className="ml-10 text-2xl text-blue-600 font-jost font-bold">RoTypeAI</div> 
                {renderCheck()}
            </div>
        </header>
    );
}

export default Header