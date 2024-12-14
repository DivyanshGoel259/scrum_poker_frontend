import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Game, GamePage } from './pages/game/Game-Page'
import { CreateGame } from './pages/createGame/CreateGame'


function App() {

  return (
    <>
     <BrowserRouter>
        <Routes>
          <Route path='/' element={<CreateGame/>}/>
          <Route path='/game/:gameId' element={<GamePage/>}/>
        </Routes>
     </BrowserRouter>
    </>
  )
}

export default App
