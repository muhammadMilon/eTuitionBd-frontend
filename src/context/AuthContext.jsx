import { createContext, useContext, useEffect, useState } from 'react';
import { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  updateProfile
} from 'firebase/auth';
import { auth } from '../firebase/firebase.config';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);

  // Get user role from localStorage or default to 'student'
  const getUserRole = (userId) => {
    if (!userId) return null;
    const storedRole = localStorage.getItem(`userRole_${userId}`);
    return storedRole || 'student'; // Default role is student
  };

  // Save user role to localStorage
  const saveUserRole = (userId, role) => {
    if (userId && role) {
      localStorage.setItem(`userRole_${userId}`, role);
      setUserRole(role);
    }
  };

  const signup = async (email, password, name, role = 'student') => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    if (name) {
      await updateProfile(userCredential.user, { displayName: name });
    }
    // Save role to localStorage
    saveUserRole(userCredential.user.uid, role);
    return userCredential;
  };

  const login = (email, password) => {
    return signInWithEmailAndPassword(auth, email, password);
  };

  const logout = () => {
    setUserRole(null);
    return signOut(auth);
  };

  const googleSignIn = (role = 'student') => {
    const provider = new GoogleAuthProvider();
    return signInWithPopup(auth, provider).then((result) => {
      // Save role for Google sign-in
      saveUserRole(result.user.uid, role);
      return result;
    });
  };

  const updateUserRole = (role) => {
    if (currentUser) {
      saveUserRole(currentUser.uid, role);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      if (user) {
        const role = getUserRole(user.uid);
        setUserRole(role);
      } else {
        setUserRole(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    userRole,
    signup,
    login,
    logout,
    googleSignIn,
    updateUserRole,
    loading,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

