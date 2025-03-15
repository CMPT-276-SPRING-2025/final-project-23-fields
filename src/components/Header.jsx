import Menu from './Menu.jsx'

function Header(props) {
    
    const renderCheck = () => {
        if(props.notLandingPage) {
            return  <Menu/>
        }
        else {
            return null
        }
    };

    return(
        <header className="fixed top-0 left-0 right-0 h-15">
            <div className="flex justify-between items-center h-full bg-gray-400 pt-2">
                <div className="ml-10 text-2xl">RoTypeAi</div> 
                <div className="relative">
                    {renderCheck()}
                </div>
            </div>
        </header>
    );
}

export default Header