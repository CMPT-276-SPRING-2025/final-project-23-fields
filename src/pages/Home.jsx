import Header from '../components/Header.jsx'
import { Link } from 'react-router'

function Home() {
    return(
        <>
          <Header notLandingPage={false}/>
          <div className="bg-zinc-800 text-center h-screen">
              <div className="flex flex-col pt-40 bg-zinc-800">
                    <div className="mb-10 text-8xl text-blue-600 font-jost font-bold">RoTypeAI</div>
                    <div className="text-2xl text-white font-jost font-medium">Create Personalized Typing Tests</div>
              </div>
              <div className="flex flex-col flex-wrap items-center">
                <div className="mt-35 h-40 grid grid-cols-[275px_275px] bg-zinc-800 gap-x-25">
                      <Link to="/Tutorial" className=" cursor-pointer">
                        <div className="shadow-md rounded-md bg-gray-700 text-white font-jost flex flex-col justify-center h-full">
                            <div className="text-3xl mb-8">
                            How to Use
                            </div>
                            <div>
                            Guided Tutorial
                            </div>
                        </div>
                      </Link>
                      <Link to="/Chatbot" className=" cursor-pointer">
                        <div className="rounded-md shadow-md text-white font-jost bg-gray-700 flex flex-col justify-center h-full">
                            <div className="text-3xl mb-8">
                              Jump In
                            </div>
                            <div>
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