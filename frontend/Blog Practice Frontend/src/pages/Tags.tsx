import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';

interface Tag {
  id: string;
  name: string;
  postCount: number;
}

const Tags = () => {
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [newTagName, setNewTagName] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  // 從後端獲取標籤數據
  const fetchTags = async () => {
    try {
      const response = await api.get('/api/v1/tags');
      setTags(response.data);
      setLoading(false);
    } catch (err) {
      console.error('載入標籤失敗:', err);
      setError('載入標籤失敗，請稍後再試');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTags();
  }, []);

  // 處理新增標籤
  const handleCreateTag = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTagName.trim()) {
      setError('標籤名稱不能為空');
      return;
    }

    try {
      await api.post('/api/v1/tags', { names: [newTagName] });
      await fetchTags();
      setNewTagName('');
      setError(null);
    } catch (err) {
      console.error('創建標籤失敗:', err);
      setError('創建標籤失敗，請確認名稱是否重複或稍後再試');
    }
  };

  // 處理刪除標籤
  const handleDeleteTag = async (id: string) => {
    if (!window.confirm('確定要刪除這個標籤嗎？此操作無法復原。')) {
      return;
    }

    try {
      await api.delete(`/api/v1/tags/${id}`);
      await fetchTags();
    } catch (err) {
      console.error('刪除標籤失敗:', err);
      setError('刪除標籤失敗，請稍後再試');
    }
  };

  if (loading) {
    return <div className="text-center p-6">載入中...</div>;
  }

  return (
    <div className="p-6">
      {/* 標籤標題區塊 */}
      <div className="bg-white border border-gray-300 p-6 rounded-lg shadow-md mb-6">
        <h2 className="text-3xl font-bold mb-6">所有標籤</h2>
        {tags.length === 0 ? (
          <p className="text-gray-500">目前沒有標籤，請新增一個標籤</p>
        ) : (
          /* 標籤列表 */
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <div 
                key={tag.id}
                className="group flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center">
                  <Link
                    to={`/tag/${encodeURIComponent(tag.name)}`}
                    className="text-lg text-gray-800 hover:text-indigo-600"
                  >
                    #{tag.name}
                  </Link>
                  {tag.postCount > 0 && (
                    <span className="ml-2 bg-gray-200 text-gray-700 text-xs font-medium px-2 py-0.5 rounded-full">
                      {tag.postCount}
                    </span>
                  )}
                </div>
                <button
                  onClick={() => handleDeleteTag(tag.id)}
                  className="text-red-500 opacity-0 group-hover:opacity-100 transition-opacity px-2 py-1 text-sm hover:bg-red-50 rounded"
                  title="刪除標籤"
                >
                  刪除
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 新增標籤表單 */}
      <div className="bg-white border border-gray-300 p-6 rounded-lg shadow-md">
        <h3 className="text-2xl font-semibold mb-4">新增標籤</h3>
        <form onSubmit={handleCreateTag} className="space-y-4">
          <div>
            <label htmlFor="tagName" className="block text-sm font-medium text-gray-700">
              標籤名稱
            </label>
            <input
              id="tagName"
              type="text"
              value={newTagName}
              onChange={(e) => setNewTagName(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              placeholder="輸入標籤名稱"
            />
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button
            type="submit"
            className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            新增標籤
          </button>
        </form>
      </div>
    </div>
  );
};

export default Tags;
