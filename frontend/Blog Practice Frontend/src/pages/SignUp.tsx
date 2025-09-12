// src/pages/SignUp.tsx
// 匯入 React 的工具
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api'; // 使用自訂的 api

// 定義 SignUp 組件
const SignUp = () => {
  // 管理輸入欄的狀態
  const [name, setName] = useState(''); // name 輸入值
  const [email, setEmail] = useState(''); // email 輸入值
  const [password, setPassword] = useState(''); // password 輸入值
  const { setUserEmail, setUserName, setError } = useAuth(); // 從上下文取得函數
  const navigate = useNavigate(); // 用來跳轉頁面

  // 處理表單提交
  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault(); // 阻止頁面重新載入
    try {
      const response = await api.post('/api/v1/auth/register', { email, password, name });
      const { token, email: returnedEmail, name: returnedName } = response.data; // 取得 JWT 與名稱
      localStorage.setItem('token', token); // 儲存到 localStorage
      setUserEmail(returnedEmail || email); // 儲存 email
      setUserName(returnedName || name);
      setError(null); // 清除錯誤訊息
      navigate('/'); // 跳到首頁
    } catch (error: any) {
      // 顯示錯誤訊息
      setError(error.response?.data?.message || '註冊失敗，請稍後再試');
    }
  };

  // JSX 定義頁面結構
  return (
    // 外層 div，與 Home.tsx 和 Login.tsx 風格一致
    <div className="bg-white border border-gray-300 p-6 rounded-lg shadow-md max-w-md mx-auto">
      <h2 className="text-3xl font-bold mb-6 text-center">註冊</h2>
      <form onSubmit={handleSignUp}>
        {/* Name 輸入欄 */}
        <div className="mb-4">
          <label htmlFor="name" className="block text-gray-700 font-semibold mb-2">
            名稱
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        {/* Email 輸入欄 */}
        <div className="mb-4">
          <label htmlFor="email" className="block text-gray-700 font-semibold mb-2">
            Email
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
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
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        {/* 按鈕區域 */}
        <div className="flex justify-center">
          <button
            type="submit"
            className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 shadow-md"
          >
            註冊
          </button>
        </div>
      </form>
    </div>
  );
};

// 匯出組件
export default SignUp;