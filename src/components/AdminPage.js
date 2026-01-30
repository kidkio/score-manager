import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { db } from '../firebase';
import { collection, doc, setDoc, updateDoc, onSnapshot, increment, deleteDoc, getDocs, query } from 'firebase/firestore';
import '../App.css'; // 스타일 임포트

const ADMIN_PW = "1234"; 

const AdminPage = () => {
  const [isAuth, setIsAuth] = useState(sessionStorage.getItem("admin") === "true");
  const [pw, setPw] = useState("");
  const [teams, setTeams] = useState([]);
  const [count, setCount] = useState(0);
  const [steal, setSteal] = useState({ from: "", to: "", amount: 0 });

  useEffect(() => {
    return onSnapshot(collection(db, "teams"), (snap) => {
      setTeams(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });
  }, []);

  const login = () => {
    if (pw === ADMIN_PW) {
      setIsAuth(true);
      sessionStorage.setItem("admin", "true");
    } else alert("비밀번호가 틀렸습니다.");
  };

  const createTeams = async () => {
  const teamNum = parseInt(count);
  if (isNaN(teamNum) || teamNum <= 0) return alert("올바른 팀 수를 입력하세요.");
  if (!window.confirm(`[주의] 모든 기존 데이터를 삭제하고 ${teamNum}개의 팀으로 다시 만듭니다.`)) return;

  try {
    // 1. 현재 Firestore에 저장된 '모든' 팀 문서를 가져오기
    const q = query(collection(db, "teams"));
    const querySnapshot = await getDocs(q);

    // 2. 모든 문서를 하나씩 삭제 (이게 확실히 지워주는 부분입니다)
    const deletePromises = querySnapshot.docs.map((document) => 
      deleteDoc(doc(db, "teams", document.id))
    );
    await Promise.all(deletePromises);

    // 3. 새로 요청한 수만큼 팀 생성
    const createPromises = [];
    for (let i = 1; i <= teamNum; i++) {
      createPromises.push(
        setDoc(doc(db, "teams", `team${i}`), { 
          name: `${i}팀`, 
          score: 0, 
          pendingRequest: null 
        })
      );
    }
    await Promise.all(createPromises);
    
    alert(`완전 초기화 완료! 이제 ${teamNum}개 팀만 존재합니다.`);
  } catch (error) {
    console.error("초기화 중 오류 발생:", error);
    alert("권한이 없거나 네트워크 오류가 발생했습니다.");
  }
};

  const addScore = async (id, val) => {
    const team = teams.find(t => t.id === id);
    // 0점 미만 방지 로직
    const nextScore = Math.max(0, (team.score || 0) + val);
    await updateDoc(doc(db, "teams", id), { score: nextScore });
  };

  const runSteal = async () => {
    const { from, to, amount } = steal;
    const sAmt = Number(amount);
    if (!from || !to || sAmt <= 0) return alert("입력값을 확인하세요.");
    if (from === to) return alert("자기 자신에게서 뺏을 수 없습니다.");

    const fT = teams.find(t => t.id === from);
    const tT = teams.find(t => t.id === to);
    const actual = Math.min(fT.score, sAmt);

    await updateDoc(doc(db, "teams", from), { score: fT.score - actual });
    await updateDoc(doc(db, "teams", to), { score: tT.score + actual });
    alert("강제 이동 완료!");
  };

  if (!isAuth) return (
    <div className="container" style={{marginTop: '100px'}}>
      <div className="card">
        <h2>🔒 관리자 인증</h2>
        <input type="password" onChange={e => setPw(e.target.value)} placeholder="암호 입력" />
        <button className="btn-primary" onClick={login}>접속하기</button>
      </div>
    </div>
  );

  return (
    <>
      <nav className="nav-header">
        <Link to="/" className="home-icon">🏠 홈</Link>
        <div style={{fontWeight:'bold'}}>관리자 모드</div>
        <Link to="/leaderboard">📊 순위표</Link>
      </nav>
      
      <div className="container">
        <h1>🛠 관리 설정</h1>
        
        <div className="card">
          <h3>1. 팀 초기화</h3>
          <input type="number" onChange={e => setCount(e.target.value)} placeholder="생성할 팀 수" />
          <button className="btn-primary" onClick={createTeams}>팀 생성/초기화</button>
        </div>

        <div className="card">
          <h3>2. 강제 점수 이동</h3>
          <select onChange={e => setSteal({...steal, from: e.target.value})}>
            <option value="">뺏길 팀 선택</option>
            {teams.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
          </select>
          <select onChange={e => setSteal({...steal, to: e.target.value})}>
            <option value="">받을 팀 선택</option>
            {teams.filter(t => t.id !== steal.from).map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
          </select>
          <input type="number" placeholder="이동할 점수" onChange={e => setSteal({...steal, amount: e.target.value})} />
          <button className="btn-success" onClick={runSteal}>강제 이동 실행</button>
        </div>

        <h3>3. 실시간 팀 리스트</h3>
        <div className="admin-table-wrapper">
          <table>
            <thead>
              <tr><th>팀</th><th>점수</th><th>조절</th><th>링크</th></tr>
            </thead>
            <tbody>
              {teams.sort((a,b) => a.id.localeCompare(b.id, undefined, {numeric: true})).map(t => (
                <tr key={t.id}>
                  <td>{t.name}</td>
                  <td style={{fontWeight:'bold'}}>{t.score}</td>
                  <td>
                    <button onClick={() => addScore(t.id, 1)} style={{marginRight:'5px', padding:'5px 10px'}}>+1</button>
                    <button onClick={() => addScore(t.id, -1)} style={{padding:'5px 10px'}}>-1</button>
                  </td>
                  <td><Link to={`/team/${t.id.replace('team','')}`}>🔗</Link></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default AdminPage;