function Progress({Prog = [], progCheck}) {
    return (
        <div className="flex space-x-10 mb-2">
            {Prog.map((j, index) => (
                <div key={Prog[index]}>
                    <div className={`${progCheck === index ? 'bg-blue-500' : 'bg-gray-400'} w-10 h-10 rounded-full`}></div>
                </div>
            ))}
        </div>
    );
};

export default Progress