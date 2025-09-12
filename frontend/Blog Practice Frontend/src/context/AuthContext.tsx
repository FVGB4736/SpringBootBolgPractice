// src/context/AuthContext.tsx
// 管理全局認證狀態的上下文

import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';

// 定義認證上下文的類型
interface AuthContextType {
  userEmail: string | null;
  userName: string | null;
  setUserEmail: (email: string | null) => void;
  setUserName: (name: string | null) => void;
  error: string | null;
  setError: (error: string | null) => void;
  logout: () => void;
}

// 創建認證上下文
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  // 從 localStorage 加載初始狀態
  const [userEmail, setUserEmail] = useState<string | null>(() => {
    return localStorage.getItem('userEmail');
  });
  
  const [userName, setUserName] = useState<string | null>(() => {
    return localStorage.getItem('userName');
  });
  
  const [error, setError] = useState<string | null>(null);

  // 在組件掛載時檢查登入狀態
  useEffect(() => {
    const token = localStorage.getItem('token');
    const savedEmail = localStorage.getItem('userEmail');
    const savedName = localStorage.getItem('userName');
    
    if (token && savedEmail) {
      setUserEmail(savedEmail);
      if (savedName) setUserName(savedName);
    }
  }, []);

  // 登出函數
  const logout = () => {
    setUserEmail(null);
    setUserName(null);
    localStorage.removeItem('token');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userName');
  };

  // 提供上下文值
  const contextValue = {
    userEmail,
    userName,
    setUserEmail: (email: string | null) => {
      if (email) {
        localStorage.setItem('userEmail', email);
        setUserEmail(email); // 確保調用 setUserEmail 更新狀態
      } else {
        localStorage.removeItem('userEmail');
        setUserEmail(null); // 確保調用 setUserEmail 更新狀態
      }
      setUserEmail(email);
    },
    setUserName: (name: string | null) => {
      if (name) {
        localStorage.setItem('userName', name);
        setUserName(name); // 確保調用 setUserName 更新狀態
      } else {
        localStorage.removeItem('userName');
        setUserName(null); // 確保調用 setUserName 更新狀態
      }
      setUserName(name);
    },
    error,
    setError,
    logout
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

// 自定義 Hook 用於訪問認證上下文
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};