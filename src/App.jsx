import Header from './Header.jsx'

function App() {
  return (
    <>
      <div className="flex flex-col h-screen bg-amber-200">
        <Header></Header>
        <div className="flex-1 mt-12 bg-gray-700 text-center items-center justify-center">
            <div className="flex inline-block flex-col mt-40 text-center bg-amber-50">
                  <div className="mb-10 text-8xl">RoTypeAi</div>
                  <div className="text-2xl">Create Personalized Typing Tests</div>
            </div>
            <div>
              
            </div>
        </div>
      </div>

    </>
  ); 
}

export default App
