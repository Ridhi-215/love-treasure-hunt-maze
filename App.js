import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoveTreasureHunt from "./components/LoveTreasureHunt";
import MazeGame from "./components/MazeGame";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoveTreasureHunt />} />
        <Route path="/maze" element={<MazeGame />} />
      </Routes>
    </Router>
  );
};

export default App;
