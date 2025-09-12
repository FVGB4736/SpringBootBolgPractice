// src/components/Layout.tsx
// 匯入 React 的工具，類似 JavaScript 的 import
import type { ReactNode } from 'react'; // ReactNode 是任何 React 內容的型別（像 HTML 標籤）
import { useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom'; // 路由工具
import { FaUserCircle } from 'react-icons/fa';
import { FiPlus, FiFileText } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext'; // 自訂的上下文，取得登入狀態

// 定義組件的 props（參數），類似 JavaScript 函數的參數，但 TypeScript 要指定型別
interface LayoutProps {
  children: ReactNode; // 子組件，類似 HTML 的 <div> 裡的內容
}

// 定義 Layout 組件，類似 JavaScript 的函數，但用 TypeScript 的 React.FC 型別
const Layout: React.FC<LayoutProps> = ({ children }) => {
  // 從上下文取得 email、登出函數和錯誤訊息
  const { userEmail, userName, logout, error, setError, setUserEmail, setUserName  } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const clearError = () => {
    setError(null);
  };

  useEffect(() => {
    const handleStorageChange = () => {
      const token = localStorage.getItem('token');
      const savedEmail = localStorage.getItem('userEmail');
      const savedName = localStorage.getItem('userName');

      if (token && savedEmail) {
        setUserEmail(savedEmail);
        if (savedName) setUserName(savedName);
      } else {
        setUserEmail(null);
        setUserName(null);
      }
    };

    // 添加事件監聽器
    window.addEventListener('storage', handleStorageChange);

    // 初始檢查一次
    handleStorageChange();

    // 清理函數
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [setUserEmail, setUserName]);

  return (
    <div className="min-h-screen w-full bg-gray-100 flex flex-col">
      {/* 頂部導覽列：白底、陰影、內容置中 */}
      <header className="sticky top-0 z-10 bg-white/90 backdrop-blur supports-[backdrop-filter]:bg-white/70 shadow-sm">
        <div className="mx-auto max-w-5xl px-4">
          <div className="h-16 flex items-center justify-between">
            {/* 左側品牌 */}
            <div className="text-xl font-semibold text-gray-900">Blog Platform</div>

            {/* 中間導覽連結（永遠顯示）*/}
            <nav className="flex items-center gap-8 text-sm">
              <NavLink
                to="/"
                className={({ isActive }) =>
                  `pb-1 ${isActive ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600 hover:text-gray-900'}`
                }
              >
                Home
              </NavLink>
              <NavLink
                to="/categories"
                className={({ isActive }) =>
                  `pb-1 ${isActive ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600 hover:text-gray-900'}`
                }
              >
                Categories
              </NavLink>
              <NavLink
                to="/tags"
                className={({ isActive }) =>
                  `pb-1 ${isActive ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600 hover:text-gray-900'}`
                }
              >
                Tags
              </NavLink>
            </nav>

            {/* 右側操作區：Draft / New / User */}
            <div className="flex items-center gap-3">
              {/* 登入後顯示的按鈕 */}
              {userEmail && (
                <>
                  <Link
                    to="/posts/drafts"
                    className="inline-flex items-center gap-2 rounded-2xl bg-purple-100 text-purple-700 px-4 py-2 hover:bg-purple-200 transition"
                    title="Draft Posts"
                  >
                    <FiFileText className="text-lg" />
                    <span className="text-sm font-medium">Draft Posts</span>
                  </Link>
                  <Link
                    to="/posts/new"
                    className="inline-flex items-center gap-2 rounded-2xl bg-blue-100 text-blue-700 px-4 py-2 hover:bg-blue-200 transition"
                    title="New Post"
                  >
                    <FiPlus className="text-lg" />
                    <span className="text-sm font-medium">New Post</span>
                  </Link>

                  {/* 顯示用戶名 */}
                  <div className="inline text-sm text-gray-700 sm:inline">
                    {userName && (
                      <span className="text-sm text-gray-700">
                        Hello, {userName}
                      </span>
                    )}
                  </div>
                </>
              )}

              {/* 登入/登出按鈕 */}
              {userEmail ? (
                <button
                  onClick={handleLogout}
                  className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 text-gray-700 hover:bg-gray-200"
                  title={userEmail}
                >
                  <FaUserCircle className="text-2xl" />
                </button>
              ) : (
                <Link
                  to="/login"
                  className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 text-gray-700 hover:bg-gray-200"
                  title="Login"
                >
                  <FaUserCircle className="text-2xl" />
                </Link>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* 錯誤訊息 */}
      {error && (
        <div className="mx-auto max-w-5xl w-full px-4 mt-4">
          <div className="bg-red-100 border border-red-300 text-red-700 px-4 py-3 rounded-lg shadow-sm flex justify-between items-center">
            <span>{error}</span>
            <button onClick={clearError} className="text-red-700 hover:text-red-900 font-bold">
              ×
            </button>
          </div>
        </div>
      )}

      {/* 主內容 */}
      <main className="mx-auto max-w-5xl w-full px-4 flex-1 mt-6">
        {children}
      </main>
    </div>
  );
};

// 匯出組件，類似 JavaScript 的 module.exports
export default Layout;