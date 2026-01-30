import { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, onSnapshot } from 'firebase/firestore';

export default function useTeams() {
  const [teams, setTeams] = useState([]);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "teams"), (snap) => {
      setTeams(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });
    return () => unsubscribe();
  }, []);

  return teams;
}