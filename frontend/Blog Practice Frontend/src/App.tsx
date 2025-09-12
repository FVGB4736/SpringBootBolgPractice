// src/App.tsx
// 匯入 React Router 的工具，類似 HTML 的 <a> 和 JavaScript 的 window.location
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// 匯入 AuthProvider，提供全域的登入狀態和錯誤訊息
import { AuthProvider } from './context/AuthContext';
// 匯入頁面和組件
import Layout from './components/Layout';
import Home from './pages/Home';
import Categories from './pages/Categories';
import Tags from './pages/Tags';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import CreateNewPost from './pages/CreateNewPost';
import DraftPosts from './pages/DraftPosts';
import PostDetail from './pages/PostDetail';

// 定義 App 組件，類似 HTML 的主頁面結構
function App() {
  return (
    // 用 AuthProvider 包住應用程式，類似一個「隱形盒子」，分享登入狀態和錯誤訊息
    <AuthProvider>
      {/* Router 負責處理頁面跳轉，類似 JavaScript 的 window.location */}
      <Router>
        {/* Layout 是所有頁面的外框，包含導航欄和錯誤訊息區域 */}
        <Layout>
          {/* Routes 定義路由規則，類似 HTML 的 <a> 連結對應不同頁面 */}
          <Routes>
            {/* 首頁路由，顯示 Home 組件 */}
            <Route path="/" element={<Home />} />
            <Route path="/posts/new" element={<CreateNewPost />} />
            <Route path="/posts/drafts" element={<DraftPosts />} />
            <Route path="/post/:id" element={<PostDetail />} />
            {/* Tags 頁面，顯示 Tags 組件 */}
            <Route path="/tags" element={<Tags />} />
            {/* Categories 頁面，顯示 Categories 組件 */}
            <Route path="/categories" element={<Categories />} />
            {/* 登入頁面，顯示 Login 組件 */}
            <Route path="/login" element={<Login />} />
            {/* 註冊頁面，顯示 SignUp 組件 */}
            <Route path="/signup" element={<SignUp />} />
          </Routes>
        </Layout>
      </Router>
    </AuthProvider>
  );
}

// 匯出 App 組件，類似 JavaScript 的 module.exports
export default App;