import React from 'react';
import './App.scss'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Landingpage from './components/Landingpage'
import ChessBoard from './components/Chessboard';

function App() {

  return (
    <div className='app'>
      <Router>
        <Routes>
          <Route path="/" element={<Landingpage />} />
          <Route path="/chessboard" element={<ChessBoard />} />
          <Route path="/chessboard/:fen" element={<ChessBoard />} />
        </Routes>
      </Router>
    </div>
  )
}

export default App
