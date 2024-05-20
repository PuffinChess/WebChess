import './App.scss'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Landingpage from './components/Landingpage'
import ChessBoard from './components/board/ChessBoard';
import { Position } from './components/utils/Position';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { startNewGame } from './api/UCI';

function testApi() {
    console.log(startNewGame());
}

function App() {
  // Define the onDrop function
  const onDrop = (fromPosition: Position, toPosition: Position) => {
    console.log(`Moved from ${fromPosition} to ${toPosition}`);
    // Here you would update the state of your chessboard to reflect the move
  };

  return (
    <div className='app'>
      <DndProvider backend={HTML5Backend}>
        <Router>
          <Routes>
            <Route path="/" element={<Landingpage />} />
            <Route path="/chessboard/" element={<ChessBoard />} />
            <Route path="/chessboard/:fen" element={<ChessBoard />} />
          </Routes>
        </Router>
      </DndProvider>
      <button onClick={() => testApi()}>TestApi</button>
    </div>
  );
}


export default App
