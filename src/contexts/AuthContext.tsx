
import { createContext, useContext, useState, ReactNode, useEffect } from 'react';

// Types for our context
type User = {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'member';
};

type AuthContextType = {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
  isAdmin: boolean;
};

// Create the context with default values
const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  login: async () => {},
  signup: async () => {},
  logout: () => {},
  isAdmin: false,
});

// Mock user data (will be replaced with Firebase)
const MOCK_USERS = [
  {
    id: '1',
    email: 'admin@example.com',
    password: 'password',
    name: 'Admin User',
    role: 'admin' as const,
  },
  {
    id: '2',
    email: 'member@example.com',
    password: 'password',
    name: 'Member User',
    role: 'member' as const,
  },
];

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Check for stored user on initial load
  useEffect(() => {
    const storedUser = localStorage.getItem('equishare_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  // Mock login function (will be replaced with Firebase)
  const login = async (email: string, password: string) => {
    setLoading(true);
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const matchedUser = MOCK_USERS.find(
      u => u.email === email && u.password === password
    );
    
    if (matchedUser) {
      const { password, ...userWithoutPassword } = matchedUser;
      setUser(userWithoutPassword);
      localStorage.setItem('equishare_user', JSON.stringify(userWithoutPassword));
    } else {
      throw new Error('Invalid email or password');
    }
    
    setLoading(false);
  };

  // Mock signup function (will be replaced with Firebase)
  const signup = async (email: string, password: string, name: string) => {
    setLoading(true);
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Check if user exists
    if (MOCK_USERS.some(u => u.email === email)) {
      throw new Error('User with this email already exists');
    }
    
    // In a real app, we would create the user in Firebase
    const newUser = {
      id: `${MOCK_USERS.length + 1}`,
      email,
      name,
      role: 'member' as const,
    };
    
    setUser(newUser);
    localStorage.setItem('equishare_user', JSON.stringify(newUser));
    setLoading(false);
  };

  // Logout function
  const logout = () => {
    setUser(null);
    localStorage.removeItem('equishare_user');
  };

  // Check if current user is admin
  const isAdmin = user?.role === 'admin';

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook for using the auth context
export function useAuth() {
  return useContext(AuthContext);
}
