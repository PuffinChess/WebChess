import './App.scss'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Landingpage from './components/Landingpage'
import ChessBoard from './components/board/ChessBoard';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

function App() {

  return (
    <div className='app'>
      <DndProvider backend={HTML5Backend}>
        <Router>
          <Routes>
            <Route path="/" element={<Landingpage />} />
            <Route path="/chessboard/:type" element={<ChessBoard />} />
            <Route path="/chessboard/:type/:colour" element={<ChessBoard />} />
            <Route path="/chessboard/:type/:colour/:fen" element={<ChessBoard />} />
          </Routes>
        </Router>
      </DndProvider>
    </div>
  );
}


export default App;