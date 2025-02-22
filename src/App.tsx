import React from 'react';
import { Register } from './pages/Register';
import { Login } from './pages/Login';
import { Home } from './pages/Home';

import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import './App.css';

function App() {
  return (
    <div className="App">
        <Router>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/Register" element={<Register />} />
                <Route path="/Home" element={<Home />} />
            </Routes>
        </Router>
    </div>
  );
}

export default App;
