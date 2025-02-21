import React, { useState } from 'react';
import { FetchTasks } from './comps/FetchTasks';
import { Register } from './comps/Register';
import { Login } from './comps/Login';
import axios from 'axios';

import './App.css';

function App() {
  return (
    <div className="App">
        <Register />
        <Login />
    </div>
  );
}

export default App;
