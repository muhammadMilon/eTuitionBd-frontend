import {
    createUserWithEmailAndPassword,
    GoogleAuthProvider,
    onAuthStateChanged,
    signInWithEmailAndPassword,
    signInWithPopup,
    signOut,
    updateProfile,
} from 'firebase/auth';
import { createContext, useContext, useEffect, useState } from 'react';
import api from '../api/axiosInstance';
import LoadingOverlay from '../components/LoadingOverlay';
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

  // Helper to set auth user manually (used after backend registration/login)
  const setAuthUser = (user) => {
    if (user) {
      // Normalize backend user to match Firebase user structure
      const normalizedUser = {
        ...user,
        uid: user.uid || user._id, // Ensure uid is set
        email: user.email,
        displayName: user.name || user.displayName || user.email?.split('@')[0],
        photoURL: user.photoUrl || user.photoURL,
        address: user.address || '',
        phone: user.phone || '',
      };
      setCurrentUser(normalizedUser);
      const role = user.role || getUserRole(user.uid || user._id) || 'student';
      setUserRole(role);
      if (user.role) {
        saveUserRole(user.uid || user._id, user.role);
      }
    }
  };

  const saveToken = (token) => {
    if (token) {
      localStorage.setItem('etuitionbd_token', token);
    }
  };

  // Sync Firebase user with backend (create/update user + get JWT & role)
  const syncWithBackend = async (firebaseUser, role) => {
    if (!firebaseUser) return;

    const body = {
      uid: firebaseUser.uid,
      email: firebaseUser.email,
      name: firebaseUser.displayName || firebaseUser.email?.split('@')[0],
      role: role || getUserRole(firebaseUser.uid) || 'student',
      photoUrl: firebaseUser.photoURL || '',
      phone: firebaseUser.phoneNumber || '',
    };

    const { data } = await api.post('/api/auth/register', body);

    if (data?.token) {
      saveToken(data.token);
    }

    if (data?.user?.role) {
      saveUserRole(firebaseUser.uid, data.user.role);
    } else {
      saveUserRole(firebaseUser.uid, body.role);
    }

    return data;
  };

  const signup = async (email, password, name, role = 'student') => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);

    if (name) {
      await updateProfile(userCredential.user, { displayName: name });
    }

    // Create / update profile in backend + get JWT & role
    await syncWithBackend(userCredential.user, role);

    return userCredential;
  };

  const login = async (email, password) => {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);

    // Ensure backend has profile and we have fresh JWT
    await syncWithBackend(userCredential.user);

    return userCredential;
  };

  const logout = () => {
    setCurrentUser(null);
    setUserRole(null);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('etuitionbd_token');
    }
    return signOut(auth);
  };

  const googleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);

    // Create / update profile in backend + get JWT & role (strictly default role student for Google login)
    await syncWithBackend(result.user, 'student');

    return result;
  };

  const updateUserRole = (role) => {
    if (currentUser) {
      saveUserRole(currentUser.uid, role);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // Firebase user detected. Check if we have a valid token first
        const token = localStorage.getItem('etuitionbd_token');
        
        if (token) {
          // We have a token, verify it first
          try {
            const { data } = await api.get('/api/auth/me');
            if (data?.user) {
              // Token is valid, use backend user data
              const normalizedUser = {
                ...data.user,
                ...user, // Keep firebase properties (uid, email, metadata)
                displayName: data.user.name || user.displayName,
                photoURL: data.user.photoUrl || user.photoURL,
                address: data.user.address || '',
                phone: data.user.phone || '',
              };
              setCurrentUser(normalizedUser);
              if (data.user.role) {
                saveUserRole(user.uid, data.user.role);
                setUserRole(data.user.role);
              } else {
                const role = getUserRole(user.uid);
                setUserRole(role);
              }
              setLoading(false);
              return;
            }
          } catch (err) {
            // Token invalid or expired, sync to get new one
            console.log("Token verification failed, syncing with backend:", err);
          }
        }
        
        // No token or token invalid, sync with backend to get/refresh token
        try {
          const syncData = await syncWithBackend(user, getUserRole(user.uid));
          
          if (syncData?.user) {
            const normalizedUser = {
              ...syncData.user,
              ...user,
              displayName: syncData.user.name || user.displayName,
              photoURL: syncData.user.photoUrl || user.photoURL,
              address: syncData.user.address || '',
              phone: syncData.user.phone || '',
            };
            setCurrentUser(normalizedUser);
            
            if (syncData.user.role) {
              saveUserRole(user.uid, syncData.user.role);
              setUserRole(syncData.user.role);
            } else {
              const role = getUserRole(user.uid);
              setUserRole(role);
            }
          } else {
            setCurrentUser(user);
            const role = getUserRole(user.uid);
            setUserRole(role);
          }
        } catch (err) {
          console.error("Backend sync failed:", err);
          // Fallback: use Firebase user only
          setCurrentUser(user);
          const role = getUserRole(user.uid);
          setUserRole(role);
        }
        
        setLoading(false);
      } else {
        // No Firebase user, check for backend token
        const token = localStorage.getItem('etuitionbd_token');
        if (token) {
          try {
             // Verify token with backend
             const { data } = await api.get('/api/auth/me');
             if (data?.user) {
                // Manually set auth user
                setAuthUser(data.user);
                setLoading(false);
                return; // Exit early after setting user
             } else {
                // Invalid response
                setCurrentUser(null);
                setUserRole(null);
                localStorage.removeItem('etuitionbd_token');
             }
          } catch (err) {
             console.log("Session restore failed:", err);
             // Don't clear token on first failure - might be network issue
             // Only clear if it's a 401 (unauthorized)
             if (err.response?.status === 401) {
               setCurrentUser(null);
               setUserRole(null);
               localStorage.removeItem('etuitionbd_token');
             } else {
               // Network error or other issue - keep token but don't set user
               // This allows user to retry
               console.warn("Could not verify token, but keeping it for retry");
             }
          }
        } else {
          // No token and no Firebase user - clear everything
          setCurrentUser(null);
          setUserRole(null);
        }
        setLoading(false);
      }
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
    setAuthUser,
    loading,
  };

  return (
    <AuthContext.Provider value={value}>
      {loading && <LoadingOverlay />}
      {children}
    </AuthContext.Provider>
  );
};

