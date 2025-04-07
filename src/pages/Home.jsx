import Header from '../components/Header.jsx'
import { Link } from 'react-router-dom'

function Home() {
    return(
        <>
          <Header notLandingPage={false}/>
         <div className="bg-zinc-800 text-center h-screen overflow-hidden">
              <div className="flex flex-col pt-40 bg-zinc-800">
                    <div className="mb-10 text-[3rem] sm:text-[4rem] md:text-[6rem] lg:text-[6rem] xl:text-[7rem] text-blue-600 font-jost font-bold">RoTypeAI</div>
                    <div className="text-[1rem] sm:text-[1.5rem] md:text-[2rem] lg:text-[2rem] xl:text-[2.5rem] text-white font-jost font-medium">Create Personalized Typing Tests</div>
              </div>
              <div className="flex flex-col flex-wrap items-center">
                <div className="mt-35 h-40 grid sm:grid-cols-[275px_275px] grid-cols-1 gap-y-5 bg-zinc-800 sm:gap-x-25">
                      <Link to="/Tutorial" id="howtouse" className=" cursor-pointer">
                        <div className="bg-gray-700 rounded-md text-white font-jost shadow-md flex flex-col justify-center h-full p-8">
                            <div className="text-3xl mb-8">
                            How to Use
                            </div>
                            <div className="text-xl">
                            Guided Tutorial
                            </div>
                        </div>
                      </Link>
                      <Link to="/Chatbot" id="jumpin" className=" cursor-pointer">
                        <div className="text-white font-jost bg-gray-700 flex flex-col justify-center h-full shadow-md rounded-md p-8"> 
                            <div className="text-3xl mb-8">
                              Jump In
                            </div>
                            <div className="text-xl">
                              Start Typing
                            </div>
                        </div>
                      </Link>
                </div>
              </div>
          </div>
      </>
    );
}

export default Home