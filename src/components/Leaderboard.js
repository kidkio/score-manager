import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { db } from '../firebase';
import { collection, onSnapshot } from 'firebase/firestore';
import '../App.css';

const Leaderboard = () => {
  const [teams, setTeams] = useState([]);

  useEffect(() => {
    return onSnapshot(collection(db, "teams"), (snap) => {
      setTeams(snap.docs.map(d => ({ id: d.id, ...d.data() })).sort((a,b) => b.score - a.score));
    });
  }, []);

  return (
    <div style={{backgroundColor: '#0f172a', minHeight: '100vh', color: 'white'}}>
      <nav className="nav-header" style={{backgroundColor: '#1e293b', borderBottom: '1px solid #334155'}}>
        <Link to="/" style={{color: '#94a3b8'}}>🏠 홈으로</Link>
        <span style={{color: '#fbbf24', fontWeight:'bold'}}>실시간 전체 순위</span>
        <div style={{width: '50px'}}></div> 
      </nav>

      <div className="container">
        <h1 style={{textAlign: 'center', fontSize: '2.5rem', color: '#fbbf24', margin: '30px 0'}}>🏆 RANKING</h1>
        {teams.map((t, i) => (
          <div key={t.id} className="card" style={{
            backgroundColor: '#1e293b',
            border: i === 0 ? '2px solid #fbbf24' : '1px solid #334155',
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            padding: '20px', color: 'white'
          }}>
            <div style={{display:'flex', alignItems:'center'}}>
              <span style={{fontSize: '1.5rem', fontWeight: '800', marginRight: '20px', color: i < 3 ? '#fbbf24' : '#64748b'}}>
                {i + 1}
              </span>
              <span style={{fontSize: '1.2rem'}}>{t.name}</span>
            </div>
            <div style={{fontSize: '1.8rem', fontWeight: '800'}}>{t.score} pts</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Leaderboard;