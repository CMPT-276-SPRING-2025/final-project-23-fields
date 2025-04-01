import Menu from './Menu.jsx'

function Header({notLandingPage}) {
    
    // Checks if page is not landing page
    const renderCheck = () => {
        // if its not the landing page it returns menu dropdown, else it returns nothing
        if(notLandingPage) {
            return  <Menu/>
        }
        else {
            return null
        }
    };

    return(
       <header className="fixed top-0 left-0 right-0 h-15 overflow-hidden">
            <div className="flex justify-between items-center h-full bg-zinc-800 pt-2">
                <div className="ml-10 text-2xl text-blue-600 font-jost font-bold">RoTypeAi</div> 
                <div className="relative">
                    {renderCheck()}
                </div>
            </div>
        </header>
    );
}

export default Header