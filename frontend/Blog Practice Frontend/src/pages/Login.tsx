// src/pages/Login.tsx
// 匯入 React 的工具，類似 JavaScript 的 import
import { useState } from 'react'; // 用來管理輸入欄的狀態
import { useNavigate, Link } from 'react-router-dom'; // 路由工具，Link 像 <a>，useNavigate 像 window.location
import { useAuth } from '../context/AuthContext'; // 取得上下文的狀態
import api from '../api'; // 使用自訂的 api

// 定義 Login 組件，類似 JavaScript 的函數
const Login = () => {
  // useState 管理輸入欄的值，類似 JavaScript 的變數
  const [email, setEmail] = useState(''); // email 輸入值，初始為空字串
  const [password, setPassword] = useState(''); // password 輸入值，初始為空字串
  // 從上下文取得設定 email 和錯誤訊息的函數
  const { setUserEmail, setUserName, setError } = useAuth();
  // 用來跳轉頁面
  const navigate = useNavigate();

  // 處理登入表單提交
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // 發送登入請求
      const response = await api.post('/api/v1/auth/login', { email, password });
      
      // 從響應中提取數據
      const { token, email: userEmail, name } = response.data;
      
      // 保存 token 和用戶信息到 localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('userEmail', userEmail);
      if (name) {
        localStorage.setItem('userName', name);
      }
      
      // 更新認證狀態
      setUserEmail(userEmail);
      setUserName(name || null);
      setError(null);
      
      // 跳轉到首頁
      navigate('/');
    } catch (error: any) {
      // 如果請求失敗，顯示錯誤訊息
      setError(error.response?.data?.message || '登入失敗，請稍後再試');
    }
  };

  // JSX 像 HTML，定義頁面結構
  return (
    // 外層 div，風格與 Home.tsx 的卡片一致
    <div className="bg-white border border-gray-300 p-6 rounded-lg shadow-md max-w-md mx-auto">
      <h2 className="text-3xl font-bold mb-6 text-center">登入</h2>
      {/* 表單，類似 HTML 的 <form> */}
      <form onSubmit={handleLogin}>
        {/* Email 輸入欄 */}
        <div className="mb-4">
          <label htmlFor="email" className="block text-gray-700 font-semibold mb-2">
            Email
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)} // 更新 email 狀態
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required // 強制填寫，類似 HTML 的 required
          />
        </div>
        {/* 密碼輸入欄 */}
        <div className="mb-6">
          <label htmlFor="password" className="block text-gray-700 font-semibold mb-2">
            密碼
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)} // 更新 password 狀態
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        {/* 按鈕區域 */}
        <div className="flex justify-between">
          <button
            type="submit"
            className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 shadow-md"
          >
            登入
          </button>
          <Link to="/signup">
            <button className="bg-gray-100 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-200 shadow-md">
              註冊
            </button>
          </Link>
        </div>
      </form>
    </div>
  );
};

// 匯出組件
export default Login;