// src/main.tsx
import React from 'react';  // 導入 React 核心庫，類似 Java 的 import java.util.*;
import ReactDOM from 'react-dom/client';  // 用於渲染到 DOM，類似 Spring Boot 的 Application.run()
import App from './App.tsx';  // 導入 App 元件
import './index.css';  // 導入全局 CSS（包含 Tailwind 樣式）

// 渲染 App 到 HTML 的 root 元素
// React.StrictMode 是開發模式下的檢查工具，會偵測潛在問題（如重複渲染）
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
