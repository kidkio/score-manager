import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, doc, setDoc, updateDoc, onSnapshot } from 'firebase/firestore';
import { Link } from 'react-router-dom';

const ADMIN_PW = "1234"; // 실제 사용할 비밀번호로 수정

const AdminPage = () => {
  const [isAuth, setIsAuth] = useState(sessionStorage.getItem("admin") === "true");
  const [pw, setPw] = useState("");
  const [teams, setTeams] = useState([]);
  const [count, setCount] = useState(0);

  useEffect(() => {
    return onSnapshot(collection(db, "teams"), (snap) => {
      setTeams(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });
  }, []);

  const login = () => {
    if (pw === ADMIN_PW) {
      setIsAuth(true);
      sessionStorage.setItem("admin", "true");
    } else alert("비밀번호 틀림!");
  };

  const createTeams = async () => {
    if (!window.confirm("초기화하시겠습니까?")) return;
    for (let i = 1; i <= count; i++) {
      await setDoc(doc(db, "teams", `team${i}`), { name: `${i}팀`, score: 0 });
    }
  };

  const addScore = async (id, val) => {
    const team = teams.find(t => t.id === id);
    await updateDoc(doc(db, "teams", id), { score: (team.score || 0) + val });
  };

  if (!isAuth) return (
    <div style={{textAlign:'center', padding:'50px'}}>
      <h2>🔒 관리자 암호</h2>
      <input type="password" onChange={e => setPw(e.target.value)} />
      <button onClick={login}>접속</button>
    </div>
  );

  return (
    <div style={{padding:'20px'}}>
      <h1>🛠 관리자 패널</h1>
      <input type="number" onChange={e => setCount(e.target.value)} placeholder="팀 수" />
      <button onClick={createTeams}>팀 생성</button>
      <hr />
      {teams.map(t => (
        <div key={t.id} style={{marginBottom:'10px'}}>
          {t.name}: <b>{t.score}점</b>
          <button onClick={() => addScore(t.id, 10)}>+10</button>
          <button onClick={() => addScore(t.id, -10)}>-10</button>
          <Link to={`/team/${t.id.replace('team','')}`} target="_blank"> [페이지]</Link>
        </div>
      ))}
    </div>
  );
};

export default AdminPage;