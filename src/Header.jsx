function Header() {
    return(
        <header className="fixed top-0 left-0 right-0 h-12">
            <div className="flex justify-between items-center h-full bg-gray-400">
                <div className="p-2 text-2xl">RoTypeAi</div>
                <img className="pr-2"src="https://placehold.co/40x40" alt="placeholder image"></img>
            </div>
        </header>
    );
}

export default Header