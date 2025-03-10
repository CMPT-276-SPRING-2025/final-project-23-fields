import Header from '../components/Header.jsx'
import { Link } from 'react-router'

function Home() {
    return(
        <>
        <div className="flex flex-col h-screen bg-amber-200">
          <Header notLandingPage={false}/>
          <div className="flex-1 mt-12 bg-gray-700 text-center items-center justify-center">
              <div className="flex flex-col mt-40 text-center bg-amber-50">
                    <div className="mb-10 text-8xl">RoTypeAi</div>
                    <div className="text-2xl">Create Personalized Typing Tests</div>
              </div>
              <div className="flex flex-col flex-wrap items-center">
                <div className="mt-20 h-40 grid grid-cols-[275px_275px] bg-amber-900 gap-x-30">
                      <Link to="/Tutorial" className=" cursor-pointer">
                        <div className="bg-pink-300 flex flex-col justify-center cursor-pointer h-full w-full">
                            <div className="text-3xl mb-8">
                            How to Use
                            </div>
                            <div>
                            Guided Tutorial
                            </div>
                        </div>
                      </Link>
                      <Link to="/Chatbot" className=" cursor-pointer">
                        <div className="bg-blue-300 flex flex-col justify-center cursor-pointer h-full ">
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
        </div>
      </>
    );
}

export default Home