import Header from '../components/Header.jsx'
import { Link } from 'react-router'

function Home() {
    return(
        <>
          <Header notLandingPage={false}/>
          <div className="bg-gray-700 text-center h-screen overflow-hidden">
              <div className="flex flex-col pt-40 bg-amber-300">
                    <div className="mb-10 text-[3rem] sm:text-[4rem] md:text-[6rem] lg:text-[6rem] xl:text-[7rem]">RoTypeAi</div>
                    <div className="text-[1rem] sm:text-[1.5rem] md:text-[2rem] lg:text-[2rem] xl:text-[2.5rem]">Create Personalized Typing Tests</div>
              </div>
              <div className="flex flex-col flex-wrap items-center">
                <div className="mt-35 h-40 grid sm:grid-cols-[275px_275px] grid-cols-1 gap-y-5 bg-amber-900 sm:gap-x-25">
                      <Link to="/Tutorial" className=" cursor-pointer">
                        <div className="bg-pink-300 flex flex-col justify-center h-full p-8">
                            <div className="text-3xl mb-8">
                            How to Use
                            </div>
                            <div>
                            Guided Tutorial
                            </div>
                        </div>
                      </Link>
                      <Link to="/Chatbot" className=" cursor-pointer">
                        <div className="bg-blue-300 flex flex-col justify-center h-full p-8"> 
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