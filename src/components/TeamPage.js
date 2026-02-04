import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { db } from '../firebase';
import { doc, onSnapshot, updateDoc, collection, deleteField, getDoc } from 'firebase/firestore';
import '../App.css';

const TeamPage = () => {
  const { id } = useParams();
  const myTeamId = `team${id}`;
  const [myTeam, setMyTeam] = useState(null);
  const [allTeams, setAllTeams] = useState([]);
  const [targetId, setTargetId] = useState("");
  const [amt, setAmt] = useState(0);

  useEffect(() => {
    onSnapshot(doc(db, "teams", myTeamId), (d) => setMyTeam(d.data()));
    onSnapshot(collection(db, "teams"), (s) => setAllTeams(s.docs.map(d => ({id: d.id, ...d.data()}))));
  }, [myTeamId]);

  const sendReq = async () => {
    if (!targetId || amt <= 0) return alert("대상과 점수를 확인하세요.");
    await updateDoc(doc(db, "teams", targetId), {
      pendingRequest: { fromId: myTeamId, fromName: myTeam.name, amount: Number(amt) }
    });
    alert("요청을 보냈습니다!");
  };

  const approve = async () => {
    const req = myTeam.pendingRequest;
    const actual = Math.min(myTeam.score, req.amount); // 내 점수만큼만 뺏기도록 설정
    const attackerRef = doc(db, "teams", req.fromId);
    
    const attSnap = await getDoc(attackerRef);
    await updateDoc(attackerRef, { score: (attSnap.data().score || 0) + actual });
    await updateDoc(doc(db, "teams", myTeamId), { score: myTeam.score - actual, pendingRequest: deleteField() });
    alert(`${actual}점이 이동되었습니다!`);
  };

  if (!myTeam) return <div className="container">로딩 중...</div>;

  return (
    <>
      <nav className="nav-header">
        <Link to="/" className="home-icon">🏠 홈</Link>
        <div style={{fontWeight:'bold', color:'#334155'}}>{myTeam.name} 대시보드</div>
        <Link to="/leaderboard">📊 순위</Link>
      </nav>

      <div className="container">
        <div className="card" style={{background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white'}}>
          <div style={{fontSize: '4rem', fontWeight: '800'}}>🔮{myTeam.score}🔮</div>
          <p style={{margin: 0, opacity: 0.8}}>현재 우리 팀 드래곤 볼 개수</p>
        </div>

        <div className="card">
          <h3>🎯 다른 팀 드래곤 볼 뺏기</h3>
          <p style={{fontSize:'0.8rem', color:'#666'}}>상대방이 승인하면 드래곤 볼이 이동합니다.</p>
          <select onChange={e => setTargetId(e.target.value)}>
            <option value="">공격할 팀 선택</option>
            {allTeams.filter(t => t.id !== myTeamId).map(t => (
              <option key={t.id} value={t.id}>{t.name} ({t.score}개)</option>
            ))}
          </select>
          <input type="number" placeholder="뺏을 드래곤 볼 개수 입력" onChange={e => setAmt(e.target.value)} />
          <button className="btn-success" onClick={sendReq}>뺏기 요청 전송</button>
        </div>

        {myTeam.pendingRequest && (
          <div className="alert-box">
            <h3 style={{margin: '0 0 10px 0'}}>🚨 방어 하세요!</h3>
            <p><b>{myTeam.pendingRequest.fromName}</b>이 <b>{myTeam.pendingRequest.amount}개의</b> 드래곤 볼을 요청했습니다.</p>
            <div style={{display:'flex', gap:'10px', marginTop:'15px'}}>
              <button className="btn-danger" style={{flex: 1}} onClick={approve}>승인({myTeam.pendingRequest.amount}개 차감)</button>
              <button className="btn-primary" style={{flex: 1, backgroundColor:'#999'}} onClick={async () => {
                await updateDoc(doc(db, "teams", myTeamId), { pendingRequest: deleteField() });
              }}>거절</button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default TeamPage;