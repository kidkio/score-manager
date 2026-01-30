import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, onSnapshot } from 'firebase/firestore';

const Leaderboard = () => {
  const [teams, setTeams] = useState([]);

  useEffect(() => {
    return onSnapshot(collection(db, "teams"), (snap) => {
      const data = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      setTeams(data.sort((a, b) => b.score - a.score));
    });
  }, []);

  return (
    <div style={{padding:'40px', textAlign:'center', backgroundColor:'#111', color:'#fff', minHeight:'100vh'}}>
      <h1>🏆 LIVE RANKING</h1>
      {teams.map((t, i) => (
        <div key={t.id} style={{fontSize:'24px', margin:'10px', padding:'10px', background:'#333', borderRadius:'8px'}}>
          {i + 1}위 - {t.name}: {t.score}pts
        </div>
      ))}
    </div>
  );
};

export default Leaderboard;