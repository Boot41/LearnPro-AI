import React, { createContext, useContext, useState, useEffect } from 'react';

// Define user type
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'employee';
}

// Define context type
interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, role: 'admin' | 'employee') => Promise<void>;
  logout: () => void;
}

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock user data (in a real app, this would come from an API)
const mockUsers = [
  {
    id: '1',
    name: 'Admin User',
    email: 'admin@learnpro.ai',
    password: 'admin123',
    role: 'admin' as const
  },
  {
    id: '2',
    name: 'Employee User',
    email: 'employee@learnpro.ai',
    password: 'employee123',
    role: 'employee' as const
  }
];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for existing session on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  // Login function
  const login = async (email: string, password: string) => {
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const foundUser = mockUsers.find(
      u => u.email === email && u.password === password
    );
    
    if (!foundUser) {
      setIsLoading(false);
      throw new Error('Invalid credentials');
    }
    
    const { password: _, ...userWithoutPassword } = foundUser;
    setUser(userWithoutPassword);
    localStorage.setItem('user', JSON.stringify(userWithoutPassword));
    setIsLoading(false);
  };

  // Register function
  const register = async (name: string, email: string, password: string, role: 'admin' | 'employee') => {
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Check if user already exists
    if (mockUsers.some(u => u.email === email)) {
      setIsLoading(false);
      throw new Error('User already exists');
    }
    
    // In a real app, this would create a new user in the database
    const newUser = {
      id: String(mockUsers.length + 1),
      name,
      email,
      role
    };
    
    setUser(newUser);
    localStorage.setItem('user', JSON.stringify(newUser));
    setIsLoading(false);
  };

  // Logout function
  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};