import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Homepage from "./pages/Homepage.jsx";
import Summarizer from "./pages/Summarizer.jsx";
import "./App.css";

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/summarizer" element={<Summarizer />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
