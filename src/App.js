import React, { useEffect, useState } from 'react';
import './App.css';
import LoginRegisterTabs from './components/LoginRegisterTabs';
import { auth } from './firebase/firebase';
import UserHome from './components/UserHome';

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUser(user);
      } else {
        setUser(null);
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <>
      {user ? <UserHome /> : <LoginRegisterTabs />}
    </>
  );
}

export default App;