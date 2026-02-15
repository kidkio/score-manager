import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const games = [
  { id: 1, name: '👀 눈싸움 👀', emoji: '👀' },
  { id: 2, name: '🤜 손가락 씨름 🤜', emoji: '🤜' },
  { id: 3, name: '⏱️ 타이머 10초 맞추기 ⏱️', emoji: '⏱️' },
  { id: 4, name: '✂️ 릴레이 가위바위보 ✂️', emoji: '✂️' },
  { id: 5, name: '🗣️ 참참참 🗣️', emoji: '🗣️' },
  { id: 6, name: '🎲 랜덤 🎲', emoji: '🎲' }
];

export default function Roulette() {
  const [selectedGame, setSelectedGame] = useState(null);
  const [isSpinning, setIsSpinning] = useState(false);

  const handleSpin = () => {
    if (isSpinning) return;

    setIsSpinning(true);
    
    // 스핀 애니메이션 (1초)
    let rotation = 0;
    const spinInterval = setInterval(() => {
      rotation += 30;
    }, 10);

    setTimeout(() => {
      clearInterval(spinInterval);
      
      // 랜덤하게 게임 선택
      const randomIndex = Math.floor(Math.random() * games.length);
      setSelectedGame(games[randomIndex]);
      setIsSpinning(false);
    }, 1000);
  };

  return (
    <div className="container" style={{ textAlign: 'center', paddingBottom: '100px' }}>
      <header style={{ margin: '40px 0' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: '800', color: '#1e293b' }}>
          🎡 랜덤 룰렛 🎡
        </h1>
        <p style={{ color: '#64748b' }}>버튼을 눌러서 게임을 선택하세요!</p>
      </header>

      {/* 룰렛 원형 표시 */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: '10px',
        marginBottom: '50px',
        padding: '30px 20px',
        backgroundColor: '#f1f5f9',
        borderRadius: '15px'
      }}>
        {games.map((game) => (
          <div
            key={game.id}
            style={{
              width: '100px',
              height: '100px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: selectedGame?.id === game.id ? '#3b82f6' : '#e2e8f0',
              borderRadius: '10px',
              fontSize: '2rem',
              border: selectedGame?.id === game.id ? '3px solid #1e40af' : 'none',
              transition: 'all 0.3s ease',
              cursor: 'pointer'
            }}
          >
            {game.emoji}
          </div>
        ))}
      </div>

      {/* 선택된 게임 표시 */}
      {selectedGame && (
        <div style={{
          marginBottom: '40px',
          padding: '30px',
          backgroundColor: '#dbeafe',
          borderRadius: '15px',
          border: '2px solid #3b82f6'
        }}>
          <h2 style={{ color: '#1e40af', margin: '0 0 10px 0' }}>🎉 선택된 게임 🎉</h2>
          <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1e40af', margin: 0 }}>
            {selectedGame.name}
          </p>
        </div>
      )}

      {/* 스핀 버튼 */}
      <button
        onClick={handleSpin}
        disabled={isSpinning}
        style={{
          padding: '20px 40px',
          fontSize: '1.2rem',
          fontWeight: 'bold',
          backgroundColor: isSpinning ? '#cbd5e1' : '#ef4444',
          color: 'white',
          border: 'none',
          borderRadius: '10px',
          cursor: isSpinning ? 'not-allowed' : 'pointer',
          marginBottom: '30px',
          transition: 'all 0.3s ease',
          opacity: isSpinning ? 0.6 : 1
        }}
      >
        {isSpinning ? '🔄 스핀 중...' : '🎲 룰렛 돌리기!'}
      </button>

      <hr style={{ border: '0', borderTop: '1px solid #e2e8f0', margin: '40px 0' }} />

      {/* 홈으로 돌아가기 버튼 */}
      <Link to="/" style={{ textDecoration: 'none' }}>
        <button style={{
          padding: '12px 24px',
          fontSize: '1rem',
          backgroundColor: '#64748b',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          cursor: 'pointer',
          transition: 'all 0.3s ease'
        }}>
          ← 메인 페이지로 돌아가기
        </button>
      </Link>
    </div>
  );
}
