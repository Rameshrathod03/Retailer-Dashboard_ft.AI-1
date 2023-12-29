import { getAuth, onAuthStateChanged } from '@firebase/auth'
import { initializeApp } from 'firebase/app'
import { useState, useEffect, useContext, createContext } from 'react'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: "AIzaSyCBYnsRnEL6qH3kRZp1VqF4SJF7gDWofrw",
  authDomain: "retailer-dashboard-14499.firebaseapp.com",
  databaseURL: "https://retailer-dashboard-14499-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "retailer-dashboard-14499",
  storageBucket: "retailer-dashboard-14499.appspot.com",
  messagingSenderId: "801683875751",
  appId: "1:801683875751:web:4d071b7f91e5a5b4c07882",
  measurementId: "G-S9RQQCX594"
};

export const app = initializeApp(firebaseConfig)

export const auth = getAuth(app);

export const db = getFirestore(app);

export const AuthContext = createContext({
  user: undefined, // Initial state set to undefined
  error: null
});


export const AuthContextProvider  = ({ children }) => {
  const [user, setUser] = useState(undefined)
  const [error, setError] = useState(null)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, 
      (user) => setUser(user), // Set to user object or null
      setError
    );
    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, error }}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook to use auth state
export const useAuthState = () => {
  const { user, error } = useContext(AuthContext);
  return {
    user,
    error,
    isAuthenticated: user != null,
    isLoading: user === undefined
  };
};

export default app;