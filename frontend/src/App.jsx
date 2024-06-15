import React from 'react';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./pages/Home/Home";
import SignUp from "./pages/SignUp/SignUp";
import Login from "./pages/Login/Login";
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute';
import LandingPage from './pages/LandingPage/LandingPage';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route 
          path='/dashboard' 
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          } 
        />
        <Route path='/signUp' element={<SignUp />} />
        <Route path='/login' element={<Login />} />
        <Route path='/' element={<LandingPage />} />
      </Routes>
    </Router>
  );
};

export default App;
