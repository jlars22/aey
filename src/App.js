import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Today from './Pages/Today';
import Home from './Pages/Home';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/today" element={<Today />} />
      <Route path="/simulation" element={<div>Simulation</div>} />
    </Routes>
  );
}

export default App;
