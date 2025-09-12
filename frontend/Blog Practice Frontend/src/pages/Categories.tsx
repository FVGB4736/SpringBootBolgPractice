import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';

interface Category {
  id: string;
  name: string;
  postCount: number;
}

const Categories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [newCategoryName, setNewCategoryName] = useState<string>(''); // 新增 category 的輸入框狀態
  const [error, setError] = useState<string | null>(null); // 錯誤訊息狀態

  // 從後端獲取分類數據
  const fetchCategories = async () => {
    try {
      const response = await api.get('/api/v1/categories');
      setCategories(response.data);
      setLoading(false);
    } catch (err) {
      console.error('載入分類失敗:', err);
      setError('載入分類失敗，請稍後再試');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // 處理新增 category
  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategoryName.trim()) {
      setError('分類名稱不能為空');
      return;
    }

    try {
      await api.post('/api/v1/categories', { name: newCategoryName });
      await fetchCategories();
      setNewCategoryName('');
      setError(null);
    } catch (err) {
      console.error('創建分類失敗:', err);
      setError('創建分類失敗，請確認名稱是否重複或稍後再試');
    }
  };

  // 處理刪除分類
  const handleDeleteCategory = async (id: string) => {
    if (!window.confirm('確定要刪除這個分類嗎？此操作無法復原。')) {
      return;
    }

    try {
      await api.delete(`/api/v1/categories/${id}`);
      await fetchCategories();
    } catch (err) {
      console.error('刪除分類失敗:', err);
      setError('刪除分類失敗，請稍後再試');
    }
  };

  if (loading) {
    return <div className="text-center p-6">Loading...</div>;
  }

  return (
    <div className="p-6">
      {/* Categories 標題區塊 */}
      <div className="bg-white border border-gray-300 p-6 rounded-lg shadow-md mb-6">
        <h2 className="text-3xl font-bold mb-6">所有分類</h2>
        {categories.length === 0 ? (
          <p className="text-gray-500">目前沒有分類，請新增一個分類</p>
        ) : (
          /* 分類列表 */
          <div className="space-y-4">
            {categories.map((category) => (
              <div 
                key={category.id}
                className="group flex justify-between items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center flex-grow">
                  <Link
                    to={`/category/${encodeURIComponent(category.name)}`}
                    className="text-lg text-gray-800 hover:text-indigo-600"
                  >
                    {category.name}
                  </Link>
                  <span className="ml-2 bg-gray-200 text-gray-700 text-xs font-medium px-2 py-0.5 rounded-full">
                    {category.postCount} 篇文章
                  </span>
                </div>
                <button
                  onClick={() => handleDeleteCategory(category.id)}
                  className="text-red-500 opacity-0 group-hover:opacity-100 transition-opacity px-2 py-1 text-sm hover:bg-red-50 rounded"
                  title="刪除分類"
                >
                  刪除
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 新增分類表單 */}
      <div className="bg-white border border-gray-300 p-6 rounded-lg shadow-md">
        <h3 className="text-2xl font-semibold mb-4">新增分類</h3>
        <form onSubmit={handleCreateCategory} className="space-y-4">
          <div>
            <label htmlFor="categoryName" className="block text-sm font-medium text-gray-700">
              分類名稱
            </label>
            <input
              id="categoryName"
              type="text"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              placeholder="輸入分類名稱"
            />
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button
            type="submit"
            className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            創建分類
          </button>
        </form>
      </div>
    </div>
  );
};

export default Categories;