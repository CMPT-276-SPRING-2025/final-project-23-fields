import Header from './components/Header.jsx'
import { BrowserRouter, Routes, Route, } from 'react-router-dom'
import Home from './pages/Home.jsx'
import Tutorial from './pages/Tutorial.jsx'
import Chatbot from './pages/Chatbot.jsx'

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />}/>
        <Route path="/Home" element={<Home />}/>
        <Route path="/Tutorial" element={<Tutorial/>}/>
        <Route path="/Chatbot" element={<Chatbot/>}/>
      </Routes>
    </BrowserRouter>
  )

}

export default App
