// src/pages/CreateNewPost.tsx
import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api';

interface Category { id: string; name: string }
interface Tag { id: string; name: string }

export default function CreateNewPost() {
  const navigate = useNavigate();
  const { setError } = useAuth();
  const [searchParams] = useSearchParams();
  const editingId = searchParams.get('id');

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [selectedTagIds, setSelectedTagIds] = useState<string[]>([]);
  const [status, setStatus] = useState<'DRAFT' | 'PUBLISHED'>('DRAFT');

  const [categories, setCategories] = useState<Category[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const init = async () => {
      try {
        const [catRes, tagRes] = await Promise.all([
          api.get('/api/v1/categories'),
          api.get('/api/v1/tags')
        ]);
        setCategories(catRes.data);
        setTags(tagRes.data);
      } catch (e: any) {
        setError('載入分類或標籤失敗');
      }
    };
    init();
  }, [setError]);

  useEffect(() => {
    const loadIfEditing = async () => {
      if (!editingId) return;
      try {
        const res = await api.get(`/api/v1/posts/${editingId}`);
        const p = res.data;
        setTitle(p.title);
        setContent(p.content);
        setCategoryId(p.category.id);
        setSelectedTagIds(p.tags.map((t: Tag) => t.id));
        setStatus(p.status);
      } catch (e) {
        setError('載入貼文失敗');
      }
    };
    loadIfEditing();
  }, [editingId, setError]);

  const canSubmit = useMemo(() => title.trim().length >= 3 && content.trim().length >= 3 && categoryId, [title, content, categoryId]);

  const toggleTag = (id: string) => {
    setSelectedTagIds(prev => {
      // 創建一個新的陣列來確保狀態更新觸發
      const newSelectedTagIds = prev.includes(id) 
        ? prev.filter(t => t !== id) 
        : [...prev, id];
      console.log('Toggling tag:', id, 'New state:', newSelectedTagIds);
      return newSelectedTagIds;
    });
  };

  const handleSubmit = async () => {
    if (!canSubmit) return;
    setLoading(true);
    try {
      // 確保 categoryId 是 UUID 格式
      const categoryUuid = categoryId;
      
      // 將選中的標籤 ID 轉換為 Set<UUID> 格式
      const tagsIdSet = new Set<string>(selectedTagIds);
      
      const payload = {
        title: title.trim(),
        content: content.trim(),
        categoryId: categoryUuid,
        tagsId: Array.from(tagsIdSet), // 將 Set 轉換為陣列
        status
      };

      console.log('Sending payload:', JSON.stringify(payload, null, 2));
      
      if (editingId) {
        await api.put(`/api/v1/posts/${editingId}`, payload);
      } else {
        await api.post('/api/v1/posts', payload);
      }
      navigate('/');
    } catch (e: any) {
      console.error('Error saving post:', e);
      console.error('Response data:', e.response?.data);
      setError(e.response?.data?.message || '儲存失敗，請稍後再試');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="rounded-2xl border border-gray-200 bg-white shadow-sm p-6">
        <div className="flex items-center gap-3 mb-6">
          <button onClick={() => navigate(-1)} className="px-4 py-2 rounded-xl bg-gray-100 hover:bg-gray-200">Back</button>
          <h1 className="text-3xl font-bold">{editingId ? 'Edit Post' : 'Create New Post'}</h1>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm text-gray-700 mb-1">Title</label>
            <input value={title} onChange={e => setTitle(e.target.value)} className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label className="block text-sm text-gray-700 mb-1">Content</label>
            <textarea value={content} onChange={e => setContent(e.target.value)} rows={10} className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label className="block text-sm text-gray-700 mb-1">Category</label>
            <select value={categoryId} onChange={e => setCategoryId(e.target.value)} className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="">選擇分類</option>
              {categories.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">標籤</label>
            <div className="flex flex-wrap gap-2">
              {tags.map(tag => {
                const isSelected = selectedTagIds.includes(tag.id);
                return (
                  <button
                    key={tag.id}
                    type="button"
                    onClick={() => toggleTag(tag.id)}
                    className={`
                      px-4 py-2 rounded-full text-sm font-medium transition-all duration-200
                      ${isSelected 
                        ? 'bg-blue-500 text-white hover:bg-blue-600 shadow-md' 
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}
                      flex items-center gap-1.5
                    `}
                    title={isSelected ? '點擊取消選擇' : '點擊選擇'}
                  >
                    {isSelected && (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                    {tag.name}
                    {isSelected ? null : (
                      <span className="ml-1 text-xs opacity-70">+</span>
                    )}
                  </button>
                );
              })}
            </div>
            {selectedTagIds.length > 0 && (
              <p className="mt-2 text-sm text-gray-500">
                已選擇 {selectedTagIds.length} 個標籤
              </p>
            )}
          </div>
          <div>
            <label className="block text-sm text-gray-700 mb-1">Status</label>
            <select value={status} onChange={e => setStatus(e.target.value as 'DRAFT' | 'PUBLISHED')} className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="DRAFT">Draft</option>
              <option value="PUBLISHED">Published</option>
            </select>
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <button onClick={() => navigate('/')} className="px-4 py-2 rounded-xl bg-gray-100 hover:bg-gray-200">Cancel</button>
          <button disabled={!canSubmit || loading} onClick={handleSubmit} className="px-4 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50">
            {editingId ? 'Update Post' : 'Create Post'}
          </button>
        </div>
      </div>
    </div>
  );
}
