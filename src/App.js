import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import AdminPage from './components/AdminPage';
import TeamPage from './components/TeamPage';
import Leaderboard from './components/Leaderboard';
import Roulette from './components/Roulette';
import useTeams from './hooks/useTeams'; // 실시간 팀 목록을 가져오는 훅 (아래 설명)
import './App.css';

function MainMenu() {
  const teams = useTeams(); // 실시간으로 생성된 팀 목록을 가져옴

  return (
    <div className="container" style={{ textAlign: 'center', paddingBottom: '100px' }}>
      <header style={{ margin: '40px 0' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: '800', color: '#1e293b' }}>
          🔮 신서유기 🔮
        </h1>
        <p style={{ color: '#64748b' }}>드래곤 볼의 주인은 누구인가?!</p>
      </header>

      {/* 0. 랜덤 룰렛 버튼 (가장 위에 배치) */}
      <Link to="/roulette" style={{ textDecoration: 'none' }}>
        <div className="card" style={{ 
          background: 'linear-gradient(135deg, #ec4899 0%, #d946ef 100%)', 
          color: 'white',
          padding: '30px',
          marginBottom: '20px'
        }}>
          <h2 style={{ margin: 0 }}>🎡 랜덤 룰렛</h2>
          <p style={{ margin: '5px 0 0 0', opacity: 0.9 }}>게임을 랜덤하게 선택하기</p>
        </div>
      </Link>

      {/* 1. 전체 순위표 버튼 (가장 크게 배치) */}
      <Link to="/leaderboard" style={{ textDecoration: 'none' }}>
        <div className="card" style={{ 
          background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)', 
          color: 'white',
          padding: '30px'
        }}>
          <h2 style={{ margin: 0 }}>📊 전체 실시간 순위표</h2>
          <p style={{ margin: '5px 0 0 0', opacity: 0.9 }}>현재 드래곤 볼 현황 보기</p>
        </div>
      </Link>

      <h3 style={{ margin: '40px 0 20px 0', textAlign: 'left', paddingLeft: '10px' }}>
        🚩 우리 팀 페이지 입장
      </h3>

      {/* 2. 팀별 페이지 입장 버튼 (그리드 배치) */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: '1fr 1fr', 
        gap: '15px',
        marginBottom: '60px'
      }}>
        {teams.sort((a,b) => a.id.localeCompare(b.id, undefined, {numeric: true})).map((t) => (
          <Link key={t.id} to={`/team/${t.id.replace('team','')}`} style={{ textDecoration: 'none' }}>
            <div className="card" style={{ padding: '20px', margin: 0 }}>
              <h4 style={{ margin: 0, color: '#334155' }}>{t.name}</h4>
              <small style={{ color: '#94a3b8' }}>입장하기 ↗</small>
            </div>
          </Link>
        ))}
        {teams.length === 0 && <p style={{ gridColumn: '1 / 3' }}>관리자가 팀을 생성할 때까지 기다려주세요.</p>}
      </div>

      <hr style={{ border: '0', borderTop: '1px solid #e2e8f0', margin: '40px 0' }} />

      {/* 3. 관리자 페이지 링크 (맨 아래 배치) */}
      <footer style={{ opacity: 0.5 }}>
        <Link to="/admin" style={{ color: '#64748b', fontSize: '0.9rem' }}>
          ⚙️ 관리자 시스템 접속
        </Link>
      </footer>
    </div>
  );
}

// 라우팅 설정
export default function App() {
  return (
    <BrowserRouter basename={process.env.PUBLIC_URL}>
      <Routes>
        <Route path="/" element={<MainMenu />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/team/:id" element={<TeamPage />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
        <Route path="/roulette" element={<Roulette />} />
      </Routes>
    </BrowserRouter>
  );
}