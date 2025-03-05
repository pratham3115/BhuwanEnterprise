import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import About from './aboutus'; // Adjust the import path as necessary
import Home from './home'; // Example home component

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        {/* Add other routes here */}
      </Routes>
    </Router>
  );
}

export default App;
