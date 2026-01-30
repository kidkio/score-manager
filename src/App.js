import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import AdminPage from './components/AdminPage';
import TeamPage from './components/TeamPage';
import Leaderboard from './components/Leaderboard';

function App() {
  return (
    <BrowserRouter basename={process.env.PUBLIC_URL}>
      <div className="App">
        <Routes>
          <Route path="/" element={
            <div style={{ textAlign: 'center', marginTop: '50px' }}>
              <h1>🏆 점수 관리 시스템</h1>
              <nav>
                <Link to="/admin">관리자 로그인</Link> | <Link to="/leaderboard">전체 순위표</Link>
              </nav>
            </div>
          } />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/team/:id" element={<TeamPage />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;