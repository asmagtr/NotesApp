
import React from 'react'
import {BrowserRouter, Routes, Route} from 'react-router-dom'
import Home from './pages/Home/Home'
import Login from './pages/Login/Login'
import SignUp from './pages/SignUp/SignUp'
import Page1 from './pages/Page1'
import Page2 from './pages/Page2'
const routes=(
  <BrowserRouter>
  <Routes>
    <Route path='/dashboard' element={<Home />} />
    <Route path='/login' element={<Login/>}></Route>
    <Route path='/signup' element={<SignUp/>}></Route>
  </Routes>
  
  </BrowserRouter>
);


const App = () => {
  return (
    <div>
    {routes}

    </div>
  )
}

export default App