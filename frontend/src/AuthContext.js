import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load user from localStorage
    const loadUser = () => {
      try {
        const userData = localStorage.getItem('user');
        const isLoggedIn = localStorage.getItem('isLoggedIn');
        
        console.log('🔍 AuthContext checking localStorage...');
        console.log('userData:', userData);
        console.log('isLoggedIn:', isLoggedIn);
        
        if (userData && isLoggedIn === 'true') {
          const parsedUser = JSON.parse(userData);
          setUser(parsedUser);
          console.log('✅ User loaded from localStorage:', parsedUser);
        } else {
          console.log('❌ No user found in localStorage');
          setUser(null);
        }
      } catch (error) {
        console.error('❌ Error loading user:', error);
        localStorage.removeItem('user');
        localStorage.removeItem('isLoggedIn');
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    
    loadUser();
  }, []);

  const login = (userData) => {
    try {
      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('isLoggedIn', 'true');
      setUser(userData);
      console.log('✅ User logged in:', userData);
      return { success: true };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: error.message };
    }
  };

  const logout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('access_token');
    localStorage.removeItem('isLoggedIn');
    setUser(null);
    console.log('✅ User logged out');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};