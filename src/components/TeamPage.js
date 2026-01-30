import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { db } from '../firebase';
import { doc, onSnapshot, updateDoc, collection, deleteField } from 'firebase/firestore';

const TeamPage = () => {
  const { id } = useParams();
  const [myTeam, setMyTeam] = useState(null);
  const [teams, setTeams] = useState([]);

  useEffect(() => {
    onSnapshot(doc(db, "teams", `team${id}`), (d) => setMyTeam(d.data()));
    onSnapshot(collection(db, "teams"), (s) => setTeams(s.docs.map(d => ({id: d.id, ...d.data()}))));
  }, [id]);

  const approve = async () => {
    const req = myTeam.pendingRequest;
    const attacker = teams.find(t => t.id === req.from);
    await updateDoc(doc(db, "teams", `team${id}`), { score: myTeam.score - req.amount, pendingRequest: deleteField() });
    await updateDoc(doc(db, "teams", req.from), { score: attacker.score + req.amount });
  };

  if (!myTeam) return "로딩 중...";

  return (
    <div style={{textAlign:'center', padding:'20px'}}>
      <h1>{myTeam.name} 점수: {myTeam.score}</h1>
      {myTeam.pendingRequest && (
        <div style={{border:'2px solid red', padding:'10px'}}>
          <p>{myTeam.pendingRequest.from}팀이 {myTeam.pendingRequest.amount}점 요청함!</p>
          <button onClick={approve}>승인하기</button>
        </div>
      )}
    </div>
  );
};

export default TeamPage;