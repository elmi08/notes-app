import React from 'react'
import { BrowserRouter as Router, Route, Routes } from "react-router-dom"
import Home from "./pages/Home/Home"
import SignUp from "./pages/SignUp/SignUp"
import Login from "./pages/Login/Login"



const routes = (
  <Router>
    <Routes>
      <Route path='/dashboard' exact element={<Home />} />
      <Route path='/signUp' exact element={<SignUp />} />
      <Route path='/login' exact element={<Login />} />
    </Routes>
  </Router>
)


const App = () => {
  return <div>{routes}</div>

}

export default App