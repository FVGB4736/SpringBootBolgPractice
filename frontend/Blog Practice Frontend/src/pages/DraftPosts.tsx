// src/pages/DraftPosts.tsx
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';

interface DraftItem {
  id: string;
  title: string;
  updatedAt: string;
}

export default function DraftPosts() {
  const [drafts, setDrafts] = useState<DraftItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get('/api/v1/posts/drafts');
        setDrafts(res.data);
      } catch (e: any) {
        setError('載入草稿失敗');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-600">{error}</div>;

  return (
    <div className="max-w-3xl mx-auto">
      <div className="rounded-2xl border border-gray-200 bg-white shadow-sm p-6">
        <h1 className="text-3xl font-bold mb-4">Draft Posts</h1>
        {drafts.length === 0 ? (
          <div className="text-gray-500">目前沒有草稿</div>
        ) : (
          <div className="space-y-3">
            {drafts.map(d => (
              <Link key={d.id} to={`/posts/new?id=${d.id}`} className="block rounded-xl border border-gray-200 p-4 hover:bg-gray-50">
                <div className="font-medium">{d.title}</div>
                <div className="text-sm text-gray-500">Updated at: {new Date(d.updatedAt).toLocaleString()}</div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}


