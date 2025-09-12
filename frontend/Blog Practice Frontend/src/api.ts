// src/api.ts
import axios from 'axios';

// 創建 axios 實例，設置基礎 URL（根據你的後端）
const api = axios.create({
  baseURL: 'http://localhost:8080', // 後端地址，根據實際情況修改
  headers: {
    'Content-Type': 'application/json',
  },
});

// 請求攔截器，自動附加 JWT
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      // 如果 token 存在，添加到 Authorization Header
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;