import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Home from './pages/Home';
import Login from './pages/Login';
import Play from './pages/Play';
import Leaderboard from './pages/Leaderboard';

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-quiz-darker">
        <Header />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/play" element={<Play />} />
            <Route path="/leaderboard" element={<Leaderboard />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}
