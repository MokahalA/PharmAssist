import React, { useEffect, useState } from 'react';
import { auth, firestore } from '../firebase/firebase.js';
import Sidebar from './Sidebar.js';

function UserHome() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        const userId = user.uid;
        try {
          const userSnapshot = await firestore.collection('users').doc(userId).get();
          if (userSnapshot.exists) {
            const userData = userSnapshot.data();
            setUser(userData);
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  if (!user) {
    return (
      <div>
        <p>Loading user data...</p>
      </div>
    );
  }

  const { firstName, lastName } = user;

  return (
    <>
      <Sidebar firstName={firstName} lastName={lastName} />
    </>
  )
}

export default UserHome;