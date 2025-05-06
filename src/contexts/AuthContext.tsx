
import React, { createContext, useContext, useState, useEffect } from 'react';

type UserRole = 'admin' | 'editor' | 'viewer';

type UserType = {
  username: string;
  role: UserRole;
};

type AuthContextType = {
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  user: UserType | null;
  isLoading: boolean;
  waitlistCount: number;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// For demo purposes, we're using a simple admin credential
// In production, this should be handled securely
const ADMIN_USERNAME = "admin";
const ADMIN_PASSWORD = "petSerpentes2023"; // This should be hashed in production

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<UserType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [waitlistCount, setWaitlistCount] = useState(0);

  useEffect(() => {
    // Check if user is logged in from localStorage
    const storedUser = localStorage.getItem('adminUser');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        setIsAuthenticated(true);
      } catch (error) {
        console.error("Failed to parse stored user", error);
        localStorage.removeItem('adminUser');
      }
    }
    
    // Load waitlist count
    try {
      const waitlist = JSON.parse(localStorage.getItem('waitlist') || '[]');
      setWaitlistCount(waitlist.length);
    } catch (error) {
      console.error("Failed to load waitlist", error);
    }
    
    setIsLoading(false);
  }, []);

  const login = async (username: string, password: string): Promise<boolean> => {
    // This is a simple authentication method
    // In production, you should use a secure authentication system
    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      // Default role is admin for this demo
      const userData = { username, role: 'admin' as UserRole };
      setUser(userData);
      setIsAuthenticated(true);
      localStorage.setItem('adminUser', JSON.stringify(userData));
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('adminUser');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout, user, isLoading, waitlistCount }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
